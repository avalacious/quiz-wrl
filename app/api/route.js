import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type') || '';

    // ---------------- PDF INPUT ----------------
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('pdf');

      if (!file) {
        return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const pdf = (await import('pdf-parse')).default;
      const data = await pdf(buffer);

      const prompt = `Generate a quiz based on the following PDF content:\n${data.text.slice(
        0,
        4000
      )}`;

      const reply = await callGemini(prompt);
      return NextResponse.json({ quiz: reply, pages: data.numpages });
    }

    // ---------------- JSON INPUT ----------------
    const body = await request.json();

    // Chat mode
    if (body.message && body.context) {
      const prompt = `You are a helpful study assistant. Context: ${body.context}
      Student question: ${body.message}
      Give a concise response (max 100 words).`;

      const reply = await callGemini(prompt, { maxOutputTokens: 500 });
      return NextResponse.json({ reply });
    }

    // Quiz generation from text/syllabus
    const prompt =
      body.prompt ||
      body.topicInput ||
      body.syllabusInput ||
      'Explain how AI works in a few words';

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

// ---------------- HELPER: Gemini API ----------------
async function callGemini(prompt, config = {}) {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) throw new Error('API key not configured.');

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: config.temperature || 0.7,
          maxOutputTokens: config.maxOutputTokens || 300,
        },
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Gemini API request failed');
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
}
