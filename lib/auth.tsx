"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { neonAuth } from "./neon-auth"

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  provider: "google" | "email"
  emailConfirmed?: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<{ needsConfirmation: boolean }>
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
    const loadSession = async () => {
      try {
        const { data, error } = await neonAuth.getSession()
        if (error) {
          console.error("Error loading Neon Auth session:", error)
          if (mounted) setLoading(false)
          return
        }

        if (data?.user && mounted) {
          setUserFromNeon(data.user)
        } else if (mounted) {
          setUser(null)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadSession()
    return () => {
      mounted = false
    }
  }, [])

  const setUserFromNeon = (neonUser: any) => {
    try {
      setUser({
        id: neonUser.id,
        email: neonUser.email,
        name: neonUser.name || neonUser.email?.split("@")[0] || "User",
        avatar: neonUser.image || undefined,
        provider: "email",
        emailConfirmed: !!neonUser.emailVerified,
      })
    } catch (error) {
      console.error("Error setting user from Neon:", error)
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const result = await neonAuth.signIn.email({
        email,
        password,
      })

      if (result.error) {
        throw new Error(result.error.message)
      }
      if (result.data?.user) {
        setUserFromNeon(result.data.user)
      }
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
      const result = await neonAuth.signUp.email({
        email,
        password,
        name,
      })

      if (result.error) {
        throw new Error(result.error.message)
      }

      const needsConfirmation = !!result.data?.user && !result.data.user.emailVerified

      return { needsConfirmation: !!needsConfirmation }
    } catch (error: any) {
      console.error("Sign up error:", error)
      throw new Error(error.message || "Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    throw new Error("Google sign-in is not configured for Neon Auth yet.")
  }

  const signOut = async () => {
    try {
      await neonAuth.signOut()
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
