import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// IMPORTANT: Set your API key as an environment variable
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY environment variable is not set.');
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(request) {
  try {
    console.log('API called - POST request received');

    const formData = await request.formData();
    const inputType = formData.get('inputType');
    const settings = JSON.parse(formData.get('settings') || '{}');

    console.log('Input type:', inputType);
    console.log('Settings:', settings);

    // Use a specific model. Using gemini-1.5-pro for better performance,
    // but you can switch to gemini-1.0-pro if needed.
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    // Construct a detailed prompt to guide the model to produce valid JSON.
    const prompt = `
      You are a quiz generator. Based on the following input, generate a multiple-choice quiz in JSON format.
      The JSON object should have a single key, "questions", which is an array of question objects.
      Each question object must have the following keys:
      - "question": The question text.
      - "type": "mcq".
      - "options": An array of strings for the multiple-choice options.
      - "answer": The correct answer string, which must be one of the options.

      The quiz should be about the topic "${settings.topic || 'general knowledge'}" and have a difficulty level of "${settings.difficulty || 'medium'}".
      Generate ${settings.questionCount || 5} questions.

      Example of the required JSON format:
      {
        "questions": [
          {
            "question": "Example question?",
            "type": "mcq",
            "options": ["Option A", "Option B"],
            "answer": "Option A"
          }
        ]
      }

      Do not include any text before or after the JSON.
    `;

    // Make the API call to Gemini
    const result = await model.generateContent(prompt);
    const textResponse = await result.response.text();

    console.log('Raw text response from Gemini:', textResponse);

    let quizData;
    try {
      // Attempt to parse the response. This is the crucial step to fix JSON issues.
      // We wrap the parse call in a try-catch block to handle malformed JSON.
      quizData = JSON.parse(textResponse);
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError);
      console.log('Attempting to fix malformed JSON...');

      // A simple fallback for malformed JSON by trying to extract the content
      // between the first and last curly braces.
      const jsonStart = textResponse.indexOf('{');
      const jsonEnd = textResponse.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const potentialJson = textResponse.substring(jsonStart, jsonEnd + 1);
        try {
          quizData = JSON.parse(potentialJson);
        } catch (retryParseError) {
          console.error('Failed to parse fixed JSON:', retryParseError);
          return NextResponse.json(
            { error: 'Failed to generate valid quiz data from AI model.' },
            { status: 500 }
          );
        }
      } else {
        return NextResponse.json(
          { error: 'Failed to generate valid quiz data from AI model.' },
          { status: 500 }
        );
      }
    }

    // Add metadata
    quizData.metadata = {
      topic: settings.topic || 'general knowledge',
      questionCount: quizData.questions.length,
      difficulty: settings.difficulty || 'medium',
    };

    console.log('Returning generated quiz data:', quizData);
    return NextResponse.json(quizData);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Quiz Generator API is running!',
    timestamp: new Date().toISOString(),
  });
}
