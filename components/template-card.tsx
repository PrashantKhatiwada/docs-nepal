import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CardHeader } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
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

        {template.variants > 1 && (
          <div className="mb-4">
            <Badge variant="secondary" className="text-xs">
              {template.variants} Templates Available
            </Badge>
          </div>
        )}

        <Button className="w-full" asChild>
          <Link href={`/generate/${template.id}`}>{template.variants > 1 ? "Choose Template" : "Use Template"}</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
