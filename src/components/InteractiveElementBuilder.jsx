import React, { useState } from 'react'
import { Plus, BarChart3, HelpCircle, X } from 'lucide-react'

const InteractiveElementBuilder = ({ onAddElement, subscriptionTier }) => {
  const [elementType, setElementType] = useState('poll')
  const [showBuilder, setShowBuilder] = useState(false)
  const [pollData, setPollData] = useState({
    question: '',
    options: ['', '']
  })
  const [quizData, setQuizData] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  })

  const canAddElements = subscriptionTier !== 'free' || true // Allow for demo purposes

  const handleAddOption = (type) => {
    if (type === 'poll') {
      setPollData({
        ...pollData,
        options: [...pollData.options, '']
      })
    } else {
      setQuizData({
        ...quizData,
        options: [...quizData.options, '']
      })
    }
  }

  const handleRemoveOption = (type, index) => {
    if (type === 'poll') {
      const newOptions = pollData.options.filter((_, i) => i !== index)
      setPollData({ ...pollData, options: newOptions })
    } else {
      const newOptions = quizData.options.filter((_, i) => i !== index)
      setQuizData({ 
        ...quizData, 
        options: newOptions,
        correctAnswer: quizData.correctAnswer >= index ? Math.max(0, quizData.correctAnswer - 1) : quizData.correctAnswer
      })
    }
  }

  const handleUpdateOption = (type, index, value) => {
    if (type === 'poll') {
      const newOptions = [...pollData.options]
      newOptions[index] = value
      setPollData({ ...pollData, options: newOptions })
    } else {
      const newOptions = [...quizData.options]
      newOptions[index] = value
      setQuizData({ ...quizData, options: newOptions })
    }
  }

  const handleCreateElement = () => {
    const data = elementType === 'poll' ? pollData : quizData
    
    if (!data.question.trim() || data.options.some(opt => !opt.trim())) {
      alert('Please fill in all fields')
      return
    }

    onAddElement({
      type: elementType,
      data: { ...data }
    })

    // Reset form
    setPollData({ question: '', options: ['', ''] })
    setQuizData({ question: '', options: ['', '', '', ''], correctAnswer: 0 })
    setShowBuilder(false)
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Interactive Elements</h2>
        {!showBuilder && (
          <button
            onClick={() => setShowBuilder(true)}
            disabled={!canAddElements}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Element</span>
          </button>
        )}
      </div>

      {!canAddElements && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
          <p className="text-yellow-800 text-sm">
            Upgrade to Pro to add unlimited interactive elements. Free tier is limited to 3 elements per month.
          </p>
        </div>
      )}

      {showBuilder && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Create Interactive Element</h3>
            <button
              onClick={() => setShowBuilder(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setElementType('poll')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                elementType === 'poll' ? 'bg-primary text-white' : 'bg-white border'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Poll</span>
            </button>
            <button
              onClick={() => setElementType('quiz')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                elementType === 'quiz' ? 'bg-primary text-white' : 'bg-white border'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Quiz</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question
              </label>
              <input
                type="text"
                value={elementType === 'poll' ? pollData.question : quizData.question}
                onChange={(e) => {
                  if (elementType === 'poll') {
                    setPollData({ ...pollData, question: e.target.value })
                  } else {
                    setQuizData({ ...quizData, question: e.target.value })
                  }
                }}
                placeholder={`Enter your ${elementType} question`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Options
                </label>
                <button
                  onClick={() => handleAddOption(elementType)}
                  className="text-primary hover:text-blue-600 text-sm font-medium"
                >
                  + Add Option
                </button>
              </div>
              
              <div className="space-y-2">
                {(elementType === 'poll' ? pollData.options : quizData.options).map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    {elementType === 'quiz' && (
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={quizData.correctAnswer === index}
                        onChange={() => setQuizData({ ...quizData, correctAnswer: index })}
                        className="text-primary"
                      />
                    )}
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleUpdateOption(elementType, index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {(elementType === 'poll' ? pollData.options : quizData.options).length > 2 && (
                      <button
                        onClick={() => handleRemoveOption(elementType, index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {elementType === 'quiz' && (
                <p className="text-xs text-gray-500 mt-1">
                  Select the radio button next to the correct answer
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowBuilder(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateElement}
                className="btn-primary"
              >
                Create {elementType}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InteractiveElementBuilder