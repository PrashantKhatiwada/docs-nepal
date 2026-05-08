import type { ReactNode } from "react"
import type { PreviewRenderContext } from "./types"

function renderFallbackPreview(templateTitle: string, formData: Record<string, string>): ReactNode {
  return (
    <div className="bg-white p-8 text-black min-h-[600px] font-serif">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold">{templateTitle.toUpperCase()}</h2>
      </div>
      <div className="space-y-4">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className="flex">
            <span className="font-semibold min-w-[150px]">
              {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:
            </span>
            <span>{value || "[Not provided]"}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function renderTemplatePreview(ctx: PreviewRenderContext): ReactNode {
  if (ctx.templateId === "leave-application") return ctx.renderLeave()
  if (ctx.templateId === "cv-resume") return ctx.renderCv()
  if (ctx.templateId === "marriage-affidavit") return ctx.renderMarriage()
  if (ctx.templateId === "rent-agreement") return ctx.renderRent()
  if (ctx.templateId === "bahal-samjhauta-budhanilkantha") return ctx.renderRent()
  if (ctx.templateId === "bahal-samjhauta-sunwal") return ctx.renderRent()
  if (ctx.templateId === "lease-agreement-koshi") return ctx.renderRent()
  if (ctx.templateId === "bharpai-receipt") return ctx.renderBharpai()
  return renderFallbackPreview(ctx.templateTitle, ctx.formData)
}
