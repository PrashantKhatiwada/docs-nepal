"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, Camera, Loader2 } from "lucide-react"

function ProfileContent() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      // This is a placeholder - actual update functionality would be implemented here
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
                <AvatarFallback className="text-2xl">{user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" className="relative">
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                <Camera className="h-4 w-4 mr-2" />
                Change Photo
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="name"
                    className="pl-10"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled
                  />
                </div>
                <p className="text-xs text-muted-foreground">Email address cannot be changed</p>
              </div>

              <Button type="submit" className="w-full" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Account Type</h3>
              <p className="text-sm text-muted-foreground">Free Account</p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Login Provider</h3>
              <p className="text-sm text-muted-foreground capitalize">{user?.provider || "Email"}</p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Account Created</h3>
              <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  )
}
