import { useState } from 'react'
import { Settings, Download, FileText, Play } from 'lucide-react'

export default function QuizControls({ onGenerate, isLoading }) {
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState({
    questionCount: 10,
    difficulty: 'medium',
    questionTypes: ['mcq', 'true-false', 'short-answer']
  })

  const handleGenerate = () => {
    onGenerate(settings)
  }

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="mt-2 text-white/60">Generating quiz...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white/80 rounded-lg hover:bg-white/20 transition-colors"
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>
        
        <button
          onClick={handleGenerate}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          <Play size={18} />
          <span>Generate Quiz</span>
        </button>
      </div>

      {showSettings && (
        <div className="bg-white/5 rounded-lg p-4 space-y-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Number of Questions
            </label>
            <select
              value={settings.questionCount}
              onChange={(e) => setSettings({...settings, questionCount: parseInt(e.target.value)})}
              className="w-full px-3 py-2 bg-white/10 text-white border border-white/20 rounded focus:outline-none focus:border-blue-400"
            >
              <option value={5}>5 Questions</option>
              <option value={10}>10 Questions</option>
              <option value={15}>15 Questions</option>
              <option value={20}>20 Questions</option>
            </select>
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Difficulty
            </label>
            <select
              value={settings.difficulty}
              onChange={(e) => setSettings({...settings, difficulty: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 text-white border border-white/20 rounded focus:outline-none focus:border-blue-400"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )
}
