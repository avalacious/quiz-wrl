import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('pdf')
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Dynamic import for pdf-parse to avoid build issues
    const pdf = (await import('pdf-parse')).default
    const data = await pdf(buffer)
    
    return NextResponse.json({ 
      text: data.text,
      pages: data.numpages 
    })
  } catch (error) {
    console.error('PDF parsing error:', error)
    return NextResponse.json(
      { error: 'Failed to parse PDF. Please ensure the file is a valid PDF.' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const maxDuration = 30
