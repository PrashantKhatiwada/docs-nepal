import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Database } from "lucide-react"
import Link from "next/link"

export function SetupRequired() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <CardTitle>Database Setup Required</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            It looks like the database tables haven't been set up yet. To use document storage features, you'll need to
            run the database setup scripts.
          </p>

          <div className="bg-muted p-4 rounded-md">
            <h3 className="font-medium mb-2 flex items-center">
              <Database className="h-4 w-4 mr-2" />
              How to set up the database:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Go to your Supabase project dashboard</li>
              <li>Open the SQL Editor</li>
              <li>Run the database setup scripts from the project files</li>
              <li>
                Start with <code className="bg-background px-1 py-0.5 rounded">001_create_tables.sql</code>
              </li>
            </ol>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" asChild>
              <Link href="/">Return to Home</Link>
            </Button>
            <Button asChild>
              <Link href="/templates">Browse Templates</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
