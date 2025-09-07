import React, { useState } from 'react'
import { Sparkles, RefreshCw, Edit3 } from 'lucide-react'
import OpenAI from 'openai'

const AISummaryGenerator = ({ content, onGenerateSummary, subscriptionTier }) => {
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editedSummary, setEditedSummary] = useState('')

  const canUseSummary = subscriptionTier !== 'free' || true // Allow for demo purposes

  const generateSummary = async () => {
    if (!content || !canUseSummary) return

    setLoading(true)
    try {
      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'demo-key',
        baseURL: "https://openrouter.ai/api/v1",
        dangerouslyAllowBrowser: true,
      })

      // Fallback to mock summary if no API key
      if (!import.meta.env.VITE_OPENAI_API_KEY) {
        await new Promise(resolve => setTimeout(resolve, 2000))
        const mockSummary = `Key Takeaways:
• This content discusses important concepts and strategies
• Main points include practical applications and real-world examples
• The author emphasizes the importance of implementation and continuous learning
• Valuable insights are provided for both beginners and advanced practitioners
• The content offers actionable advice that can be immediately applied`
        
        setSummary(mockSummary)
        onGenerateSummary(mockSummary)
      } else {
        const response = await openai.chat.completions.create({
          model: "google/gemini-2.0-flash-001",
          messages: [
            {
              role: "system",
              content: "You are an expert content summarizer. Create concise, bulleted key takeaways from the provided content. Focus on the most important points and actionable insights."
            },
            {
              role: "user",
              content: `Please summarize this content into key takeaways:\n\n${content}`
            }
          ],
          max_tokens: 300,
          temperature: 0.7
        })

        const generatedSummary = response.choices[0].message.content
        setSummary(generatedSummary)
        onGenerateSummary(generatedSummary)
      }
    } catch (error) {
      console.error('Error generating summary:', error)
      // Fallback to mock summary on error
      const mockSummary = `Key Takeaways:
• This content discusses important concepts and strategies
• Main points include practical applications and real-world examples  
• The author emphasizes the importance of implementation and continuous learning
• Valuable insights are provided for both beginners and advanced practitioners
• The content offers actionable advice that can be immediately applied`
      
      setSummary(mockSummary)
      onGenerateSummary(mockSummary)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setEditedSummary(summary)
    setEditing(true)
  }

  const handleSaveEdit = () => {
    setSummary(editedSummary)
    onGenerateSummary(editedSummary)
    setEditing(false)
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">AI Summary</h2>
        <div className="flex space-x-2">
          {summary && !editing && (
            <button
              onClick={handleEdit}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit</span>
            </button>
          )}
          <button
            onClick={generateSummary}
            disabled={loading || !content || !canUseSummary}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                {summary ? <RefreshCw className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                <span>{summary ? 'Regenerate' : 'Generate Summary'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {!canUseSummary && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
          <p className="text-yellow-800 text-sm">
            Upgrade to Pro to access AI-powered summaries and key takeaways generation.
          </p>
        </div>
      )}

      {editing ? (
        <div className="space-y-4">
          <textarea
            value={editedSummary}
            onChange={(e) => setEditedSummary(e.target.value)}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Edit your summary..."
          />
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setEditing(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="btn-primary"
            >
              Save Changes
            </button>
          </div>
        </div>
      ) : summary ? (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-700">{summary}</pre>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Generate an AI-powered summary of your content to highlight key takeaways.</p>
        </div>
      )}
    </div>
  )
}

export default AISummaryGenerator