"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, Eye, FileText, FileType, Loader2, Heart, Save, Edit } from "lucide-react"
import { useParams, useSearchParams } from "next/navigation"
import { templates, type TemplateId, type Language } from "@/lib/templates"
import { validateTemplateForm } from "@/lib/template-validation"
import { renderTemplatePreview } from "@/lib/template-renderers"
import { renderMarriageAffidavitPreview } from "@/lib/template-renderers/marriage-affidavit"
import { renderBharpaiReceiptPreview } from "@/lib/template-renderers/bharpai-receipt"
import { trackEvent } from "@/lib/analytics"
import { useToast } from "@/hooks/use-toast"
import { LanguageSelector } from "@/components/language-selector"
import { AuthGuard } from "@/components/auth-guard"
import { getDocumentById, saveDocument, updateDocument, trackTemplateUsage } from "@/lib/documents"
import Link from "next/link"
import { TemplateVariantSelector } from "@/components/template-variant-selector"
import { PhotoUpload } from "@/components/photo-upload"
import { RichTextEditor } from "@/components/rich-text-editor"
import { generatePdfFromElement } from "@/lib/pdf-client"
import { generateDocxFromElement } from "@/lib/docx-client"

function GenerateDocumentContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const templateId = params.templateId as TemplateId
  const editId = searchParams.get("edit")
  const template = templates[templateId as TemplateId]
  const { toast } = useToast()
  const previewRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState<Record<string, string>>({})
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(template?.supportedLanguages?.[0] || "english")
  const [activeTab, setActiveTab] = useState("form")
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [isGeneratingDoc, setIsGeneratingDoc] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
  const [documentId, setDocumentId] = useState<string | null>(editId)
  const [documentTitle, setDocumentTitle] = useState("")
  const [selectedVariant, setSelectedVariant] = useState<string>(template?.variants?.[0]?.id || "")

  useEffect(() => {
    if (editId) {
      loadDocument(editId)
      trackEvent("document_edit_opened", templateId, { editId })
    } else {
      // Track template usage for new documents
      trackTemplateUsage(templateId)
      trackEvent("template_started", templateId)
      // Set default variant
      if (template?.variants?.[0]?.id) {
        setSelectedVariant(template.variants[0].id)
      }
    }
  }, [editId, templateId, template])

  const loadDocument = async (id: string) => {
    try {
      const data = await getDocumentById(id)

      setFormData(data.form_data)
      setSelectedLanguage(data.language as Language)
      setDocumentTitle(data.title)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load document",
        variant: "destructive",
      })
    }
  }

  if (!template) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Template Not Found</h1>
        <p className="text-muted-foreground">The requested template could not be found.</p>
      </div>
    )
  }

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
  }

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language)
  }

  const generateDocumentTitle = () => {
    if (documentTitle) return documentTitle

    const name = formData.applicantName || formData.fullName || formData.husbandName || "Document"
    const templateName = template.title.split(" ")[0]
    return `${templateName} - ${name}`
  }

  const validateCurrentForm = () => {
    const validation = validateTemplateForm(templateId, formData)
    if (!validation.success) {
      toast({
        title: "Please fix these fields",
        description: validation.errors.slice(0, 4).join(", "),
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const handleSaveDocument = async (options?: { skipValidation?: boolean; silent?: boolean; auto?: boolean }) => {
    if (!options?.skipValidation && !validateCurrentForm()) return
    if (options?.auto) {
      setIsAutoSaving(true)
    } else {
      setIsSaving(true)
    }
    try {
      const title = generateDocumentTitle()

      if (documentId) {
        // Update existing document
        await updateDocument(documentId, {
          title,
          form_data: formData,
          language: selectedLanguage,
        })
        if (!options?.silent) {
          toast({
            title: "Document updated",
            description: "Your document has been saved successfully",
          })
        }
      } else {
        // Save new document
        const savedDoc = await saveDocument({
          template_id: templateId,
          title,
          form_data: formData,
          language: selectedLanguage,
        })
        setDocumentId(savedDoc.id)
        if (!options?.silent) {
          toast({
            title: "Document saved",
            description: "Your document has been saved to your dashboard",
          })
        }
      }
      if (options?.auto) {
        trackEvent("document_autosaved", templateId, { documentId: documentId ?? null })
      } else {
        trackEvent("document_saved", templateId, { documentId: documentId ?? null })
      }
      setLastSavedAt(new Date())
    } catch (error) {
      if (!options?.silent) {
        toast({
          title: "Error",
          description: "Failed to save document",
          variant: "destructive",
        })
      }
    } finally {
      setIsSaving(false)
      setIsAutoSaving(false)
    }
  }

  useEffect(() => {
    if (!template || !Object.keys(formData).length) return

    const timer = setTimeout(() => {
      handleSaveDocument({ skipValidation: true, silent: true, auto: true })
    }, 1500)

    return () => clearTimeout(timer)
  }, [formData, selectedLanguage])

  const generateCVPreview = () => {
    const variant = template.variants.find((v) => v.id === selectedVariant)

    if (selectedLanguage === "nepali") {
      if (selectedVariant === "minimal") {
        // Minimal CV - very simple layout
        return (
          <div className="bg-white p-8 text-black min-h-[600px] font-serif">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">{formData.fullName || "[तपाईंको नाम]"}</h1>
              <p className="text-sm text-gray-600 mt-1">
                {formData.email || "[इमेल]"} | {formData.phone || "[फोन]"}
              </p>
              <p className="text-sm text-gray-600">{formData.address || "[ठेगाना]"}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-base font-semibold mb-1">शिक्षा</h2>
                <div
                  className="text-sm"
                  dangerouslySetInnerHTML={{ __html: formData.education || "[शिक्षाको विवरण]" }}
                />
              </div>

              <div>
                <h2 className="text-base font-semibold mb-1">सीपहरू</h2>
                <div className="text-sm" dangerouslySetInnerHTML={{ __html: formData.skills || "[सीपहरू]" }} />
              </div>

              {formData.experience && (
                <div>
                  <h2 className="text-base font-semibold mb-1">अनुभव</h2>
                  <div className="text-sm" dangerouslySetInnerHTML={{ __html: formData.experience }} />
                </div>
              )}
            </div>
          </div>
        )
      } else if (selectedVariant === "classic") {
        // Classic CV - traditional government style
        return (
          <div className="bg-white p-8 text-black min-h-[600px] font-serif">
            <div className="text-center mb-8 border-b-2 border-black pb-4">
              <h1 className="text-2xl font-bold underline">{formData.fullName || "[तपाईंको नाम]"}</h1>
              <div className="text-sm mt-3 space-y-1">
                <p>इमेल: {formData.email || "[इमेल]"}</p>
                <p>फोन: {formData.phone || "[फोन]"}</p>
                <p>ठेगाना: {formData.address || "[ठेगाना]"}</p>
              </div>
            </div>

            <div className="space-y-6">
              {formData.objective && (
                <div>
                  <h2 className="text-lg font-bold border-b border-black mb-2">उद्देश्य</h2>
                  <div className="text-sm" dangerouslySetInnerHTML={{ __html: formData.objective }} />
                </div>
              )}

              <div>
                <h2 className="text-lg font-bold border-b border-black mb-2">शैक्षिक योग्यता</h2>
                <div
                  className="text-sm"
                  dangerouslySetInnerHTML={{ __html: formData.education || "[शिक्षाको विवरण]" }}
                />
              </div>

              {formData.experience && (
                <div>
                  <h2 className="text-lg font-bold border-b border-black mb-2">कार्य अनुभव</h2>
                  <div className="text-sm" dangerouslySetInnerHTML={{ __html: formData.experience }} />
                </div>
              )}

              <div>
                <h2 className="text-lg font-bold border-b border-black mb-2">सीप र क्षमता</h2>
                <div className="text-sm" dangerouslySetInnerHTML={{ __html: formData.skills || "[सीपहरू]" }} />
              </div>
            </div>
          </div>
        )
      } else if (selectedVariant === "detailed") {
        // Detailed CV - comprehensive with all sections
        return (
          <div className="bg-white p-8 text-black min-h-[600px] font-serif">
            <div className="border-l-4 border-blue-600 pl-4 mb-8">
              <h1 className="text-3xl font-bold text-blue-800">{formData.fullName || "[तपाईंको नाम]"}</h1>
              <div className="text-sm text-gray-600 mt-2 grid grid-cols-2 gap-2">
                <p>📧 {formData.email || "[इमेल]"}</p>
                <p>📞 {formData.phone || "[फोन]"}</p>
                <p className="col-span-2">🏠 {formData.address || "[ठेगाना]"}</p>
              </div>
            </div>

            <div className="space-y-6">
              {formData.objective && (
                <div>
                  <h2 className="text-lg font-semibold bg-blue-100 px-3 py-1 mb-3">व्यावसायिक उद्देश्य</h2>
                  <div className="text-sm pl-3" dangerouslySetInnerHTML={{ __html: formData.objective }} />
                </div>
              )}

              <div>
                <h2 className="text-lg font-semibold bg-blue-100 px-3 py-1 mb-3">शैक्षिक योग्यता</h2>
                <div
                  className="text-sm pl-3"
                  dangerouslySetInnerHTML={{ __html: formData.education || "[शिक्षाको विवरण]" }}
                />
              </div>

              {formData.experience && (
                <div>
                  <h2 className="text-lg font-semibold bg-blue-100 px-3 py-1 mb-3">व्यावसायिक अनुभव</h2>
                  <div className="text-sm pl-3" dangerouslySetInnerHTML={{ __html: formData.experience }} />
                </div>
              )}

              <div>
                <h2 className="text-lg font-semibold bg-blue-100 px-3 py-1 mb-3">सीप र दक्षता</h2>
                <div className="text-sm pl-3" dangerouslySetInnerHTML={{ __html: formData.skills || "[सीपहरू]" }} />
              </div>

              {formData.achievements && (
                <div>
                  <h2 className="text-lg font-semibold bg-blue-100 px-3 py-1 mb-3">उपलब्धिहरू</h2>
                  <div className="text-sm pl-3" dangerouslySetInnerHTML={{ __html: formData.achievements }} />
                </div>
              )}

              {formData.references && (
                <div>
                  <h2 className="text-lg font-semibold bg-blue-100 px-3 py-1 mb-3">सन्दर्भहरू</h2>
                  <div className="text-sm pl-3" dangerouslySetInnerHTML={{ __html: formData.references }} />
                </div>
              )}
            </div>
          </div>
        )
      } else {
        // Modern CV - default modern style with photo
        return (
          <div className="bg-white p-8 text-black min-h-[600px] font-sans">
            <div className="flex items-start space-x-6 mb-8">
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                {formData.photo ? (
                  <img
                    src={formData.photo || "/placeholder.svg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold">{(formData.fullName || "N")[0]}</span>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-800">{formData.fullName || "[तपाईंको नाम]"}</h1>
                <div className="text-sm text-gray-600 mt-2 space-y-1">
                  <p>
                    {formData.email || "[इमेल]"} • {formData.phone || "[फोन]"}
                  </p>
                  <p>{formData.address || "[ठेगाना]"}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-6">
                {formData.objective && (
                  <div>
                    <h2 className="text-lg font-semibold text-blue-600 border-b border-blue-200 pb-1 mb-3">उद्देश्य</h2>
                    <div className="text-sm" dangerouslySetInnerHTML={{ __html: formData.objective }} />
                  </div>
                )}

                {formData.experience && (
                  <div>
                    <h2 className="text-lg font-semibold text-blue-600 border-b border-blue-200 pb-1 mb-3">
                      कार्य अनुभव
                    </h2>
                    <div className="text-sm" dangerouslySetInnerHTML={{ __html: formData.experience }} />
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-blue-600 border-b border-blue-200 pb-1 mb-3">शिक्षा</h2>
                  <div
                    className="text-sm"
                    dangerouslySetInnerHTML={{ __html: formData.education || "[शिक्षाको विवरण]" }}
                  />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-blue-600 border-b border-blue-200 pb-1 mb-3">सीपहरू</h2>
                  <div className="text-sm" dangerouslySetInnerHTML={{ __html: formData.skills || "[सीपहरू]" }} />
                </div>
              </div>
            </div>
          </div>
        )
      }
    } else {
      // English versions with similar photo integration
      if (selectedVariant === "minimal") {
        return (
          <div className="bg-white p-8 text-black min-h-[600px] font-serif">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">{formData.fullName || "[Your Name]"}</h1>
              <p className="text-sm text-gray-600 mt-1">
                {formData.email || "[Email]"} | {formData.phone || "[Phone]"}
              </p>
              <p className="text-sm text-gray-600">{formData.address || "[Address]"}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-base font-semibold mb-1">EDUCATION</h2>
                <div
                  className="text-sm"
                  dangerouslySetInnerHTML={{ __html: formData.education || "[Education Details]" }}
                />
              </div>

              <div>
                <h2 className="text-base font-semibold mb-1">SKILLS</h2>
                <div className="text-sm" dangerouslySetInnerHTML={{ __html: formData.skills || "[Skills]" }} />
              </div>

              {formData.experience && (
                <div>
                  <h2 className="text-base font-semibold mb-1">EXPERIENCE</h2>
                  <div className="text-sm" dangerouslySetInnerHTML={{ __html: formData.experience }} />
                </div>
              )}
            </div>
          </div>
        )
      } else if (selectedVariant === "classic") {
        return (
          <div className="bg-white p-8 text-black min-h-[600px] font-serif">
            <div className="text-center mb-8 border-b-2 border-black pb-4">
              <h1 className="text-2xl font-bold underline">{formData.fullName || "[YOUR NAME]"}</h1>
              <div className="text-sm mt-3 space-y-1">
                <p>Email: {formData.email || "[Email]"}</p>
                <p>Phone: {formData.phone || "[Phone]"}</p>
                <p>Address: {formData.address || "[Address]"}</p>
              </div>
            </div>

            <div className="space-y-6">
              {formData.objective && (
                <div>
                  <h2 className="text-lg font-bold border-b border-black mb-2 pb-2">OBJECTIVE</h2>
                  <div className="text-sm" dangerouslySetInnerHTML={{ __html: formData.objective }} />
                </div>
              )}

              <div>
                <h2 className="text-lg font-bold border-b border-black mb-2 pb-2">EDUCATIONAL QUALIFICATIONS</h2>
                <div
                  className="text-sm"
                  dangerouslySetInnerHTML={{ __html: formData.education || "[Education Details]" }}
                />
              </div>

              {formData.experience && (
                <div>
                  <h2 className="text-lg font-bold border-b border-black mb-2 pb-2">WORK EXPERIENCE</h2>
                  <div className="text-sm" dangerouslySetInnerHTML={{ __html: formData.experience }} />
                </div>
              )}

              <div>
                <h2 className="text-lg font-bold border-b border-black mb-2 pb-2">SKILLS & ABILITIES</h2>
                <div className="text-sm" dangerouslySetInnerHTML={{ __html: formData.skills || "[Skills]" }} />
              </div>
            </div>
          </div>
        )
      } else if (selectedVariant === "detailed") {
        return (
          <div className="bg-white p-8 text-black min-h-[600px] font-serif">
            <div className="border-l-4 border-blue-600 pl-4 mb-8">
              <h1 className="text-3xl font-bold text-blue-800">{formData.fullName || "[YOUR NAME]"}</h1>
              <div className="text-sm text-gray-600 mt-2 grid grid-cols-2 gap-2">
                <p>📧 {formData.email || "[Email]"}</p>
                <p>📞 {formData.phone || "[Phone]"}</p>
                <p className="col-span-2">🏠 {formData.address || "[Address]"}</p>
              </div>
            </div>

            <div className="space-y-6">
              {formData.objective && (
                <div>
                  <h2 className="text-lg font-semibold bg-blue-100 px-3 py-1 mb-3">PROFESSIONAL OBJECTIVE</h2>
                  <div className="text-sm pl-3" dangerouslySetInnerHTML={{ __html: formData.objective }} />
                </div>
              )}

              <div>
                <h2 className="text-lg font-semibold bg-blue-100 px-3 py-1 mb-3">EDUCATIONAL BACKGROUND</h2>
                <div
                  className="text-sm pl-3"
                  dangerouslySetInnerHTML={{ __html: formData.education || "[Education Details]" }}
                />
              </div>

              {formData.experience && (
                <div>
                  <h2 className="text-lg font-semibold bg-blue-100 px-3 py-1 mb-3">PROFESSIONAL EXPERIENCE</h2>
                  <div className="text-sm pl-3" dangerouslySetInnerHTML={{ __html: formData.experience }} />
                </div>
              )}

              <div>
                <h2 className="text-lg font-semibold bg-blue-100 px-3 py-1 mb-3">SKILLS & COMPETENCIES</h2>
                <div className="text-sm pl-3" dangerouslySetInnerHTML={{ __html: formData.skills || "[Skills]" }} />
              </div>

              {formData.achievements && (
                <div>
                  <h2 className="text-lg font-semibold bg-blue-100 px-3 py-1 mb-3">ACHIEVEMENTS & AWARDS</h2>
                  <div className="text-sm pl-3" dangerouslySetInnerHTML={{ __html: formData.achievements }} />
                </div>
              )}

              {formData.references && (
                <div>
                  <h2 className="text-lg font-semibold bg-blue-100 px-3 py-1 mb-3">REFERENCES</h2>
                  <div className="text-sm pl-3" dangerouslySetInnerHTML={{ __html: formData.references }} />
                </div>
              )}
            </div>
          </div>
        )
      } else {
        // Modern CV - default modern style with photo
        return (
          <div className="bg-white p-8 text-black min-h-[600px] font-sans">
            <div className="flex items-start space-x-6 mb-8">
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                {formData.photo ? (
                  <img
                    src={formData.photo || "/placeholder.svg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold">{(formData.fullName || "N")[0]}</span>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-800">{formData.fullName || "[Your Name]"}</h1>
                <div className="text-sm text-gray-600 mt-2 space-y-1">
                  <p>
                    {formData.email || "[Email]"} • {formData.phone || "[Phone]"}
                  </p>
                  <p>{formData.address || "[Address]"}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-6">
                {formData.objective && (
                  <div>
                    <h2 className="text-lg font-semibold text-blue-600 border-b border-blue-200 pb-1 mb-3">
                      OBJECTIVE
                    </h2>
                    <div className="text-sm" dangerouslySetInnerHTML={{ __html: formData.objective }} />
                  </div>
                )}

                {formData.experience && (
                  <div>
                    <h2 className="text-lg font-semibold text-blue-600 border-b border-blue-200 pb-1 mb-3">
                      WORK EXPERIENCE
                    </h2>
                    <div className="text-sm" dangerouslySetInnerHTML={{ __html: formData.experience }} />
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-blue-600 border-b border-blue-200 pb-1 mb-3">EDUCATION</h2>
                  <div
                    className="text-sm"
                    dangerouslySetInnerHTML={{ __html: formData.education || "[Education Details]" }}
                  />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-blue-600 border-b border-blue-200 pb-1 mb-3">SKILLS</h2>
                  <div className="text-sm" dangerouslySetInnerHTML={{ __html: formData.skills || "[Skills]" }} />
                </div>
              </div>
            </div>
          </div>
        )
      }
    }
  }

  const generateLeaveApplicationPreview = () => {
    const variant = template.variants.find((v) => v.id === selectedVariant)

    if (selectedLanguage === "nepali") {
      if (selectedVariant === "medical") {
        return (
          <div className="bg-white p-8 text-black min-h-[600px] font-serif">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold">स्वास्थ्य समस्याको कारण बिदाको निवेदन</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p>श्रीमान्,</p>
                <p>{formData.officeHead || "[कार्यालय प्रमुख]"}</p>
                <p>{formData.officeName || "[कार्यालयको नाम]"}</p>
              </div>

              <div>
                <p>
                  <strong>विषय:</strong> स्वास्थ्य समस्याको कारण बिदाको लागि निवेदन
                </p>
              </div>

              <div>
                <p>महोदय,</p>
                <p className="mt-2">
                  म तपाईंको कार्यालयमा {formData.position || "[पद]"} मा कार्यरत {formData.applicantName || "[तपाईंको नाम]"}{" "}
                  हुँ। मेरो स्वास्थ्य अवस्था राम्रो नभएको कारणले {formData.startDate || "[सुरु मिति]"} देखि{" "}
                  {formData.endDate || "[अन्त्य मिति]"} सम्म बिदा चाहिएको छ।
                </p>
                <div className="mt-2">
                  <strong>स्वास्थ्य समस्या:</strong>
                  <div dangerouslySetInnerHTML={{ __html: formData.leaveReason || "[स्वास्थ्य समस्याको विवरण]" }} />
                </div>
                <p className="mt-2">
                  डाक्टरको सल्लाह अनुसार मलाई पूर्ण आराम चाहिएको छ। आवश्यक परेमा चिकित्सा प्रमाणपत्र पेश गर्न तयार छु।
                </p>
                <p className="mt-2">अतः उक्त अवधिमा मलाई बिदा प्रदान गरिदिनुहुन विनम्र अनुरोध छ।</p>
              </div>

              <div className="pt-8">
                <p>धन्यवाद,</p>
                <p className="mt-4">{formData.applicantName || "[तपाईंको नाम]"}</p>
                <p>मिति: {formData.applicationDate || "[आजको मिति]"}</p>
              </div>
            </div>
          </div>
        )
      } else if (selectedVariant === "emergency") {
        return (
          <div className="bg-white p-8 text-black min-h-[600px] font-serif">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-red-600">आकस्मिक बिदाको निवेदन</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p>श्रीमान्,</p>
                <p>{formData.officeHead || "[कार्यालय प्रमुख]"}</p>
                <p>{formData.officeName || "[कार्यालयको नाम]"}</p>
              </div>

              <div>
                <p>
                  <strong>विषय:</strong> आकस्मिक बिदाको लागि तत्काल निवेदन
                </p>
              </div>

              <div>
                <p>महोदय,</p>
                <p className="mt-2">
                  म तपाईंको कार्यालयमा {formData.position || "[पद]"} मा कार्यरत {formData.applicantName || "[तपाईंको नाम]"}{" "}
                  हुँ। आकस्मिक कारणले मलाई तत्काल {formData.startDate || "[सुरु मिति]"} देखि {formData.endDate || "[अन्त्य मिति]"}{" "}
                  सम्म बिदा चाहिएको छ।
                </p>
                <div className="mt-2 p-3 border-l-4 border-red-500 bg-red-50">
                  <strong>आकस्मिक कारण:</strong>
                  <div dangerouslySetInnerHTML={{ __html: formData.leaveReason || "[आकस्मिक अवस्थाको विवरण]" }} />
                </div>
                <p className="mt-2">यो अवस्था अप्रत्याशित भएको र तत्काल उपस्थित हुनुपर्ने भएकोले मलाई बिदा दिनुहुन अनुरोध छ।</p>
              </div>

              <div className="pt-8">
                <p>धन्यवाद,</p>
                <p className="mt-4">{formData.applicantName || "[तपाईंको नाम]"}</p>
                <p>मिति: {formData.applicationDate || "[आजको मिति]"}</p>
              </div>
            </div>
          </div>
        )
      } else if (selectedVariant === "vacation") {
        return (
          <div className="bg-white p-8 text-black min-h-[600px] font-serif">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold">छुट्टीको लागि निवेदन</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p>श्रीमान्,</p>
                <p>{formData.officeHead || "[कार्यालय प्रमुख]"}</p>
                <p>{formData.officeName || "[कार्यालयको नाम]"}</p>
              </div>

              <div>
                <p>
                  <strong>विषय:</strong> छुट्टीको लागि अग्रिम निवेदन
                </p>
              </div>

              <div>
                <p>महोदय,</p>
                <p className="mt-2">
                  म तपाईंको कार्यालयमा {formData.position || "[पद]"} मा कार्यरत {formData.applicantName || "[तपाईंको नाम]"}{" "}
                  हुँ। व्यक्तिगत कारणले मलाई {formData.startDate || "[सुरु मिति]"} देखि {formData.endDate || "[अन्त्य मिति]"} सम्म
                  छुट्टी चाहिएको छ।
                </p>
                <div className="mt-2">
                  <strong>छुट्टीको कारण:</strong>
                  <div dangerouslySetInnerHTML={{ __html: formData.leaveReason || "[छुट्टीको कारण]" }} />
                </div>
                <p className="mt-2">
                  मेरो अनुपस्थितिमा मेरो काम जिम्मेवारी सहकर्मीहरूलाई बुझाएर जानेछु र फर्केपछि तत्काल काममा लाग्नेछु।
                </p>
                <p className="mt-2">अतः उक्त अवधिमा मलाई छुट्टी प्रदान गरिदिनुहुन विनम्र अनुरोध छ।</p>
              </div>

              <div className="pt-8">
                <p>धन्यवाद,</p>
                <p className="mt-4">{formData.applicantName || "[तपाईंको नाम]"}</p>
                <p>मिति: {formData.applicationDate || "[आजको मिति]"}</p>
              </div>
            </div>
          </div>
        )
      } else {
        // Standard leave application
        return (
          <div className="bg-white p-8 text-black min-h-[600px] font-serif">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold">निवेदन पत्र</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p>श्रीमान्,</p>
                <p>{formData.officeHead || "[कार्यालय प्रमुख]"}</p>
                <p>{formData.officeName || "[कार्यालयको नाम]"}</p>
              </div>

              <div>
                <p>
                  <strong>विषय:</strong> बिदाको लागि निवेदन
                </p>
              </div>

              <div>
                <p>महोदय,</p>
                <p className="mt-2">
                  म तपाईंको कार्यालयमा {formData.position || "[पद]"} मा कार्यरत {formData.applicantName || "[तपाईंको नाम]"}{" "}
                  हुँ। मलाई निम्न कारणले {formData.startDate || "[सुरु मिति]"} देखि {formData.endDate || "[अन्त्य मिति]"} सम्म
                  बिदा चाहिएको छ।
                </p>
                <div className="mt-2">
                  <strong>कारण:</strong>
                  <div dangerouslySetInnerHTML={{ __html: formData.leaveReason || "[बिदाको कारण]" }} />
                </div>
                <p className="mt-2">अतः उक्त अवधिमा मलाई बिदा प्रदान गरिदिनुहुन अनुरोध छ।</p>
              </div>

              <div className="pt-8">
                <p>धन्यवाद,</p>
                <p className="mt-4">{formData.applicantName || "[तपाईंको नाम]"}</p>
                <p>मिति: {formData.applicationDate || "[आजको मिति]"}</p>
              </div>
            </div>
          </div>
        )
      }
    } else {
      // English versions with similar variations
      if (selectedVariant === "medical") {
        return (
          <div className="bg-white p-8 text-black min-h-[600px] font-serif">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold">MEDICAL LEAVE APPLICATION</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p>To,</p>
                <p>{formData.officeHead || "[Office Head]"}</p>
                <p>{formData.officeName || "[Office Name]"}</p>
              </div>

              <div>
                <p>
                  <strong>Subject:</strong> Application for Medical Leave
                </p>
              </div>

              <div>
                <p>Sir/Madam,</p>
                <p className="mt-2">
                  I am {formData.applicantName || "[Your Name]"}, working as {formData.position || "[Position]"} in your
                  office. Due to health issues, I need medical leave from {formData.startDate || "[Start Date]"} to{" "}
                  {formData.endDate || "[End Date]"}.
                </p>
                <div className="mt-2">
                  <strong>Medical Condition:</strong>
                  <div dangerouslySetInnerHTML={{ __html: formData.leaveReason || "[Medical condition details]" }} />
                </div>
                <p className="mt-2">
                  As per doctor's advice, I need complete rest for recovery. I am ready to submit medical certificate if
                  required.
                </p>
                <p className="mt-2">
                  Therefore, I kindly request you to grant me medical leave for the mentioned period.
                </p>
              </div>

              <div className="pt-8">
                <p>Thank you,</p>
                <p className="mt-4">{formData.applicantName || "[Your Name]"}</p>
                <p>Date: {formData.applicationDate || "[Application Date]"}</p>
              </div>
            </div>
          </div>
        )
      } else if (selectedVariant === "emergency") {
        return (
          <div className="bg-white p-8 text-black min-h-[600px] font-serif">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-red-600">EMERGENCY LEAVE APPLICATION</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p>To,</p>
                <p>{formData.officeHead || "[Office Head]"}</p>
                <p>{formData.officeName || "[Office Name]"}</p>
              </div>

              <div>
                <p>
                  <strong>Subject:</strong> Urgent Application for Emergency Leave
                </p>
              </div>

              <div>
                <p>Sir/Madam,</p>
                <p className="mt-2">
                  I am {formData.applicantName || "[Your Name]"}, working as {formData.position || "[Position]"} in your
                  office. Due to an emergency situation, I urgently need leave from{" "}
                  {formData.startDate || "[Start Date]"} to {formData.endDate || "[End Date]"}.
                </p>
                <div className="mt-2 p-3 border-l-4 border-red-500 bg-red-50">
                  <strong>Emergency Situation:</strong>
                  <div dangerouslySetInnerHTML={{ __html: formData.leaveReason || "[Emergency situation details]" }} />
                </div>
                <p className="mt-2">
                  This situation is unexpected and requires my immediate attention. I request your kind consideration
                  for granting emergency leave.
                </p>
              </div>

              <div className="pt-8">
                <p>Thank you,</p>
                <p className="mt-4">{formData.applicantName || "[Your Name]"}</p>
                <p>Date: {formData.applicationDate || "[Application Date]"}</p>
              </div>
            </div>
          </div>
        )
      } else if (selectedVariant === "vacation") {
        return (
          <div className="bg-white p-8 text-black min-h-[600px] font-serif">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold">VACATION LEAVE APPLICATION</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p>To,</p>
                <p>{formData.officeHead || "[Office Head]"}</p>
                <p>{formData.officeName || "[Office Name]"}</p>
              </div>

              <div>
                <p>
                  <strong>Subject:</strong> Application for Vacation Leave
                </p>
              </div>

              <div>
                <p>Sir/Madam,</p>
                <p className="mt-2">
                  I am {formData.applicantName || "[Your Name]"}, working as {formData.position || "[Position]"} in your
                  office. I would like to request vacation leave from {formData.startDate || "[Start Date]"} to{" "}
                  {formData.endDate || "[End Date]"} for personal reasons.
                </p>
                <div className="mt-2">
                  <strong>Purpose of Leave:</strong>
                  <div dangerouslySetInnerHTML={{ __html: formData.leaveReason || "[Vacation purpose]" }} />
                </div>
                <p className="mt-2">
                  I will ensure proper handover of my responsibilities to colleagues before my departure and will resume
                  work immediately upon my return.
                </p>
                <p className="mt-2">
                  Therefore, I kindly request you to grant me vacation leave for the mentioned period.
                </p>
              </div>

              <div className="pt-8">
                <p>Thank you,</p>
                <p className="mt-4">{formData.applicantName || "[Your Name]"}</p>
                <p>Date: {formData.applicationDate || "[Application Date]"}</p>
              </div>
            </div>
          </div>
        )
      } else {
        // Standard leave application
        return (
          <div className="bg-white p-8 text-black min-h-[600px] font-serif">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold">LEAVE APPLICATION</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p>To,</p>
                <p>{formData.officeHead || "[Office Head]"}</p>
                <p>{formData.officeName || "[Office Name]"}</p>
              </div>

              <div>
                <p>
                  <strong>Subject:</strong> Application for Leave
                </p>
              </div>

              <div>
                <p>Sir/Madam,</p>
                <p className="mt-2">
                  I am {formData.applicantName || "[Your Name]"}, working as {formData.position || "[Position]"} in your
                  office. I need leave from {formData.startDate || "[Start Date]"} to {formData.endDate || "[End Date]"}{" "}
                  due to the following reason:
                </p>
                <div className="mt-2">
                  <strong>Reason:</strong>
                  <div dangerouslySetInnerHTML={{ __html: formData.leaveReason || "[Reason for Leave]" }} />
                </div>
                <p className="mt-2">Therefore, I kindly request you to grant me leave for the mentioned period.</p>
              </div>

              <div className="pt-8">
                <p>Thank you,</p>
                <p className="mt-4">{formData.applicantName || "[Your Name]"}</p>
                <p>Date: {formData.applicationDate || "[Application Date]"}</p>
              </div>
            </div>
          </div>
        )
      }
    }
  }

  const generateRentAgreementPreview = () => {
    const variant = template.variants.find((v) => v.id === selectedVariant)

    if (selectedVariant === "basic") {
      // Basic rent agreement - simple and minimal
      if (selectedLanguage === "nepali") {
        return (
          <div className="bg-white p-8 text-black min-h-[600px] font-serif">
            <div className="text-center mb-8">
              <h1 className="text-xl font-bold">घर भाडा सम्झौता</h1>
            </div>

            <div className="space-y-4 text-sm">
              <p>यो सम्झौता {formData.signDate || "[मिति]"} मा भएको छ:</p>

              <div className="space-y-2">
                <p>
                  <strong>मालिक:</strong> {formData.ownerName || "[मालिकको नाम]"}
                </p>
                <p>
                  <strong>भाडावाल:</strong> {formData.tenantName || "[भाडावालको नाम]"}
                </p>
              </div>

              <div>
                <p>
                  <strong>सम्पत्ति:</strong> {formData.propertyAddress || "[सम्पत्तिको ठेगाना]"}
                </p>
              </div>

              <div className="space-y-2 mt-6">
                <p>
                  <strong>मासिक भाडा:</strong> रु. {formData.rentAmount || "[रकम]"}/-
                </p>
                <p>
                  <strong>धरौटी:</strong> रु. {formData.depositAmount || "[धरौटी]"}/-
                </p>
                <p>
                  <strong>अवधि:</strong> {formData.startDate || "[सुरु मिति]"} देखि {formData.endDate || "[अन्त्य मिति]"} सम्म
                </p>
              </div>

              <div className="pt-8">
                <div className="flex justify-between">
                  <div className="text-center">
                    <p>___________________</p>
                    <p>मालिकको हस्ताक्षर</p>
                  </div>
                  <div className="text-center">
                    <p>___________________</p>
                    <p>भाडावालको हस्ताक्षर</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      } else {
        return (
          <div className="bg-white p-8 text-black min-h-[600px] font-serif">
            <div className="text-center mb-8">
              <h1 className="text-xl font-bold">BASIC RENT AGREEMENT</h1>
            </div>

            <div className="space-y-4 text-sm">
              <p>This agreement is made on {formData.signDate || "[Date]"} between:</p>

              <div className="space-y-2">
                <p>
                  <strong>Owner:</strong> {formData.ownerName || "[Owner's Name]"}
                </p>
                <p>
                  <strong>Tenant:</strong> {formData.tenantName || "[Tenant's Name]"}
                </p>
              </div>

              <div>
                <p>
                  <strong>Property:</strong> {formData.propertyAddress || "[Property Address]"}
                </p>
              </div>

              <div className="space-y-2 mt-6">
                <p>
                  <strong>Monthly Rent:</strong> Rs. {formData.rentAmount || "[Amount]"}/-
                </p>
                <p>
                  <strong>Security Deposit:</strong> Rs. {formData.depositAmount || "[Deposit]"}/-
                </p>
                <p>
                  <strong>Duration:</strong> {formData.startDate || "[Start Date]"} to{" "}
                  {formData.endDate || "[End Date]"}
                </p>
              </div>

              <div className="pt-8">
                <div className="flex justify-between">
                  <div className="text-center">
                    <p>___________________</p>
                    <p>Owner's Signature</p>
                  </div>
                  <div className="text-center">
                    <p>___________________</p>
                    <p>Tenant's Signature</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    } else if (selectedVariant === "furnished") {
      // Furnished property agreement with inventory
      if (selectedLanguage === "nepali") {
        return (
          <div className="bg-white p-8 text-black min-h-[600px] font-serif">
            <div className="text-center mb-8">
              <h1 className="text-xl font-bold">सुसज्जित घर भाडा सम्झौता</h1>
            </div>

            <div className="space-y-4 text-sm">
              <p>यो सुसज्जित घरको भाडा सम्झौता {formData.signDate || "[मिति]"} मा भएको छ:</p>

              <div className="space-y-2">
                <p>
                  <strong>घर मालिक:</strong> {formData.ownerName || "[मालिकको नाम]"}
                </p>
                <p>
                  <strong>भाडामा लिने:</strong> {formData.tenantName || "[भाडावालको नाम]"}
                </p>
              </div>

              <div>
                <p>
                  <strong>सुसज्जित सम्पत्ति:</strong> {formData.propertyAddress || "[सम्पत्तिको ठेगाना]"}
                </p>
              </div>

              <div className="space-y-3 mt-6">
                <h3 className="font-bold">नियम र शर्तहरू:</h3>
                <p>
                  <strong>१. मासिक भाडा:</strong> रु. {formData.rentAmount || "[रकम]"}/- (फर्निचर सहित)
                </p>
                <p>
                  <strong>२. धरौटी:</strong> रु. {formData.depositAmount || "[धरौटी]"}/-
                </p>
                <p>
                  <strong>३. अवधि:</strong> {formData.startDate || "[सुरु मिति]"} देखि {formData.endDate || "[अन्त्य मिति]"}
                  सम्म
                </p>
                <p>
                  <strong>४. फर्निचर:</strong> घरमा रहेका सबै फर्निचर र सामानहरूको जिम्मेवारी भाडावालको हुनेछ।
                </p>
                <p>
                  <strong>५. क्षति:</strong> कुनै फर्निचर वा सामान बिग्रिएमा भाडावालले मर्मत गराउनु पर्नेछ।
                </p>
              </div>

              {formData.terms && (
                <div>
                  <strong>अतिरिक्त शर्तहरू:</strong>
                  <div dangerouslySetInnerHTML={{ __html: formData.terms }} />
                </div>
              )}

              <div className="pt-8">
                <div className="flex justify-between">
                  <div className="text-center">
                    <p>___________________</p>
                    <p>मालिकको हस्ताक्षर</p>
                  </div>
                  <div className="text-center">
                    <p>___________________</p>
                    <p>भाडावालको हस्ताक्षर</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      } else {
        return (
          <div className="bg-white p-8 text-black min-h-[600px] font-serif">
            <div className="text-center mb-8">
              <h1 className="text-xl font-bold">FURNISHED PROPERTY RENT AGREEMENT</h1>
            </div>

            <div className="space-y-4 text-sm">
              <p>This furnished property rent agreement is made on {formData.signDate || "[Date]"} between:</p>

              <div className="space-y-2">
                <p>
                  <strong>LESSOR (Owner):</strong> {formData.ownerName || "[Owner's Name]"}
                </p>
                <p>
                  <strong>LESSEE (Tenant):</strong> {formData.tenantName || "[Tenant's Name]"}
                </p>
              </div>

              <div>
                <p>
                  <strong>FURNISHED PROPERTY:</strong> {formData.propertyAddress || "[Property Address]"}
                </p>
              </div>

              <div className="space-y-3 mt-6">
                <h3 className="font-bold">TERMS AND CONDITIONS:</h3>
                <p>
                  <strong>1. MONTHLY RENT:</strong> Rs. {formData.rentAmount || "[Amount]"}/- (including furniture)
                </p>
                <p>
                  <strong>2. SECURITY DEPOSIT:</strong> Rs. {formData.depositAmount || "[Deposit]"}/-
                </p>
                <p>
                  <strong>3. DURATION:</strong> {formData.startDate || "[Start Date]"} to{" "}
                  {formData.endDate || "[End Date]"}
                </p>
                <p>
                  <strong>4. FURNITURE RESPONSIBILITY:</strong> Tenant shall be responsible for all furniture and
                  fixtures in the property.
                </p>
                <p>
                  <strong>5. DAMAGES:</strong> Any damage to furniture or fixtures shall be repaired/replaced by the
                  tenant.
                </p>
                <p>
                  <strong>6. INVENTORY:</strong> A detailed inventory of all furnished items is attached and forms part
                  of this agreement.
                </p>
              </div>

              {formData.terms && (
                <div>
                  <strong>ADDITIONAL TERMS:</strong>
                  <div dangerouslySetInnerHTML={{ __html: formData.terms }} />
                </div>
              )}

              <div className="pt-8">
                <div className="flex justify-between">
                  <div className="text-center">
                    <p>___________________</p>
                    <p>Owner's Signature</p>
                  </div>
                  <div className="text-center">
                    <p>___________________</p>
                    <p>Tenant's Signature</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    } else {
      // Comprehensive rent agreement - detailed with all clauses
      if (selectedLanguage === "nepali") {
        return (
          <div className="bg-white p-8 text-black min-h-[600px] font-serif">
            <div className="text-center mb-8">
              <h1 className="text-xl font-bold">विस्तृत घर भाडा सम्झौता</h1>
            </div>

            <div className="space-y-4 text-sm">
              <p>यो विस्तृत भाडा सम्झौता {formData.signDate || "[मिति]"} मा निम्न व्यक्तिहरू बीच भएको छ:</p>

              <div className="space-y-2">
                <p>
                  <strong>घर मालिक:</strong> {formData.ownerName || "[मालिकको नाम]"}, यसपछि "मालिक" भनिने
                </p>
                <p>
                  <strong>भाडामा लिने:</strong> {formData.tenantName || "[भाडावालको नाम]"}, यसपछि "भाडावाल" भनिने
                </p>
              </div>

              <div>
                <p>
                  <strong>सम्पत्ति:</strong> निम्न ठेगानामा रहेको सम्पत्ति:
                </p>
                <p className="ml-4">{formData.propertyAddress || "[सम्पत्तिको ठेगाना]"}</p>
              </div>

              <div className="space-y-3 mt-6">
                <h2 className="font-bold text-base">नियम र शर्तहरू:</h2>

                <p>
                  <strong>१. भाडा:</strong> उक्त सम्पत्तिको मासिक भाडा रु. {formData.rentAmount || "[रकम]"}/- हो जुन हरेक
                  महिनाको ५ गते भित्र तिर्नुपर्नेछ।
                </p>

                <p>
                  <strong>२. धरौटी:</strong> भाडावालले रु. {formData.depositAmount || "[धरौटी]"}/- धरौटी बुझाएको छ जुन
                  सम्झौता समाप्त भएपछि फिर्ता गरिनेछ।
                </p>

                <p>
                  <strong>३. अवधि:</strong> यो सम्झौता {formData.startDate || "[सुरु मिति]"} देखि
                  {formData.endDate || "[अन्त्य मिति]"} सम्म मान्य रहनेछ।
                </p>

                <p>
                  <strong>४. उपयोगिताहरू:</strong> बिजुली, पानी, इन्टरनेट र अन्य उपयोगिता शुल्क भाडावालले व्यहोर्नुपर्नेछ।
                </p>

                <p>
                  <strong>५. मर्मत सम्भार:</strong> सानातिना मर्मत भाडावालले गर्नुपर्नेछ। ठूला मर्मत मालिकको जिम्मेवारी हुनेछ।
                </p>

                <p>
                  <strong>६. नोटिस:</strong> सम्झौता रद्द गर्न कम्तिमा ३० दिन अगावै लिखित सूचना दिनुपर्नेछ।
                </p>

                <p>
                  <strong>७. विवाद समाधान:</strong> कुनै विवाद उत्पन्न भएमा स्थानीय अदालतको क्षेत्राधिकारमा समाधान गरिनेछ।
                </p>

                {formData.terms && (
                  <div>
                    <strong>८. अतिरिक्त शर्तहरू:</strong>
                    <div dangerouslySetInnerHTML={{ __html: formData.terms }} />
                  </div>
                )}
              </div>

              <div className="pt-8">
                <p>माथि उल्लेखित मितिमा दुवै पक्षले यस सम्झौतामा हस्ताक्षर गरेका छन्।</p>
                <div className="flex justify-between mt-8">
                  <div className="text-center">
                    <p>___________________________</p>
                    <p>मालिकको हस्ताक्षर</p>
                    <p>{formData.ownerName || "[मालिकको नाम]"}</p>
                  </div>
                  <div className="text-center">
                    <p>___________________________</p>
                    <p>भाडावालको हस्ताक्षर</p>
                    <p>{formData.tenantName || "[भाडावालको नाम]"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      } else {
        return (
          <div className="bg-white p-8 text-black min-h-[600px] font-serif">
            <div className="text-center mb-8">
              <h1 className="text-xl font-bold">COMPREHENSIVE HOUSE/ROOM RENT AGREEMENT</h1>
            </div>

            <div className="space-y-4 text-sm">
              <p>
                This comprehensive Rent Agreement is made on <strong>{formData.signDate || "[Date]"}</strong> between:
              </p>

              <div className="space-y-2">
                <p>
                  <strong>LESSOR (Owner):</strong> {formData.ownerName || "[Owner's Name]"}, hereinafter called the
                  "Owner"
                </p>
                <p>
                  <strong>LESSEE (Tenant):</strong> {formData.tenantName || "[Tenant's Name]"}, hereinafter called the
                  "Tenant"
                </p>
              </div>

              <div>
                <p>
                  <strong>PROPERTY:</strong> The property located at:
                </p>
                <p className="ml-4">{formData.propertyAddress || "[Property Address]"}</p>
              </div>

              <div className="space-y-3 mt-6">
                <h2 className="font-bold text-base">TERMS AND CONDITIONS:</h2>

                <p>
                  <strong>1. RENT:</strong> The monthly rent for the above property is Rs.
                  {formData.rentAmount || "[Amount]"}/- payable in advance by the 5th of every month.
                </p>

                <p>
                  <strong>2. SECURITY DEPOSIT:</strong> The tenant has paid Rs. {formData.depositAmount || "[Deposit]"}
                  /- as security deposit which will be refunded upon termination of agreement.
                </p>

                <p>
                  <strong>3. DURATION:</strong> This agreement is valid from {formData.startDate || "[Start Date]"} to
                  {formData.endDate || "[End Date]"}.
                </p>

                <p>
                  <strong>4. UTILITIES:</strong> Electricity, water, internet, and other utility charges shall be borne
                  by the tenant.
                </p>

                <p>
                  <strong>5. MAINTENANCE:</strong> Minor repairs shall be borne by the tenant. Major structural repairs
                  shall be the responsibility of the owner.
                </p>

                <p>
                  <strong>6. NOTICE PERIOD:</strong> Either party may terminate this agreement by giving 30 days written
                  notice.
                </p>

                <p>
                  <strong>7. DISPUTE RESOLUTION:</strong> Any disputes arising shall be resolved under the jurisdiction
                  of local courts.
                </p>

                <p>
                  <strong>8. SUBLETTING:</strong> The tenant shall not sublet the property without written consent from
                  the owner.
                </p>

                {formData.terms && (
                  <div>
                    <strong>9. ADDITIONAL TERMS:</strong>
                    <div dangerouslySetInnerHTML={{ __html: formData.terms }} />
                  </div>
                )}
              </div>

              <div className="pt-8">
                <p>IN WITNESS WHEREOF, both parties have signed this agreement on the date mentioned above.</p>
                <div className="flex justify-between mt-8">
                  <div className="text-center">
                    <p>___________________________</p>
                    <p>Owner's Signature</p>
                    <p>{formData.ownerName || "[Owner's Name]"}</p>
                  </div>
                  <div className="text-center">
                    <p>___________________________</p>
                    <p>Tenant's Signature</p>
                    <p>{formData.tenantName || "[Tenant's Name]"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    }
  }

  const generateMarriageAffidavitPreview = () => {
    return renderMarriageAffidavitPreview(formData, selectedVariant)
  }

  const generateBharpaiReceiptPreview = () => {
    return renderBharpaiReceiptPreview(formData)
  }

  const generatePreview = () => {
    return renderTemplatePreview({
      templateId,
      templateTitle: template.title,
      formData,
      renderCv: generateCVPreview,
      renderLeave: generateLeaveApplicationPreview,
      renderRent: generateRentAgreementPreview,
      renderMarriage: generateMarriageAffidavitPreview,
      renderBharpai: generateBharpaiReceiptPreview,
    })
  }

  const handleGeneratePdf = async () => {
    try {
      setIsGeneratingPdf(true)

      if (!validateCurrentForm()) {
        setIsGeneratingPdf(false)
        return
      }

      // Auto-save document before generating PDF
      if (!documentId) {
        await handleSaveDocument()
      }

      // Make sure we're on the preview tab
      if (activeTab !== "preview") {
        setActiveTab("preview")
        // Wait for the tab to switch and render
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      // Wait a bit more to ensure everything is rendered
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Get the preview element
      const previewElement = previewRef.current
      if (!previewElement) {
        throw new Error("Preview element not found")
      }

      // Check if element is visible
      if (!previewElement.offsetParent) {
        throw new Error("Preview element is not visible")
      }

      // Scroll to the element to ensure it's in view
      previewElement.scrollIntoView({ behavior: "smooth", block: "start" })

      // Wait for scroll to complete
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Generate PDF from the preview element
      const languageSuffix = selectedLanguage === "nepali" ? "_NP" : "_EN"
      const variantSuffix = selectedVariant ? `_${selectedVariant}` : ""
      const filename = `${template.title.replace(/[^a-zA-Z0-9]/g, "_")}${variantSuffix}${languageSuffix}.pdf`

      await generatePdfFromElement(previewElement, {
        filename: filename,
        format: "a4",
        orientation: "portrait",
        quality: 2,
      })

      toast({
        title: "PDF Generated Successfully",
        description: `Your ${template.variants.find((v) => v.id === selectedVariant)?.name || "document"} has been generated in ${selectedLanguage === "nepali" ? "Nepali" : "English"} and downloaded.`,
      })
      trackEvent("document_exported_pdf", templateId, {
        variant: selectedVariant,
        language: selectedLanguage,
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        title: "Error Generating PDF",
        description:
          error instanceof Error ? error.message : "There was an error generating your PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  const handleGenerateDoc = async () => {
    try {
      setIsGeneratingDoc(true)

      if (!validateCurrentForm()) {
        setIsGeneratingDoc(false)
        return
      }

      if (activeTab !== "preview") {
        setActiveTab("preview")
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      await new Promise((resolve) => setTimeout(resolve, 500))

      const previewElement = previewRef.current
      if (!previewElement) {
        throw new Error("Preview element not found")
      }

      if (!documentId) {
        await handleSaveDocument()
      }

      const languageSuffix = selectedLanguage === "nepali" ? "_NP" : "_EN"
      const variantSuffix = selectedVariant ? `_${selectedVariant}` : ""
      const filename = `${template.title.replace(/[^a-zA-Z0-9]/g, "_")}${variantSuffix}${languageSuffix}.docx`
      await generateDocxFromElement(previewElement, { filename })

      toast({
        title: "DOCX Generated Successfully",
        description: "Your document has been generated and downloaded.",
      })
      trackEvent("document_exported_docx", templateId, {
        variant: selectedVariant,
        language: selectedLanguage,
      })
    } catch (error) {
      console.error("Error generating DOC:", error)
      toast({
        title: "Error",
        description: "There was an error processing your request.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingDoc(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="h-6 w-6 text-primary" />
          <Badge>{template.category}</Badge>
          {template.supportedLanguages && template.supportedLanguages.length > 1 && (
            <Badge variant="secondary">Multi-language</Badge>
          )}
          {documentId && (
            <Badge variant="outline" className="flex items-center">
              <Edit className="h-3 w-3 mr-1" />
              Editing
            </Badge>
          )}
        </div>
        <h1 className="text-3xl font-bold mb-2">{template.title}</h1>
        <p className="text-muted-foreground">{template.description}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="form">Fill Form</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="mt-6">
          {/* Language Selector */}
          <LanguageSelector
            supportedLanguages={template.supportedLanguages || ["english"]}
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
          />
          {/* Template Variant Selector */}
          {template.variants && template.variants.length > 1 && (
            <TemplateVariantSelector
              variants={template.variants}
              selectedVariant={selectedVariant}
              onVariantChange={setSelectedVariant}
              templateTitle={template.title}
            />
          )}
          <Card>
            <CardHeader>
              <CardTitle>Document Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Document Title */}
              <div className="space-y-2">
                <Label htmlFor="documentTitle">Document Title (Optional)</Label>
                <Input
                  id="documentTitle"
                  placeholder="Enter custom title or leave blank for auto-generated"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                />
              </div>

              {template.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id}>
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {field.helpText && <p className="text-sm text-muted-foreground">{field.helpText}</p>}
                  {field.type === "textarea" ? (
                    <Textarea
                      id={field.id}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      value={formData[field.id] || ""}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      rows={4}
                    />
                  ) : field.type === "richtext" ? (
                    <RichTextEditor
                      value={formData[field.id] || ""}
                      onChange={(value) => handleInputChange(field.id, value)}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      minHeight="150px"
                    />
                  ) : field.type === "photo" ? (
                    <PhotoUpload
                      value={formData[field.id] || ""}
                      onChange={(value) => handleInputChange(field.id, value)}
                      label={field.label}
                      helpText={field.helpText}
                    />
                  ) : (
                    <Input
                      id={field.id}
                      type={field.type}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      value={formData[field.id] || ""}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                    />
                  )}
                </div>
              ))}

              <div className="flex space-x-4 pt-4">
                <Button onClick={handleSaveDocument} variant="outline" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Document
                    </>
                  )}
                </Button>
                <Button onClick={() => setActiveTab("preview")} className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Document
                </Button>
              </div>
            </CardContent>
          </Card>
          \
        </TabsContent>

        <TabsContent value="preview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Document Preview
                    <div className="flex items-center space-x-2">
                      {template.supportedLanguages && template.supportedLanguages.length > 1 && (
                        <Badge variant="outline">{selectedLanguage === "nepali" ? "नेपाली" : "English"}</Badge>
                      )}
                      {selectedVariant && (
                        <Badge variant="secondary">
                          {template.variants.find((v) => v.id === selectedVariant)?.name}
                        </Badge>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="border rounded-lg overflow-hidden">
                    <div ref={previewRef} className="relative">
                      {generatePreview()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {isAutoSaving ? (
                    <p className="text-xs text-muted-foreground">Autosaving...</p>
                  ) : lastSavedAt ? (
                    <p className="text-xs text-muted-foreground">Last saved: {lastSavedAt.toLocaleTimeString()}</p>
                  ) : null}
                  <Button onClick={handleSaveDocument} variant="outline" className="w-full" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {documentId ? "Update Document" : "Save Document"}
                      </>
                    )}
                  </Button>
                  <Button className="w-full" onClick={handleGeneratePdf} disabled={isGeneratingPdf}>
                    {isGeneratingPdf ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF ({selectedLanguage === "nepali" ? "नेपाली" : "English"})
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleGenerateDoc} disabled={isGeneratingDoc}>
                    {isGeneratingDoc ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FileType className="h-4 w-4 mr-2" />
                        Download DOCX ({selectedLanguage === "nepali" ? "नेपाली" : "English"})
                      </>
                    )}
                  </Button>
                  <Separator />
                  <div className="text-xs text-muted-foreground flex items-center justify-between">
                    <span>DocsNepal is completely free</span>
                    <Button variant="ghost" size="sm" asChild className="h-auto p-1">
                      <Link href="/donate" className="flex items-center text-xs">
                        <Heart className="h-3 w-3 mr-1 text-red-500" />
                        Support Us
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {documentId && (
                <Card>
                  <CardHeader>
                    <CardTitle>Document Info</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      This document is saved to your dashboard and will be automatically updated when you make changes.
                    </p>
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link href="/dashboard">View Dashboard</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {template.supportedLanguages && template.supportedLanguages.length > 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Language Options</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      This document supports multiple languages. You can switch between languages and preview before
                      downloading.
                    </p>
                    <LanguageSelector
                      supportedLanguages={template.supportedLanguages}
                      selectedLanguage={selectedLanguage}
                      onLanguageChange={handleLanguageChange}
                    />
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Having trouble with this template? Check our guide or contact support.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    View Guide
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function GenerateDocumentPage() {
  return (
    <AuthGuard>
      <GenerateDocumentContent />
    </AuthGuard>
  )
}
