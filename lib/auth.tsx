"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "./supabase"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  provider: "google" | "email"
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
          if (mounted) setLoading(false)
          return
        }

        if (session?.user && mounted) {
          await setUserFromSupabase(session.user)
        }

        if (mounted) setLoading(false)
      } catch (error) {
        console.error("Error in getInitialSession:", error)
        if (mounted) setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)

      if (event === "SIGNED_IN" && session?.user && mounted) {
        console.log("User signed in, setting user state")
        await setUserFromSupabase(session.user)
      } else if (event === "SIGNED_OUT" && mounted) {
        console.log("User signed out, clearing user state")
        setUser(null)
      } else if (event === "TOKEN_REFRESHED" && session?.user && mounted) {
        console.log("Token refreshed, updating user state")
        await setUserFromSupabase(session.user)
      }

      if (mounted) setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const setUserFromSupabase = async (supabaseUser: SupabaseUser) => {
    try {
      console.log("Setting user from Supabase:", supabaseUser.email)

      // Create a simple user object from Supabase user data
      const simpleUser: User = {
        id: supabaseUser.id,
        email: supabaseUser.email!,
        name:
          supabaseUser.user_metadata?.full_name ||
          supabaseUser.user_metadata?.name ||
          supabaseUser.email!.split("@")[0],
        avatar: supabaseUser.user_metadata?.avatar_url,
        provider: (supabaseUser.app_metadata?.provider as "google" | "email") || "email",
      }

      // Try to get or create user profile, but don't fail if table doesn't exist
      try {
        const { data: profile, error } = await supabase.from("users").select("*").eq("id", supabaseUser.id).single()

        if (error && error.code === "PGRST116") {
          // User doesn't exist, try to create profile
          console.log("Creating new user profile for:", supabaseUser.email)
          const { data: newProfile, error: insertError } = await supabase
            .from("users")
            .insert({
              id: supabaseUser.id,
              email: supabaseUser.email!,
              name: simpleUser.name,
              avatar_url: simpleUser.avatar,
              provider: simpleUser.provider,
            })
            .select()
            .single()

          if (!insertError && newProfile) {
            console.log("User profile created successfully")
            setUser({
              id: newProfile.id,
              email: newProfile.email,
              name: newProfile.name,
              avatar: newProfile.avatar_url || undefined,
              provider: newProfile.provider as "google" | "email",
            })
            return
          }
        } else if (!error && profile) {
          console.log("User profile found, setting user state")
          setUser({
            id: profile.id,
            email: profile.email,
            name: profile.name,
            avatar: profile.avatar_url || undefined,
            provider: profile.provider as "google" | "email",
          })
          return
        }
      } catch (dbError: any) {
        console.warn("Database table not ready, using simple auth:", dbError.message)
      }

      // Fallback: set user from Supabase data directly
      console.log("Using fallback user data")
      setUser(simpleUser)
    } catch (error) {
      console.error("Error setting user from Supabase:", error)
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (result.error) {
        throw new Error(result.error.message)
      }

      // Don't need to manually set user here, the auth state change listener will handle it
    } catch (error: any) {
      console.error("Sign in error:", error)
      throw new Error(error.message || "Invalid credentials")
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true)
    try {
      const result = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      })

      if (result.error) {
        throw new Error(result.error.message)
      }

      // Don't need to manually set user here, the auth state change listener will handle it
    } catch (error: any) {
      console.error("Sign up error:", error)
      throw new Error(error.message || "Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    setLoading(true)
    try {
      const result = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (result.error) {
        throw new Error(result.error.message)
      }

      // Don't set loading to false here as the redirect will happen
    } catch (error: any) {
      console.error("Google sign in error:", error)
      setLoading(false)
      throw new Error(error.message || "Google sign-in failed")
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
