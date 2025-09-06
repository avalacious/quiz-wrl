'use client'

import { useState } from 'react'
import { Upload, XCircle } from 'lucide-react'
import QuizControls from '../components/QuizControls'
import QuizResults from '../components/QuizResults'

export default function HomePage() {
  const [file, setFile] = useState(null)
  const [topicInput, setTopicInput] = useState('')
  const [syllabusInput, setSyllabusInput] = useState('')
  const [quizData, setQuizData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [inputType, setInputType] = useState('pdf')

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
      setError('')
    } else {
      setFile(null)
      setError('Please select a valid PDF file.')
    }
  }

  const handleGenerate = async (settings) => {
    console.log('Generate button clicked', { inputType, file, topicInput, settings })
    
    if ((inputType === 'pdf' && !file) || (inputType === 'text' && !topicInput && !syllabusInput)) {
      setError('Please provide input to generate the quiz.')
      return
    }

    setIsLoading(true)
    setError('')

    const formData = new FormData()
    formData.append('inputType', inputType)
    formData.append('settings', JSON.stringify(settings))

    if (inputType === 'pdf' && file) {
      formData.append('pdf', file)
    } else if (inputType === 'text') {
      if (topicInput) formData.append('topicInput', topicInput)
      if (syllabusInput) formData.append('syllabusInput', syllabusInput)
    }

    try {
      console.log('Calling API...')
      const response = await fetch('/api', {
        method: 'POST',
        body: formData,
      })

      console.log('Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Response error:', errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log('Quiz data received:', data)

      setQuizData(data)
    } catch (err) {
      console.error('Quiz generation error:', err)
      setError(err.message || 'An unexpected error occurred.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setQuizData(null)
    setFile(null)
    setTopicInput('')
    setSyllabusInput('')
    setError('')
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900 text-white">
      <div className="w-full max-w-4xl">
        <div className="glass-effect rounded-3xl p-8 mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Quiz Generator</h1>
            <p className="text-white/60">Generate a quiz from a PDF or text with AI.</p>
          </div>

          {!quizData ? (
            <>
              <div className="flex justify-center mb-6">
                <button
                  onClick={() => setInputType('pdf')}
                  className={`px-6 py-2 rounded-l-full font-semibold transition-colors ${
                    inputType === 'pdf'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-white/60'
                  }`}
                >
                  From PDF
                </button>
                <button
                  onClick={() => setInputType('text')}
                  className={`px-6 py-2 rounded-r-full font-semibold transition-colors ${
                    inputType === 'text'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-white/60'
                  }`}
                >
                  From Text
                </button>
              </div>

              {inputType === 'pdf' ? (
                <div className="flex items-center justify-center w-full mb-6">
                  <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
                    {file ? (
                      <div className="flex items-center space-x-2 text-green-400">
                        <span className="text-lg">{file.name}</span>
                        <XCircle size={20} onClick={(e) => { e.stopPropagation(); setFile(null); }} className="cursor-pointer text-white/60 hover:text-white transition-colors" />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload size={32} className="mb-3 text-white/40" />
                        <p className="mb-2 text-sm text-white/60"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-white/40">PDF only</p>
                      </div>
                    )}
                    <input id="dropzone-file" type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                  </label>
                </div>
              ) : (
                <div className="mb-6 space-y-4">
                  <div>
                    <label htmlFor="topic" className="block text-white/80 text-sm font-medium mb-2">Topic or Subject</label>
                    <input
                      id="topic"
                      type="text"
                      value={topicInput}
                      onChange={(e) => setTopicInput(e.target.value)}
                      placeholder="e.g., The American Revolution"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="syllabus" className="block text-white/80 text-sm font-medium mb-2">Syllabus or Detailed Content (Optional)</label>
                    <textarea
                      id="syllabus"
                      rows="4"
                      value={syllabusInput}
                      onChange={(e) => setSyllabusInput(e.target.value)}
                      placeholder="Paste your study material here..."
                      className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-blue-400 focus:outline-none"
                    ></textarea>
                  </div>
                </div>
              )}

              {error && (
                <div className="text-center text-red-400 mb-4 p-4 bg-red-900/20 rounded-lg border border-red-500/30">
                  {error}
                </div>
              )}
              
              <QuizControls onGenerate={handleGenerate} isLoading={isLoading} />
            </>
          ) : (
            <div>
              <div className="mb-6 flex justify-end">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-white/10 text-white/80 rounded-lg hover:bg-white/20 transition-colors"
                >
                  Generate New Quiz
                </button>
              </div>
              <QuizResults data={quizData} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
