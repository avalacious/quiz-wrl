import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { message, context } = await request.json();
    
    const prompt = `You are a helpful study assistant. Context: ${context}
    Student question: ${message}
    Give a helpful, concise response (max 100 words) to assist with their studies.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      })
    });

    const data = await response.json();
    const reply = data.candidates[0].content.parts[0].text;
    return NextResponse.json({ reply });

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Chat failed' }, { status: 500 });
  }
}
