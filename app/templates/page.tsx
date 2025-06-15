"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, FileText, Star, Clock, Users, TrendingUp } from "lucide-react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { getTemplateStats } from "@/lib/documents"
import { useAuth } from "@/lib/auth"

const templates = [
  {
    id: "cv-resume",
    title: "CV/Resume Generator",
    description: "Professional CV in both Nepali and English format with modern design",
    category: "Personal",
    popular: true,
    difficulty: "Easy",
    time: "5 min",
    users: "5",
  },
  {
    id: "leave-application",
    title: "Leave Application (निवेदन)",
    description: "General leave application for office, school, or personal use",
    category: "Employment",
    popular: true,
    difficulty: "Easy",
    time: "2 min",
    users: "5",
  },
  {
    id: "marriage-affidavit",
    title: "Marriage Affidavit",
    description: "Legal marriage affidavit document for official purposes",
    category: "Legal",
    popular: false,
    difficulty: "Medium",
    time: "8 min",
    users: "2",
  },
  {
    id: "rent-agreement",
    title: "Rent Agreement",
    description: "House/room rental agreement contract with legal terms",
    category: "Legal",
    popular: false,
    difficulty: "Medium",
    time: "10 min",
    users: "3",
  },
  {
    id: "rti-application",
    title: "RTI Application",
    description: "Right to Information request form for government offices",
    category: "Legal",
    popular: false,
    difficulty: "Easy",
    time: "3 min",
    users: "1",
  },
  {
    id: "character-certificate",
    title: "Character Certificate",
    description: "Character certificate application for various purposes",
    category: "Personal",
    popular: true,
    difficulty: "Easy",
    time: "4 min",
    users: "1",
  },
  {
    id: "job-application-letter",
    title: "Job Application Letter",
    description: "Professional job application letter in Nepali format",
    category: "Employment",
    popular: false,
    difficulty: "Medium",
    time: "6 min",
    users: "3",
  },
  {
    id: "bank-application",
    title: "Bank Account Application",
    description: "Bank account opening application form",
    category: "Personal",
    popular: false,
    difficulty: "Easy",
    time: "5 min",
    users: "0",
  },
  {
    id: "scholarship-application",
    title: "Scholarship Application",
    description: "Educational scholarship application letter",
    category: "Education",
    popular: false,
    difficulty: "Medium",
    time: "8 min",
    users: "0",
  },
  {
    id: "complaint-letter",
    title: "Complaint Letter",
    description: "Formal complaint letter for various issues",
    category: "Personal",
    popular: false,
    difficulty: "Easy",
    time: "4 min",
    users: "0",
  },
  {
    id: "recommendation-letter",
    title: "Recommendation Letter",
    description: "Professional recommendation letter template",
    category: "Employment",
    popular: false,
    difficulty: "Medium",
    time: "7 min",
    users: "3",
  },
  {
    id: "medical-certificate",
    title: "Medical Certificate Request",
    description: "Medical certificate request application",
    category: "Personal",
    popular: false,
    difficulty: "Easy",
    time: "3 min",
    users: "0",
  },
]

const categories = ["All", "Personal", "Legal", "Employment", "Education"]

function TemplatesContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [templateStats, setTemplateStats] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadTemplateStats()
    }
  }, [user])

  const loadTemplateStats = async () => {
    try {
      setIsLoading(true)
      const stats = await getTemplateStats()
      setTemplateStats(stats)
    } catch (error) {
      console.warn("Failed to load template stats:", error)
      // Don't show error to user, just continue without stats
    } finally {
      setIsLoading(false)
    }
  }

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const popularTemplates = templates.filter((template) => template.popular)

  // Sort templates by usage stats (if available) or by popularity
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    const aUsage = templateStats[a.id] || 0
    const bUsage = templateStats[b.id] || 0

    // If we have usage stats, sort by them
    if (aUsage > 0 || bUsage > 0) {
      return bUsage - aUsage
    }

    // Otherwise, sort by popularity
    if (a.popular && !b.popular) return -1
    if (!a.popular && b.popular) return 1
    return 0
  })

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Document Templates</h1>
        <p className="text-xl text-muted-foreground">
          Choose from our collection of professionally designed Nepali document templates
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
        <TabsList className="grid w-full grid-cols-5">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-8">
          {selectedCategory === "All" && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-2" />
                Popular Templates
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {popularTemplates.map((template) => (
                  <TemplateCard key={template.id} template={template} usageCount={templateStats[template.id]} />
                ))}
              </div>
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <TrendingUp className="h-5 w-5 text-primary mr-2" />
                All Templates
              </h2>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} usageCount={templateStats[template.id]} />
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No templates found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TemplateCard({ template, usageCount }: { template: any; usageCount?: number }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <Badge variant={template.popular ? "default" : "secondary"}>{template.category}</Badge>
          <div className="flex items-center space-x-1">
            {template.popular && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
            {usageCount && usageCount > 0 && (
              <Badge variant="outline" className="text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                {usageCount}
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className="text-lg">{template.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{template.description}</p>

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {template.time}
          </div>
          <div className="flex items-center">
            <Users className="h-3 w-3 mr-1" />
            {template.users}
          </div>
          <Badge variant="outline" className="text-xs">
            {template.difficulty}
          </Badge>
        </div>

        <Button className="w-full" asChild>
          <Link href={`/generate/${template.id}`}>Use Template</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export default function TemplatesPage() {
  return (
    <AuthGuard>
      <TemplatesContent />
    </AuthGuard>
  )
}
