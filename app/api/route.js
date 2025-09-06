import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    console.log('API called - POST request received')
    
    const formData = await request.formData()
    const inputType = formData.get('inputType')
    const settings = JSON.parse(formData.get('settings') || '{}')
    
    console.log('Input type:', inputType)
    console.log('Settings:', settings)
    
    // Return sample quiz data
    const quizData = {
      questions: [
        {
          question: "What is the primary functional group in alcohols?",
          type: "mcq",
          options: ["Hydroxyl (-OH)", "Carbonyl (C=O)", "Carboxyl (-COOH)", "Amino (-NH2)"],
          answer: "Hydroxyl (-OH)"
        },
        {
          question: "Which compound is an alkane?",
          type: "mcq",
          options: ["C2H4", "C2H6", "C2H2", "C6H6"],
          answer: "C2H6"
        },
        {
          question: "Benzene has alternating single and double bonds.",
          type: "mcq",
          options: ["True", "False"],
          answer: "False"
        },
        {
          question: "What happens when alkenes react with hydrogen?",
          type: "mcq",
          options: ["Substitution", "Elimination", "Addition", "Oxidation"],
          answer: "Addition"
        },
        {
          question: "Which functional group is in aldehydes?",
          type: "mcq",
          options: ["Hydroxyl", "Carbonyl at chain end", "Carboxyl", "Ester"],
          answer: "Carbonyl at chain end"
        }
      ],
      metadata: {
        topic: "Sample Chemistry Quiz",
        questionCount: 5,
        difficulty: settings.difficulty || 'medium'
      }
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    console.log('Returning quiz data:', quizData)
    return NextResponse.json(quizData)
    
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate quiz', details: error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Quiz Generator API is running!',
    timestamp: new Date().toISOString()
  })
}
