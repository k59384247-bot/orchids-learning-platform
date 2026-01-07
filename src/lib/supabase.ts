import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type User = {
  id: string
  email: string
  full_name: string | null
  preferences: {
    domain: string | null
    explanation_style: 'simple' | 'technical'
    onboarded: boolean
  }
  created_at: string
  updated_at: string
}

export type Course = {
  id: string
  user_id: string
  title: string
  domain: string | null
  semester: string | null
  professor: string | null
  progress: number
  created_at: string
  updated_at: string
}

export type Document = {
  id: string
  course_id: string
  filename: string
  storage_url: string | null
  status: 'pending' | 'processing' | 'ready' | 'error'
  created_at: string
}

export type Chunk = {
  id: string
  document_id: string
  sequence: number
  content: string
  word_count: number | null
  created_at: string
}

export type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export type ChatHistory = {
  id: string
  course_id: string
  user_id: string
  messages: ChatMessage[]
  created_at: string
  updated_at: string
}
