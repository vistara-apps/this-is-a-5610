import React, { useState } from 'react'
import Header from './components/Header'
import ContentUploader from './components/ContentUploader'
import InteractiveElementBuilder from './components/InteractiveElementBuilder'
import AISummaryGenerator from './components/AISummaryGenerator'
import EmbeddableWidget from './components/EmbeddableWidget'
import PricingTiers from './components/PricingTiers'
import { Sparkles, Zap, Share2 } from 'lucide-react'

function App() {
  const [currentView, setCurrentView] = useState('home')
  const [contentData, setContentData] = useState(null)
  const [interactiveElements, setInteractiveElements] = useState([])
  const [aiSummary, setAiSummary] = useState('')
  const [subscriptionTier, setSubscriptionTier] = useState('free')

  const handleContentUpload = (data) => {
    setContentData(data)
    setCurrentView('enhance')
  }

  const handleAddInteractiveElement = (element) => {
    setInteractiveElements([...interactiveElements, { ...element, id: Date.now() }])
  }

  const handleGenerateSummary = (summary) => {
    setAiSummary(summary)
  }

  return (
    <div className="min-h-screen bg-bg">
      <Header currentView={currentView} setCurrentView={setCurrentView} subscriptionTier={subscriptionTier} />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {currentView === 'home' && (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight text-gray-900">
                Ignite your content with <span className="text-primary">interactive elements</span> and AI insights
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Transform your static content into engaging, interactive experiences with polls, quizzes, and AI-powered summaries.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="card text-center">
                <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Interactive Elements</h3>
                <p className="text-gray-600">Add polls, quizzes, and clickable hotspots to engage your audience.</p>
              </div>
              <div className="card text-center">
                <Sparkles className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">AI Summaries</h3>
                <p className="text-gray-600">Generate intelligent summaries and key takeaways automatically.</p>
              </div>
              <div className="card text-center">
                <Share2 className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Easy Embedding</h3>
                <p className="text-gray-600">Share and embed enhanced content across any platform.</p>
              </div>
            </div>

            <ContentUploader onContentUpload={handleContentUpload} />
          </div>
        )}

        {currentView === 'enhance' && contentData && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="card">
                <h2 className="text-2xl font-bold mb-4">Content Preview</h2>
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-semibold text-lg mb-2">{contentData.title}</h3>
                  <p className="text-gray-700 line-clamp-3">{contentData.content}</p>
                  {contentData.url && (
                    <a href={contentData.url} target="_blank" rel="noopener noreferrer" 
                       className="text-primary hover:underline text-sm mt-2 inline-block">
                      View Original Content →
                    </a>
                  )}
                </div>
              </div>

              <InteractiveElementBuilder 
                onAddElement={handleAddInteractiveElement}
                subscriptionTier={subscriptionTier}
              />
              
              <AISummaryGenerator 
                content={contentData.content}
                onGenerateSummary={handleGenerateSummary}
                subscriptionTier={subscriptionTier}
              />
            </div>

            <div className="space-y-6">
              <EmbeddableWidget 
                contentData={contentData}
                interactiveElements={interactiveElements}
                aiSummary={aiSummary}
              />
            </div>
          </div>
        )}

        {currentView === 'pricing' && (
          <PricingTiers 
            currentTier={subscriptionTier}
            onSelectTier={setSubscriptionTier}
          />
        )}
      </main>
    </div>
  )
}

export default App