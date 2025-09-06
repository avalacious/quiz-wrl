'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, X } from 'lucide-react'

export default function FileUpload({ onFileUpload, file }) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0 && files[0].type === 'application/pdf') {
      onFileUpload(files[0])
    }
  }, [onFileUpload])

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      onFileUpload(selectedFile)
    }
  }

  const removeFile = () => {
    onFileUpload(null)
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-white mb-6">Upload Your PDF</h2>
      
      {!file ? (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
            isDragOver
              ? 'border-blue-400 bg-blue-500/20 animate-glow'
              : 'border-white/30 hover:border-white/50'
          }`}
        >
          <Upload className="mx-auto mb-4 text-white" size={48} />
          <p className="text-white text-lg mb-2">
            Drag and drop your PDF here, or click to select
          </p>
          <p className="text-white/60">Supports PDF files up to 10MB</p>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Select File
          </label>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 rounded-2xl p-6 flex items-center justify-between"
        >
          <div className="flex items-center">
            <FileText className="text-green-400 mr-3" size={24} />
            <div>
              <p className="text-white font-medium">{file.name}</p>
              <p className="text-white/60 text-sm">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={removeFile}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            <X size={20} />
          </button>
        </motion.div>
      )}
    </div>
  )
}
