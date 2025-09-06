'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function QuizControls({ onGenerate, isLoading }) {
  const [controls, setControls] = useState({
    questionCount: 5,
    questionType: 'mixed',
    difficulty: 'medium'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onGenerate(controls)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Quiz Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Number of Questions
            </label>
            <select
              value={controls.questionCount}
              onChange={(e) => setControls({...controls, questionCount: parseInt(e.target.value)})}
              className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-blue-400 focus:outline-none"
            >
              <option value={5}>5 Questions</option>
              <option value={10}>10 Questions</option>
              <option value={15}>15 Questions</option>
              <option value={20}>20 Questions</option>
            </select>
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Question Type
            </label>
            <select
              value={controls.questionType}
              onChange={(e) => setControls({...controls, questionType: e.target.value})}
              className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-blue-400 focus:outline-none"
            >
              <option value="mixed">Mixed (MCQ + True/False)</option>
              <option value="mcq">Multiple Choice Only</option>
              <option value="truefalse">True/False Only</option>
            </select>
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Difficulty Level
            </label>
            <select
              value={controls.difficulty}
              onChange={(e) => setControls({...controls, difficulty: e.target.value})}
              className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-blue-400 focus:outline-none"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <Sparkles className="mr-2" size={20} />
          {isLoading ? 'Generating Quiz...' : 'Generate Quiz'}
        </motion.button>
      </form>
    </div>
  )
}
