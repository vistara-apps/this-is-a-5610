import React, { createContext, useContext, useEffect, useState } from 'react'
import { authHelpers, dbHelpers } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const currentUser = await dbHelpers.getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
          setProfile(currentUser.profile)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setLoading(false)
        setInitialized(true)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = authHelpers.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const currentUser = await dbHelpers.getCurrentUser()
          setUser(currentUser)
          setProfile(currentUser?.profile)
        } catch (error) {
          console.error('Error getting user profile:', error)
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setProfile(null)
      }
      
      if (initialized) {
        setLoading(false)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [initialized])

  const signIn = async (email, password) => {
    setLoading(true)
    try {
      await authHelpers.signIn(email, password)
      // User state will be updated by the auth state change listener
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const signUp = async (email, password) => {
    setLoading(true)
    try {
      const result = await authHelpers.signUp(email, password)
      setLoading(false)
      return result
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      await authHelpers.signOut()
      // User state will be updated by the auth state change listener
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const updateProfile = async (updates) => {
    try {
      const updatedProfile = await dbHelpers.updateUserProfile(updates)
      setProfile(updatedProfile)
      return updatedProfile
    } catch (error) {
      throw error
    }
  }

  const refreshProfile = async () => {
    try {
      const currentUser = await dbHelpers.getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        setProfile(currentUser.profile)
      }
    } catch (error) {
      console.error('Error refreshing profile:', error)
    }
  }

  // Subscription tier helpers
  const getSubscriptionTier = () => {
    return profile?.subscription_tier || 'free'
  }

  const canUseFeature = (feature) => {
    const tier = getSubscriptionTier()
    
    const featureAccess = {
      'ai_summary': tier !== 'free',
      'unlimited_elements': tier !== 'free',
      'advanced_analytics': tier === 'premium',
      'priority_support': tier === 'premium',
      'custom_branding': tier === 'premium'
    }

    return featureAccess[feature] || false
  }

  const getUsageLimits = () => {
    const tier = getSubscriptionTier()
    
    const limits = {
      free: {
        interactive_elements_per_month: 3,
        ai_summaries_per_month: 0,
        content_items: 5
      },
      pro: {
        interactive_elements_per_month: -1, // unlimited
        ai_summaries_per_month: -1, // unlimited
        content_items: -1 // unlimited
      },
      premium: {
        interactive_elements_per_month: -1, // unlimited
        ai_summaries_per_month: -1, // unlimited
        content_items: -1 // unlimited
      }
    }

    return limits[tier] || limits.free
  }

  const value = {
    user,
    profile,
    loading,
    initialized,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshProfile,
    getSubscriptionTier,
    canUseFeature,
    getUsageLimits,
    isAuthenticated: !!user,
    isLoading: loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
