import React from 'react'
import { Sparkles, Home, CreditCard } from 'lucide-react'

const Header = ({ currentView, setCurrentView, subscriptionTier }) => {
  const getTierBadge = () => {
    const tierColors = {
      free: 'bg-gray-100 text-gray-800',
      pro: 'bg-primary text-white',
      premium: 'bg-accent text-white'
    }
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${tierColors[subscriptionTier]}`}>
        {subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)}
      </span>
    )
  }

  return (
    <header className="bg-surface shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">ContentSpark</h1>
          </div>
          
          <nav className="flex items-center space-x-6">
            <button
              onClick={() => setCurrentView('home')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                currentView === 'home' ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
            
            <button
              onClick={() => setCurrentView('pricing')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                currentView === 'pricing' ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Pricing</span>
            </button>
            
            {getTierBadge()}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header