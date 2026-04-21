"use client"

import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { neonAuth } from "@/lib/neon-auth"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function DebugAuth() {
  const { user, loading, signOut } = useAuth()
  const [authStatus, setAuthStatus] = useState<string>("checking...")
  const [authSession, setAuthSession] = useState<any>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await neonAuth.getSession()
        setAuthStatus(error ? `Error: ${error.message}` : "Connected")
        setAuthSession(data?.session ?? null)
      } catch (error: any) {
        setAuthStatus(`Connection failed: ${error.message}`)
      }
    }

    checkAuth()
  }, [])

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 bg-background/95 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Auth Debug</CardTitle>
      </CardHeader>
      <CardContent className="text-xs">
        <div className="space-y-1">
          <p>
            <strong>Neon Auth:</strong> {authStatus}
          </p>
          <p>
            <strong>Loading:</strong> {loading ? "Yes" : "No"}
          </p>
          <p>
            <strong>User:</strong> {user ? "Authenticated" : "Not authenticated"}
          </p>
          <p>
            <strong>Session:</strong> {authSession ? "Active" : "None"}
          </p>
          {user && (
            <>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Provider:</strong> {user.provider}
              </p>
            </>
          )}
          <p>
            <strong>Env Check:</strong>
          </p>
          <p className="text-xs">Auth URL: {process.env.NEXT_PUBLIC_NEON_AUTH_URL ? "✓" : "✗"}</p>

          <div className="pt-2">
            <Button variant="destructive" size="sm" className="w-full text-xs" onClick={signOut}>
              Force Logout
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
