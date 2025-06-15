"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, Check } from "lucide-react"
import type { Language } from "@/lib/templates"

interface LanguageSelectorProps {
  supportedLanguages: Language[]
  selectedLanguage: Language
  onLanguageChange: (language: Language) => void
}

export function LanguageSelector({ supportedLanguages, selectedLanguage, onLanguageChange }: LanguageSelectorProps) {
  if (supportedLanguages.length <= 1) {
    return null
  }

  const languageLabels = {
    english: "English",
    nepali: "नेपाली (Nepali)",
  }

  const languageDescriptions = {
    english: "Generate document in English format",
    nepali: "Generate document in Nepali format",
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Globe className="h-5 w-5 mr-2" />
          Document Language
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {supportedLanguages.map((language) => (
            <Button
              key={language}
              variant={selectedLanguage === language ? "default" : "outline"}
              className="h-auto p-4 justify-start"
              onClick={() => onLanguageChange(language)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="text-left">
                  <div className="font-semibold">{languageLabels[language]}</div>
                  <div className="text-xs opacity-70">{languageDescriptions[language]}</div>
                </div>
                {selectedLanguage === language && <Check className="h-4 w-4" />}
              </div>
            </Button>
          ))}
        </div>
        {supportedLanguages.length > 1 && (
          <div className="mt-3 text-xs text-muted-foreground">
            <Badge variant="secondary" className="mr-2">
              Tip
            </Badge>
            You can switch languages anytime and preview the document before downloading.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
