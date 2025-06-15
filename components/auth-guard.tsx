"use client"

import type React from "react"
import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock } from 'lucide-react'
import Link from "next/link"
import { useEffect, useState } from "react"

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Add debug logging
  useEffect(() => {
    console.log("AuthGuard state:", { user: !!user, loading, mounted })
  }, [user, loading, mounted])

  // Show loading while mounting or auth is loading
  if (!mounted || loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              {!mounted ? "Initializing..." : "Checking authentication..."}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Show auth required if no user
  if (!user) {
    console.log("AuthGuard: No user found, showing login prompt")
    return (
      fallback || (
        <div className="container mx-auto py-12 px-4">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Authentication Required</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">
                  You need to sign in to access DocsNepal templates and generate documents.
                </p>
                <div className="space-y-2">
                  <Button className="w-full" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link href="/login" className="text-primary hover:underline">
                      Create one for free
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    )
  }

  console.log("AuthGuard: User authenticated, rendering children")
  return <>{children}</>
}
