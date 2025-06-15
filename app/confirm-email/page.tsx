"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { EmailConfirmation } from "@/components/email-confirmation"
import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function ConfirmEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()
  const [email, setEmail] = useState<string>("")

  useEffect(() => {
    // Get email from URL params or user object
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(emailParam)
    } else if (user?.email) {
      setEmail(user.email)
    }
  }, [searchParams, user])

  const handleConfirmed = () => {
    router.push("/templates")
  }

  const handleSkip = () => {
    router.push("/templates")
  }

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  // If user is already confirmed, redirect
  if (user?.email && !email) {
    router.push("/templates")
    return null
  }

  // If no email available, show error
  if (!email) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle>Email Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">We couldn't find your email address. Please try registering again.</p>
            <Button asChild>
              <Link href="/login">Back to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to DocsNepal!</h1>
        <p className="text-muted-foreground">Just one more step to get started with your document generation</p>
      </div>

      <EmailConfirmation email={email} onConfirmed={handleConfirmed} onSkip={handleSkip} />

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Need help?{" "}
          <Link href="/about" className="text-primary hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  )
}
