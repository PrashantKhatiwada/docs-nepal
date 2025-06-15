"use client"

import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function DebugAuth() {
  const { user, loading, signOut } = useAuth()
  const [supabaseStatus, setSupabaseStatus] = useState<string>("checking...")
  const [authSession, setAuthSession] = useState<any>(null)

  useEffect(() => {
    const checkSupabase = async () => {
      try {
        // Check if we can connect to Supabase
        const { data, error } = await supabase.from("users").select("count").limit(1)
        if (error) {
          if (error.code === "PGRST116") {
            setSupabaseStatus("Connected (table 'users' doesn't exist)")
          } else {
            setSupabaseStatus(`Error: ${error.message}`)
          }
        } else {
          setSupabaseStatus("Connected")
        }

        // Check current session
        const { data: sessionData } = await supabase.auth.getSession()
        setAuthSession(sessionData.session)
      } catch (error: any) {
        setSupabaseStatus(`Connection failed: ${error.message}`)
      }
    }

    checkSupabase()
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
            <strong>Supabase:</strong> {supabaseStatus}
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
          <p className="text-xs">URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓" : "✗"}</p>
          <p className="text-xs">Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✓" : "✗"}</p>

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
