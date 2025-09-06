'use client'

import { motion } from 'framer-motion'
import { Download, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import QuizCard from './QuizCard'

export default function QuizResults({ data }) {
  const [showAnswers, setShowAnswers] = useState(false)

  const exportToTxt = () => {
    let content = 'Quiz Questions\n================\n\n'
    
    data.questions.forEach((q, index) => {
      content += `${index + 1}. ${q.question}\n`
      if (q.type === 'mcq') {
        q.options.forEach((option, i) => {
          content += `   ${String.fromCharCode(65 + i)}) ${option}\n`
        })
      }
      content += `   Answer: ${q.answer}\n\n`
    })

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'quiz.txt'
    a.click()
  }

  const exportToCSV = () => {
    let csv = 'Question,Type,Options,Answer\n'
    
    data.questions.forEach(q => {
      const options = q.type === 'mcq' ? q.options.join(';') : 'True;False'
      csv += `"${q.question}","${q.type}","${options}","${q.answer}"\n`
    })

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'quiz.csv'
    a.click()
  }

  return (
    <div className="glass-effect rounded-3xl p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Generated Quiz</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setShowAnswers(!showAnswers)}
            className="flex items-center px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            {showAnswers ? <EyeOff size={16} /> : <Eye size={16} />}
            <span className="ml-2">{showAnswers ? 'Hide' : 'Show'} Answers</span>
          </button>
          <div className="flex gap-2">
            <motion.button
              onClick={exportToTxt}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={16} />
              <span className="ml-2">TXT</span>
            </motion.button>
            <motion.button
              onClick={exportToCSV}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={16} />
              <span className="ml-2">CSV</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {data.questions.map((question, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <QuizCard 
              question={question} 
              index={index} 
              showAnswer={showAnswers}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
