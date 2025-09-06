'use client';

import { useState } from 'react';
import { Upload, XCircle } from 'lucide-react';
import QuizControls from './components/QuizControls';
import QuizResults from './components/QuizResults';

export default function HomePage() {
  const [file, setFile] = useState(null);
  const [topicInput, setTopicInput] = useState('');
  const [syllabusInput, setSyllabusInput] = useState('');
  const [quizData, setQuizData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [inputType, setInputType] = useState('text');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
      setInputType('pdf');
    } else {
      setFile(null);
      setError('Please select a valid PDF file.');
    }
  };

  const handleGenerate = async (settings) => {
    if ((inputType === 'pdf' && !file) || (inputType === 'text' && !topicInput && !syllabusInput)) {
      setError('Please provide input to generate the quiz.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      let response;

      if (inputType === 'pdf') {
        const formData = new FormData();
        formData.append('pdf', file);
        response = await fetch('/api', { method: 'POST', body: formData });
      } else {
        response = await fetch('/api', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            inputType,
            topicInput,
            syllabusInput,
            settings,
          }),
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      setQuizData(data);
    } catch (err) {
      console.error('Quiz generation error:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Quiz Generator</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {/* PDF Upload */}
      <div className="mb-4">
        <input type="file" accept="application/pdf" onChange={handleFileChange} className="mb-2" />
        {file && (
          <div className="flex items-center gap-2">
            <span>{file.name}</span>
            <XCircle
              className="cursor-pointer text-red-500"
              onClick={() => setFile(null)}
              size={20}
            />
          </div>
        )}
      </div>

      {/* Text Inputs */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter topic"
          value={topicInput}
          onChange={(e) => {
            setTopicInput(e.target.value);
            setInputType('text');
          }}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Enter syllabus"
          value={syllabusInput}
          onChange={(e) => {
            setSyllabusInput(e.target.value);
            setInputType('text');
          }}
          className="border p-2"
        />
      </div>

      <button
        onClick={() => handleGenerate({ difficulty: 'medium' })}
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {isLoading ? 'Generating...' : 'Generate Quiz'}
      </button>

      {quizData && <QuizResults data={quizData} />}
    </div>
  );
}
