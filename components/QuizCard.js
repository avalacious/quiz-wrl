'use client'

import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

export default function QuizCard({ question, index, showAnswer }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex-1">
            <span className="text-blue-400 mr-2">Q{index + 1}.</span>
            {question.question}
          </h3>
          <span className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded text-sm ml-4">
            {question.type === 'mcq' ? 'Multiple Choice' : 'True/False'}
          </span>
        </div>

        {question.type === 'mcq' && (
          <div className="space-y-2 mb-4">
            {question.options.map((option, i) => (
              <div key={i} className="text-white/80 pl-4">
                <span className="font-medium text-blue-400 mr-2">
                  {String.fromCharCode(65 + i)})
                </span>
                {option}
              </div>
            ))}
          </div>
        )}

        {showAnswer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 mt-4"
          >
            <span className="text-green-400 font-medium">Answer: </span>
            <span className="text-white">{question.answer}</span>
          </motion.div>
        )}

        {question.explanation && (
          <div className="mt-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center text-white/60 hover:text-white transition-colors"
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              <span className="ml-1">Explanation</span>
            </button>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-2 text-white/70 bg-white/5 p-3 rounded-lg"
              >
                {question.explanation}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
