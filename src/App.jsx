import React, { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Header from './components/Header'
import ContentUploader from './components/ContentUploader'
import InteractiveElementBuilder from './components/InteractiveElementBuilder'
import AISummaryGenerator from './components/AISummaryGenerator'
import EmbeddableWidget from './components/EmbeddableWidget'
import PricingTiers from './components/PricingTiers'
import AuthModal from './components/AuthModal'
import { Sparkles, Zap, Share2, LogIn } from 'lucide-react'
import { dbHelpers } from './lib/supabase'

function AppContent() {
  const { user, profile, getSubscriptionTier, isAuthenticated, isLoading } = useAuth()
  const [currentView, setCurrentView] = useState('home')
  const [contentData, setContentData] = useState(null)
  const [interactiveElements, setInteractiveElements] = useState([])
  const [aiSummary, setAiSummary] = useState('')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [savedContentItems, setSavedContentItems] = useState([])

  const subscriptionTier = getSubscriptionTier()

  // Load saved content items when user is authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      loadContentItems()
    }
  }, [isAuthenticated, isLoading])

  const loadContentItems = async () => {
    try {
      const items = await dbHelpers.getContentItems()
      setSavedContentItems(items)
    } catch (error) {
      console.error('Error loading content items:', error)
    }
  }

  const handleContentUpload = async (data) => {
    setContentData(data)
    setCurrentView('enhance')
    
    // Track analytics
    if (isAuthenticated) {
      await dbHelpers.trackUserAction('content_uploaded', { 
        title: data.title,
        hasUrl: !!data.url 
      })
    }
  }

  const handleAddInteractiveElement = async (element) => {
    const newElement = { ...element, id: Date.now() }
    setInteractiveElements([...interactiveElements, newElement])
    
    // Track analytics
    if (isAuthenticated) {
      await dbHelpers.trackUserAction('interactive_element_added', { 
        type: element.type 
      })
    }
  }

  const handleGenerateSummary = async (summary) => {
    setAiSummary(summary)
    
    // Track analytics
    if (isAuthenticated) {
      await dbHelpers.trackUserAction('ai_summary_generated', { 
        summaryLength: summary.length 
      })
    }
  }

  const handleSaveContent = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }

    try {
      const savedItem = await dbHelpers.createContentItem({
        title: contentData.title,
        content: contentData.content,
        url: contentData.url,
        interactiveElements,
        aiSummary
      })
      
      setSavedContentItems([savedItem, ...savedContentItems])
      await dbHelpers.trackUserAction('content_saved', { contentItemId: savedItem.id })
      
      // Show success message or redirect
      alert('Content saved successfully!')
    } catch (error) {
      console.error('Error saving content:', error)
      alert('Failed to save content. Please try again.')
    }
  }

  const handleAuthSuccess = () => {
    // Refresh content items after authentication
    loadContentItems()
  }

  const requireAuth = (action) => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return false
    }
    return true
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ContentSpark...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      <Header 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        subscriptionTier={subscriptionTier}
        onAuthClick={() => setShowAuthModal(true)}
        isAuthenticated={isAuthenticated}
      />
      
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
              {!isAuthenticated && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto">
                  <div className="flex items-center justify-center space-x-2">
                    <LogIn className="w-5 h-5 text-yellow-600" />
                    <p className="text-yellow-800">
                      <button 
                        onClick={() => setShowAuthModal(true)}
                        className="font-semibold text-primary hover:underline"
                      >
                        Sign up for free
                      </button> to save your content and unlock premium features!
                    </p>
                  </div>
                </div>
              )}
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
            
            {/* Show saved content items for authenticated users */}
            {isAuthenticated && savedContentItems.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Your Saved Content</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedContentItems.slice(0, 6).map((item) => (
                    <div key={item.id} className="card text-left">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">{item.content_text}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                        <span>{item.interactive_elements?.length || 0} elements</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === 'enhance' && contentData && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Content Preview</h2>
                  {isAuthenticated && (
                    <button
                      onClick={handleSaveContent}
                      className="btn-primary text-sm px-4 py-2"
                    >
                      Save Content
                    </button>
                  )}
                </div>
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
                requireAuth={requireAuth}
              />
              
              <AISummaryGenerator 
                content={contentData.content}
                onGenerateSummary={handleGenerateSummary}
                subscriptionTier={subscriptionTier}
                requireAuth={requireAuth}
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
            onSelectTier={(tier) => {
              if (requireAuth()) {
                // Handle subscription upgrade logic here
                console.log('Upgrading to:', tier)
              }
            }}
            isAuthenticated={isAuthenticated}
            onAuthClick={() => setShowAuthModal(true)}
          />
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
