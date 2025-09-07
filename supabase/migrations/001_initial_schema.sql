-- ContentSpark Database Schema
-- Based on PRD specifications

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'premium')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Items table
CREATE TABLE public.content_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  original_content_url TEXT,
  content_text TEXT NOT NULL,
  embed_code TEXT,
  interactive_elements_config JSONB DEFAULT '[]'::jsonb,
  ai_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interactive Elements table
CREATE TABLE public.interactive_elements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content_item_id UUID REFERENCES public.content_items(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('poll', 'quiz', 'hotspot')),
  config JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Analytics table (for tracking usage)
CREATE TABLE public.user_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  content_item_id UUID REFERENCES public.content_items(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'content_created', 'element_added', 'summary_generated', etc.
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactive_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;

-- Users can only see and modify their own data
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Content items policies
CREATE POLICY "Users can view own content items" ON public.content_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own content items" ON public.content_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own content items" ON public.content_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own content items" ON public.content_items
  FOR DELETE USING (auth.uid() = user_id);

-- Interactive elements policies
CREATE POLICY "Users can view own interactive elements" ON public.interactive_elements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.content_items 
      WHERE id = interactive_elements.content_item_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create interactive elements for own content" ON public.interactive_elements
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.content_items 
      WHERE id = interactive_elements.content_item_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own interactive elements" ON public.interactive_elements
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.content_items 
      WHERE id = interactive_elements.content_item_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own interactive elements" ON public.interactive_elements
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.content_items 
      WHERE id = interactive_elements.content_item_id 
      AND user_id = auth.uid()
    )
  );

-- Analytics policies
CREATE POLICY "Users can view own analytics" ON public.user_analytics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own analytics" ON public.user_analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions for automatic user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, subscription_tier)
  VALUES (NEW.id, NEW.email, 'free');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_items_updated_at
  BEFORE UPDATE ON public.content_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_content_items_user_id ON public.content_items(user_id);
CREATE INDEX idx_content_items_created_at ON public.content_items(created_at DESC);
CREATE INDEX idx_interactive_elements_content_item_id ON public.interactive_elements(content_item_id);
CREATE INDEX idx_user_analytics_user_id ON public.user_analytics(user_id);
CREATE INDEX idx_user_analytics_created_at ON public.user_analytics(created_at DESC);
