import React, { useState } from 'react'
import { Upload, Link, FileText } from 'lucide-react'

const ContentUploader = ({ onContentUpload }) => {
  const [uploadType, setUploadType] = useState('url')
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUrlSubmit = async (e) => {
    e.preventDefault()
    if (!url.trim()) return

    setLoading(true)
    try {
      // Simulate URL content extraction
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockContent = `This is extracted content from ${url}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`
      
      onContentUpload({
        url,
        title: title || `Content from ${new URL(url).hostname}`,
        content: mockContent
      })
    } catch (error) {
      console.error('Error processing URL:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTextSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    onContentUpload({
      title: title.trim(),
      content: content.trim()
    })
  }

  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Upload Your Content</h2>
      
      <div className="flex justify-center mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setUploadType('url')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              uploadType === 'url' ? 'bg-white shadow-sm' : 'text-gray-600'
            }`}
          >
            <Link className="w-4 h-4" />
            <span>URL</span>
          </button>
          <button
            onClick={() => setUploadType('text')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              uploadType === 'text' ? 'bg-white shadow-sm' : 'text-gray-600'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Text</span>
          </button>
        </div>
      </div>

      {uploadType === 'url' ? (
        <form onSubmit={handleUrlSubmit} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              Content URL
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/article"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title (Optional)
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Custom title for your content"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Extract Content</span>
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleTextSubmit} className="space-y-4">
          <div>
            <label htmlFor="text-title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              id="text-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your content title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label htmlFor="text-content" className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              id="text-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste or type your content here..."
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <button
            type="submit"
            disabled={!title.trim() || !content.trim()}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <FileText className="w-4 h-4" />
            <span>Continue with Content</span>
          </button>
        </form>
      )}
    </div>
  )
}

export default ContentUploader