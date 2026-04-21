import type { ReactNode } from "react"
import type { TemplateId } from "@/lib/templates"

export interface PreviewRenderContext {
  templateId: TemplateId
  templateTitle: string
  formData: Record<string, string>
  renderCv: () => ReactNode
  renderLeave: () => ReactNode
  renderRent: () => ReactNode
  renderMarriage: () => ReactNode
}
