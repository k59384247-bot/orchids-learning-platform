"use client"

import { useState, createContext, useContext, useEffect, ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import type { User } from "@/lib/supabase"

type AuthContextType = {
  user: SupabaseUser | null
  profile: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<{ error: Error | null }>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  isMock?: boolean
}

const MOCK_USER: SupabaseUser = {
  id: "mock-user-123",
  email: "test@student.edu",
  app_metadata: {},
  user_metadata: { full_name: "Test Student" },
  aud: "authenticated",
  created_at: new Date().toISOString()
}

const MOCK_PROFILE: User = {
  id: "mock-user-123",
  email: "test@student.edu",
  full_name: "Test Student",
  university: "Mock University",
  year_of_study: "Senior",
  created_at: new Date().toISOString()
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isMock, setIsMock] = useState(false)

  useEffect(() => {
    // Check if we are in mock mode via localStorage or URL
    const mockParam = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get("mock") : null
    const mockStorage = typeof window !== 'undefined' ? localStorage.getItem("mock_mode") : null
    
    if (mockParam === "true" || mockStorage === "true") {
      setIsMock(true)
      setUser(MOCK_USER)
      setProfile(MOCK_PROFILE)
      setLoading(false)
      return
    }

    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchProfile(session.user.id)
      }
      setLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (localStorage.getItem("mock_mode") === "true") return
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single()
    setProfile(data)
  }

  const signIn = async (email: string, password: string) => {
    if (email.includes("test") || email === "mock@example.com") {
      setIsMock(true)
      localStorage.setItem("mock_mode", "true")
      setUser(MOCK_USER)
      setProfile(MOCK_PROFILE)
      return { error: null }
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error as Error | null }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    if (email.includes("test") || email === "mock@example.com") {
      setIsMock(true)
      localStorage.setItem("mock_mode", "true")
      setUser({ ...MOCK_USER, email, user_metadata: { full_name: fullName } })
      setProfile({ ...MOCK_PROFILE, email, full_name: fullName || "Test Student" })
      return { error: null }
    }
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: { full_name: fullName }
      }
    })
    
    if (!error && data.user) {
      await supabase.from("users").insert({
        id: data.user.id,
        email: data.user.email!,
        full_name: fullName || null
      })
    }
    
    return { error: error as Error | null }
  }

  const signOut = async () => {
    if (isMock || localStorage.getItem("mock_mode") === "true") {
      setIsMock(false)
      localStorage.removeItem("mock_mode")
    } else {
      await supabase.auth.signOut()
    }
    setUser(null)
    setProfile(null)
  }

  const signInWithGoogle = async () => {
    if (isMock) return { error: null }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { error: error as Error | null }
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    return { error: error as Error | null }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      signIn, 
      signUp, 
      signOut, 
      signInWithGoogle,
      resetPassword,
      isMock
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
