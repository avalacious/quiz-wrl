import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type') || '';

    // --- PDF UPLOAD ---
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('pdf');

      if (!file) {
        return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // dynamic import for vercel
      const pdf = (await import('pdf-parse')).default;
      const data = await pdf(buffer);

      const prompt = `Generate a quiz (5-10 questions with answers) from the following content:\n\n${data.text.slice(
        0,
        4000
      )}`;

      const reply = await callGemini(prompt);
      return NextResponse.json({ quiz: reply, pages: data.numpages });
    }

    // --- TEXT INPUT ---
    const body = await request.json();
    const prompt =
      body.prompt || body.topicInput || body.syllabusInput || 'Explain how AI works in a few words';

    const reply = await callGemini(prompt);
    return NextResponse.json({ quiz: reply });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content', details: error.message },
      { status: 500 }
    );
  }
}

async function callGemini(prompt) {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) throw new Error('API key not configured.');

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 500 },
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'Gemini API request failed');

  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
}
