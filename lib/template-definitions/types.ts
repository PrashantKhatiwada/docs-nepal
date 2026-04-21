export type Language = "english" | "nepali"

export interface TemplateVariant {
  id: string
  name: string
  description: string
  preview: string
  difficulty: "Easy" | "Medium" | "Advanced"
  features: string[]
}

export interface TemplateField {
  id: string
  label: string
  type: "text" | "email" | "tel" | "date" | "textarea" | "richtext" | "number" | "photo"
  required: boolean
  placeholder?: string
  helpText?: string
}

export interface Template {
  title: string
  description: string
  category: string
  supportedLanguages: Language[]
  variants: TemplateVariant[]
  fields: TemplateField[]
}
