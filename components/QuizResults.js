import { useState } from 'react'
import { Download, FileText, Eye, EyeOff } from 'lucide-react'

function QuizResults({ data }) {
  const [showAnswers, setShowAnswers] = useState(false)

  if (!data || !data.questions) {
    return (
      <div className="text-center text-white/60">
        <p>No quiz data available</p>
      </div>
    )
  }

  const exportToTxt = () => {
    let content = `Quiz Questions\n${'='.repeat(50)}\n\n`
    
    data.questions.forEach((q, index) => {
      content += `${index + 1}. ${q.question}\n`
      if (q.type === 'mcq' && q.options) {
        q.options.forEach((option, i) => {
          content += `   ${String.fromCharCode(65 + i)}) ${option}\n`
        })
      }
      if (showAnswers) {
        content += `   Answer: ${q.answer}\n`
      }
      content += '\n'
    })

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'quiz.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportToCSV = () => {
    let csv = 'Question,Type,Options,Answer\n'
    
    data.questions.forEach((q) => {
      const options = q.options ? q.options.join(';') : ''
      csv += `"${q.question.replace(/"/g, '""')}","${q.type}","${options}","${q.answer}"\n`
    })

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'quiz.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={exportToTxt}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FileText size={18} />
            <span>Export TXT</span>
          </button>
          
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Download size={18} />
            <span>Export CSV</span>
          </button>
        </div>
        
        <button
          onClick={() => setShowAnswers(!showAnswers)}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          {showAnswers ? <EyeOff size={18} /> : <Eye size={18} />}
          <span>{showAnswers ? 'Hide Answers' : 'Show Answers'}</span>
        </button>
      </div>

      <div className="space-y-4">
        {data.questions.map((question, index) => (
          <div key={index} className="bg-white/5 rounded-lg p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                {index + 1}. {question.question}
              </h3>
              <span className="inline-block px-2 py-1 bg-blue-600/20 text-blue-300 rounded text-sm">
                {question.type.toUpperCase()}
              </span>
            </div>

            {question.type === 'mcq' && question.options && (
              <div className="mb-4 space-y-2">
                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className={`p-3 rounded-lg border ${
                      showAnswers && option === question.answer
                        ? 'bg-green-600/20 border-green-500 text-green-300'
                        : 'bg-white/5 border-white/20 text-white/80'
                    }`}
                  >
                    <span className="font-medium">
                      {String.fromCharCode(65 + optionIndex)}) 
                    </span>
                    <span className="ml-2">{option}</span>
                  </div>
                ))}
              </div>
            )}

            {showAnswers && (
              <div className="mt-4 p-3 bg-green-600/10 border border-green-500/30 rounded-lg">
                <span className="text-green-300 font-semibold">Answer: </span>
                <span className="text-white">{question.answer}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuizResults
