"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthGuard } from "@/components/auth-guard"
import { getUserDocuments, deleteDocument } from "@/lib/documents"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { FileText, Trash2, Calendar, Globe } from "lucide-react"
import Link from "next/link"
import type { Database } from "@/lib/supabase"
import { SetupRequired } from "./setup-required"

type Document = Database["public"]["Tables"]["documents"]["Row"]

function DashboardContent() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()
  const [setupRequired, setSetupRequired] = useState(false)

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      setLoading(true)
      const docs = await getUserDocuments()
      setDocuments(docs)

      // If we got an empty array, check if it's because the table doesn't exist
      if (docs.length === 0) {
        // We'll show a helpful message but not treat it as an error
        toast({
          title: "Database Setup",
          description: "Your documents will appear here once you create them and set up the database.",
          variant: "default",
        })
      }

      setSetupRequired(false)
    } catch (error: any) {
      console.error("Failed to load documents:", error)
      if (error.message?.includes("Database setup required")) {
        setSetupRequired(true)
      } else {
        toast({
          title: "Note",
          description: "Your documents will appear here once you create them.",
          variant: "default",
        })
      }
      setDocuments([])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDocument = async (id: string) => {
    try {
      await deleteDocument(id)
      setDocuments((docs) => docs.filter((doc) => doc.id !== id))
      toast({
        title: "Document deleted",
        description: "Document has been successfully deleted",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (setupRequired) {
    return <SetupRequired />
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Documents</h1>
        <p className="text-muted-foreground">Manage your saved documents and create new ones</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{documents.length}</div>
            <p className="text-xs text-muted-foreground">Total Documents</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{new Set(documents.map((d) => d.template_id)).size}</div>
            <p className="text-xs text-muted-foreground">Template Types Used</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{documents.filter((d) => d.language === "nepali").length}</div>
            <p className="text-xs text-muted-foreground">Nepali Documents</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{documents.filter((d) => d.language === "english").length}</div>
            <p className="text-xs text-muted-foreground">English Documents</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Recent Documents</h2>
        <Button asChild>
          <Link href="/templates">
            <FileText className="h-4 w-4 mr-2" />
            Create New Document
          </Link>
        </Button>
      </div>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
            <p className="text-muted-foreground mb-4">Start by creating your first document from our templates</p>
            <Button asChild>
              <Link href="/templates">Browse Templates</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((document) => (
            <Card key={document.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{document.template_id}</Badge>
                    <Badge variant="outline" className="flex items-center">
                      <Globe className="h-3 w-3 mr-1" />
                      {document.language === "nepali" ? "नेपाली" : "English"}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg">{document.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(document.created_at).toLocaleDateString()}
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" asChild className="flex-1">
                    <Link href={`/generate/${document.template_id}?edit=${document.id}`}>Edit</Link>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteDocument(document.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
