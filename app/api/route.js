import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const pdfFile = formData.get('pdf');
    const topicInput = formData.get('topicInput');
    const syllabusInput = formData.get('syllabusInput');
    const settings = JSON.parse(formData.get('settings') || '{}');
    const inputType = formData.get('inputType');

    let contentForAI = '';
    
    // Handle PDF (keep your existing PDF parsing logic)
    if (pdfFile && inputType === 'pdf') {
      // Use your existing PDF parsing code here
      const buffer = await pdfFile.arrayBuffer();
      // Add your PDF parsing logic
      contentForAI = "PDF content"; // Replace with actual parsing
    } 
    // Handle topic input
    else if (topicInput) {
      contentForAI = `Topic: ${topicInput}${syllabusInput ? '\n\nAdditional Content: ' + syllabusInput : ''}`;
    }
    // Handle syllabus only
    else if (syllabusInput) {
      contentForAI = `Study Material: ${syllabusInput}`;
    }

    // Enhanced prompt for better quiz generation
    const prompt = `
    Create a comprehensive quiz based on: ${contentForAI}

    Quiz Settings:
    - Easy questions: ${settings.easy || 0}
    - Normal questions: ${settings.normal || 0}  
    - Hard questions: ${settings.hard || 0}
    - MCQ questions: ${settings.mcq || 0}
    - Short answer questions: ${settings.shortAnswer || 0}
    - Long answer questions: ${settings.longAnswer || 0}
    - True/False questions: ${settings.truefalse || 0}

    IMPORTANT: Return ONLY valid JSON in this exact format:
    {
      "topic": "Topic name",
      "questions": [
        {
          "id": 1,
          "type": "mcq|shortAnswer|longAnswer|truefalse",
          "difficulty": "easy|normal|hard",
          "question": "Question text here?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": "Option A",
          "explanation": "Why this answer is correct",
          "points": 5
        }
      ],
      "topicCards": [
        {
          "title": "Key Concept 1",
          "summary": "Brief explanation of this concept"
        }
      ]
    }

    Generate questions according to the specified counts and types. Make sure each question has proper difficulty level and type as requested.`;

    // Your existing Gemini API call
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Clean and parse JSON response
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini API');
    }

    const quizData = JSON.parse(jsonMatch[0]);

    // Validate response
    if (!quizData.questions || !Array.isArray(quizData.questions)) {
      throw new Error('Invalid quiz data structure');
    }

    return NextResponse.json(quizData);

  } catch (error) {
    console.error('Quiz generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate quiz. Please try again.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
