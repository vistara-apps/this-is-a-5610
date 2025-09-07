import React, { useState } from 'react'
import { Code, Copy, Eye, Share2 } from 'lucide-react'

const EmbeddableWidget = ({ contentData, interactiveElements, aiSummary }) => {
  const [selectedWidget, setSelectedWidget] = useState('summary')
  const [copied, setCopied] = useState(false)

  const generateEmbedCode = (type, data) => {
    const baseUrl = window.location.origin
    const widgetId = Math.random().toString(36).substr(2, 9)
    
    const widgetData = encodeURIComponent(JSON.stringify(data))
    
    return `<iframe
  src="${baseUrl}/widget/${type}?data=${widgetData}&id=${widgetId}"
  width="100%"
  height="${type === 'summary' ? '300' : '400'}"
  frameborder="0"
  style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
></iframe>`
  }

  const getEmbedCode = () => {
    switch (selectedWidget) {
      case 'summary':
        return generateEmbedCode('summary', { 
          title: contentData?.title,
          summary: aiSummary 
        })
      case 'interactive':
        if (interactiveElements.length === 0) return '<!-- No interactive elements created yet -->'
        return generateEmbedCode('interactive', {
          elements: interactiveElements
        })
      case 'full':
        return generateEmbedCode('full', {
          title: contentData?.title,
          content: contentData?.content,
          summary: aiSummary,
          elements: interactiveElements
        })
      default:
        return ''
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getEmbedCode())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const hasContent = contentData && (aiSummary || interactiveElements.length > 0)

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Embeddable Widgets</h2>
        <Share2 className="w-5 h-5 text-gray-400" />
      </div>

      {!hasContent ? (
        <div className="text-center py-8 text-gray-500">
          <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">Create content and add interactive elements or AI summaries to generate embeddable widgets.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Widget Type
            </label>
            <select
              value={selectedWidget}
              onChange={(e) => setSelectedWidget(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {aiSummary && (
                <option value="summary">Summary Only</option>
              )}
              {interactiveElements.length > 0 && (
                <option value="interactive">Interactive Elements Only</option>
              )}
              {aiSummary && interactiveElements.length > 0 && (
                <option value="full">Full Enhanced Content</option>
              )}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Embed Code
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={copyToClipboard}
                  className={`flex items-center space-x-1 px-3 py-1 text-xs rounded-md transition-colors ${
                    copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <Copy className="w-3 h-3" />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>
            <textarea
              value={getEmbedCode()}
              readOnly
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-xs font-mono"
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
            <div className="bg-gray-50 p-4 rounded-md border-2 border-dashed border-gray-200">
              {selectedWidget === 'summary' && aiSummary && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">{contentData.title} - Summary</h4>
                  <div className="text-xs text-gray-600 bg-white p-3 rounded">
                    <pre className="whitespace-pre-wrap font-sans">{aiSummary}</pre>
                  </div>
                </div>
              )}
              
              {selectedWidget === 'interactive' && interactiveElements.length > 0 && (
                <div className="space-y-3">
                  {interactiveElements.map((element, index) => (
                    <div key={element.id} className="bg-white p-3 rounded border">
                      <h5 className="font-medium text-sm mb-2">{element.data.question}</h5>
                      <div className="space-y-1">
                        {element.data.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center space-x-2 text-xs">
                            <input 
                              type={element.type === 'poll' ? 'radio' : 'radio'} 
                              name={`preview-${element.id}`}
                              className="w-3 h-3"
                              disabled
                            />
                            <span className="text-gray-600">{option}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {selectedWidget === 'full' && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">{contentData.title}</h4>
                  {aiSummary && (
                    <div className="text-xs text-gray-600 bg-white p-2 rounded">
                      <div className="font-medium mb-1">Summary:</div>
                      <pre className="whitespace-pre-wrap font-sans">{aiSummary.substring(0, 100)}...</pre>
                    </div>
                  )}
                  {interactiveElements.length > 0 && (
                    <div className="text-xs text-gray-600">
                      <div className="font-medium mb-1">Interactive Elements:</div>
                      <div className="bg-white p-2 rounded">
                        {interactiveElements.length} {interactiveElements.length === 1 ? 'element' : 'elements'} included
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmbeddableWidget