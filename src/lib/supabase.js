import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-here'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database helper functions
export const dbHelpers = {
  // User operations
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    
    return { ...user, profile }
  },

  async updateUserProfile(updates) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Content operations
  async createContentItem(contentData) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('content_items')
      .insert({
        user_id: user.id,
        title: contentData.title,
        content_text: contentData.content,
        original_content_url: contentData.url || null,
        interactive_elements_config: contentData.interactiveElements || [],
        ai_summary: contentData.aiSummary || null
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getContentItems() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('content_items')
      .select(`
        *,
        interactive_elements (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async updateContentItem(id, updates) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('content_items')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteContentItem(id) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('content_items')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
  },

  // Interactive elements operations
  async createInteractiveElement(contentItemId, elementData) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Verify user owns the content item
    const { data: contentItem } = await supabase
      .from('content_items')
      .select('id')
      .eq('id', contentItemId)
      .eq('user_id', user.id)
      .single()

    if (!contentItem) throw new Error('Content item not found or access denied')

    const { data, error } = await supabase
      .from('interactive_elements')
      .insert({
        content_item_id: contentItemId,
        type: elementData.type,
        config: elementData.config
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getInteractiveElements(contentItemId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('interactive_elements')
      .select(`
        *,
        content_items!inner (user_id)
      `)
      .eq('content_item_id', contentItemId)
      .eq('content_items.user_id', user.id)

    if (error) throw error
    return data
  },

  // Analytics operations
  async trackUserAction(actionType, metadata = {}, contentItemId = null) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return // Don't throw error for analytics

    try {
      await supabase
        .from('user_analytics')
        .insert({
          user_id: user.id,
          content_item_id: contentItemId,
          action_type: actionType,
          metadata
        })
    } catch (error) {
      console.warn('Failed to track user action:', error)
    }
  },

  async getUserAnalytics(limit = 100) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('user_analytics')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  }
}

// Auth helper functions
export const authHelpers = {
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    if (error) throw error
    return data
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    
    if (error) throw error
  },

  async updatePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })
    
    if (error) throw error
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}
