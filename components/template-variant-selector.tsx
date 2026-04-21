"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Check, Eye, Star } from "lucide-react"
import Image from "next/image"
import type { TemplateVariant } from "@/lib/templates"

interface TemplateVariantSelectorProps {
  variants: TemplateVariant[]
  selectedVariant: string
  onVariantChange: (variantId: string) => void
  templateTitle: string
}

export function TemplateVariantSelector({
  variants,
  selectedVariant,
  onVariantChange,
  templateTitle,
}: TemplateVariantSelectorProps) {
  const [previewVariant, setPreviewVariant] = useState<TemplateVariant | null>(null)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 border-green-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Advanced":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Star className="h-5 w-5 mr-2" />
          Choose Your {templateTitle} Template
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {variants.map((variant) => (
            <Card
              key={variant.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedVariant === variant.id ? "ring-2 ring-primary border-primary" : ""
              }`}
              onClick={() => onVariantChange(variant.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-sm">{variant.name}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedVariant === variant.id && <Check className="h-4 w-4 text-primary" />}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            setPreviewVariant(variant)
                          }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{variant.name} Preview</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center">
                            <Image
                              src={variant.preview || "/placeholder.svg"}
                              alt={`${variant.name} preview`}
                              width={300}
                              height={400}
                              className="rounded-lg"
                            />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">{variant.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {variant.features.map((feature, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-3">{variant.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className={`text-xs ${getDifficultyColor(variant.difficulty)}`} variant="outline">
                      {variant.difficulty}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">{variant.features.length} features</div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {variant.features.slice(0, 2).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {variant.features.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{variant.features.length - 2} more
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-start space-x-2">
            <Star className="h-4 w-4 text-primary mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">Template Selection Tips:</p>
              <ul className="text-muted-foreground space-y-1 text-xs">
                <li>
                  • <strong>Modern:</strong> Best for private sector and tech jobs
                </li>
                <li>
                  • <strong>Classic:</strong> Ideal for government and traditional positions
                </li>
                <li>
                  • <strong>Detailed:</strong> Perfect when you have extensive experience
                </li>
                <li>
                  • <strong>Minimal:</strong> Great for fresh graduates or simple applications
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
