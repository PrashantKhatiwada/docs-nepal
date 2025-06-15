"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, CheckCircle, Clock, RefreshCw, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

interface EmailConfirmationProps {
  email: string
  onConfirmed?: () => void
  onSkip?: () => void
}

export function EmailConfirmation({ email, onConfirmed, onSkip }: EmailConfirmationProps) {
  const [isResending, setIsResending] = useState(false)
  const [resendCount, setResendCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const { toast } = useToast()

  // Countdown timer for resend button
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  // Check for email confirmation status
  useEffect(() => {
    const checkConfirmation = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user?.email_confirmed_at) {
          setIsConfirmed(true)
          if (onConfirmed) {
            setTimeout(onConfirmed, 2000) // Give user time to see success message
          }
        }
      } catch (error) {
        console.error("Error checking confirmation:", error)
      }
    }

    // Check immediately
    checkConfirmation()

    // Set up interval to check periodically
    const interval = setInterval(checkConfirmation, 3000)
    return () => clearInterval(interval)
  }, [onConfirmed])

  const handleResendEmail = async () => {
    if (timeLeft > 0 || resendCount >= 3) return

    setIsResending(true)
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      })

      if (error) {
        throw error
      }

      setResendCount((prev) => prev + 1)
      setTimeLeft(60) // 60 second cooldown

      toast({
        title: "Email sent!",
        description: "We've sent another confirmation email to your inbox.",
      })
    } catch (error: any) {
      toast({
        title: "Failed to resend email",
        description: error.message || "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsResending(false)
    }
  }

  if (isConfirmed) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-green-700">Email Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Your email has been successfully verified. You now have full access to DocsNepal.
          </p>
          <div className="flex items-center justify-center space-x-2">
            <Badge variant="outline" className="text-green-600 border-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <CardTitle>Confirm Your Email</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">We've sent a confirmation email to:</p>
          <p className="font-medium text-primary">{email}</p>
        </div>

        <div className="bg-muted/30 p-4 rounded-lg space-y-3">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">What to do next:</span>
          </div>
          <ol className="text-sm text-muted-foreground space-y-2 ml-6">
            <li>1. Check your email inbox</li>
            <li>2. Look for an email from DocsNepal</li>
            <li>3. Click the confirmation link</li>
            <li>4. Return here to continue</li>
          </ol>
        </div>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleResendEmail}
            disabled={isResending || timeLeft > 0 || resendCount >= 3}
          >
            {isResending ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : timeLeft > 0 ? (
              <>
                <Clock className="h-4 w-4 mr-2" />
                Resend in {timeLeft}s
              </>
            ) : resendCount >= 3 ? (
              "Maximum resends reached"
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                {resendCount > 0 ? "Resend Email" : "Send Again"}
              </>
            )}
          </Button>

          {resendCount > 0 && <p className="text-xs text-center text-muted-foreground">Emails sent: {resendCount}/3</p>}
        </div>

        <div className="text-center space-y-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>

          {onSkip && (
            <Button variant="ghost" onClick={onSkip} className="w-full">
              Continue without verification
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>

        <div className="text-xs text-center text-muted-foreground space-y-1">
          <p>Didn't receive the email?</p>
          <p>Check your spam folder or try resending.</p>
        </div>
      </CardContent>
    </Card>
  )
}
