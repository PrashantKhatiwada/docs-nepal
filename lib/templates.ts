export interface TemplateVariant {
  id: string
  name: string
  description: string
  preview: string
  difficulty: "Easy" | "Medium" | "Advanced"
  features: string[]
}

export interface Template {
  title: string
  description: string
  category: string
  supportedLanguages: Language[]
  variants: TemplateVariant[]
  fields: TemplateField[]
}

export interface TemplateField {
  id: string
  label: string
  type: "text" | "email" | "tel" | "date" | "textarea" | "richtext" | "number" | "photo"
  required: boolean
  placeholder?: string
  helpText?: string
}

export const templates: Record<string, Template> = {
  "cv-resume": {
    title: "CV/Resume Generator",
    description: "Create a professional CV in Nepali and English format",
    category: "Personal",
    supportedLanguages: ["nepali", "english"],
    variants: [
      {
        id: "modern",
        name: "Modern Professional",
        description: "Clean, modern design with emphasis on skills and experience",
        preview: "/placeholder.svg?height=400&width=300&text=Modern+CV",
        difficulty: "Easy",
        features: ["Clean layout", "Skills section", "Experience timeline", "Education details"],
      },
      {
        id: "classic",
        name: "Classic Traditional",
        description: "Traditional format suitable for government and formal positions",
        preview: "/placeholder.svg?height=400&width=300&text=Classic+CV",
        difficulty: "Easy",
        features: ["Traditional format", "Formal structure", "Government-friendly", "Simple design"],
      },
      {
        id: "detailed",
        name: "Detailed Professional",
        description: "Comprehensive format with sections for achievements and references",
        preview: "/placeholder.svg?height=400&width=300&text=Detailed+CV",
        difficulty: "Medium",
        features: ["Comprehensive sections", "Achievement highlights", "Reference section", "Project details"],
      },
      {
        id: "minimal",
        name: "Minimal Clean",
        description: "Simple, clean design focusing on essential information only",
        preview: "/placeholder.svg?height=400&width=300&text=Minimal+CV",
        difficulty: "Easy",
        features: ["Minimal design", "Essential info only", "Easy to read", "Quick to fill"],
      },
    ],
    fields: [
      {
        id: "photo",
        label: "Profile Photo",
        type: "photo",
        required: false,
        helpText: "Upload your profile photo (optional)",
      },
      { id: "fullName", label: "Full Name", type: "text", required: true },
      { id: "email", label: "Email Address", type: "email", required: true },
      { id: "phone", label: "Phone Number", type: "tel", required: true },
      { id: "address", label: "Address", type: "text", required: true },
      { id: "objective", label: "Career Objective", type: "richtext", required: false },
      { id: "education", label: "Education", type: "richtext", required: true },
      { id: "experience", label: "Work Experience", type: "richtext", required: false },
      { id: "skills", label: "Skills", type: "richtext", required: true },
      { id: "achievements", label: "Achievements", type: "richtext", required: false },
      { id: "references", label: "References", type: "richtext", required: false },
    ],
  },
  "leave-application": {
    title: "Leave Application (निवेदन)",
    description: "Generate a professional leave application in Nepali or English format",
    category: "Employment",
    supportedLanguages: ["nepali", "english"],
    variants: [
      {
        id: "standard",
        name: "Standard Leave Application",
        description: "General purpose leave application for most situations",
        preview: "/placeholder.svg?height=400&width=300&text=Standard+Leave",
        difficulty: "Easy",
        features: ["Standard format", "Flexible reasons", "Date range", "Professional tone"],
      },
      {
        id: "medical",
        name: "Medical Leave Application",
        description: "Specialized format for medical leave requests with health focus",
        preview: "/placeholder.svg?height=400&width=300&text=Medical+Leave",
        difficulty: "Easy",
        features: ["Medical focus", "Doctor certificate mention", "Recovery period", "Health priority"],
      },
      {
        id: "emergency",
        name: "Emergency Leave Application",
        description: "Urgent leave application for emergency situations",
        preview: "/placeholder.svg?height=400&width=300&text=Emergency+Leave",
        difficulty: "Easy",
        features: ["Urgent tone", "Emergency emphasis", "Immediate approval", "Family situations"],
      },
      {
        id: "vacation",
        name: "Vacation Leave Application",
        description: "Planned vacation and holiday leave requests with work handover details",
        preview: "/placeholder.svg?height=400&width=300&text=Vacation+Leave",
        difficulty: "Medium",
        features: ["Vacation planning", "Advance notice", "Work handover", "Return commitment"],
      },
    ],
    fields: [
      { id: "applicantName", label: "Your Name (तपाईंको नाम)", type: "text", required: true },
      { id: "position", label: "Position (पद)", type: "text", required: true },
      { id: "officeName", label: "Office Name (कार्यालयको नाम)", type: "text", required: true },
      { id: "officeHead", label: "Office Head (कार्यालय प्रमुख)", type: "text", required: true },
      { id: "leaveReason", label: "Reason for Leave (बिदाको कारण)", type: "richtext", required: true },
      { id: "startDate", label: "Start Date (सुरु मिति)", type: "date", required: true },
      { id: "endDate", label: "End Date (अन्त्य मिति)", type: "date", required: true },
      { id: "applicationDate", label: "Application Date (निवेदन मिति)", type: "date", required: true },
    ],
  },
  "marriage-affidavit": {
    title: "Marriage Affidavit",
    description: "Legal marriage affidavit document for official purposes",
    category: "Legal",
    supportedLanguages: ["english"],
    variants: [
      {
        id: "standard",
        name: "Standard Marriage Affidavit",
        description: "General marriage affidavit for most legal purposes",
        preview: "/placeholder.svg?height=400&width=300&text=Marriage+Affidavit",
        difficulty: "Medium",
        features: ["Legal format", "Witness details", "Official structure", "Court ready"],
      },
      {
        id: "detailed",
        name: "Detailed Marriage Affidavit",
        description: "Comprehensive affidavit with additional family and ceremony details",
        preview: "/placeholder.svg?height=400&width=300&text=Detailed+Affidavit",
        difficulty: "Advanced",
        features: ["Comprehensive details", "Family information", "Ceremony details", "Extended format"],
      },
    ],
    fields: [
      { id: "husbandName", label: "Husband's Name", type: "text", required: true },
      { id: "wifeName", label: "Wife's Name", type: "text", required: true },
      { id: "husbandAddress", label: "Husband's Address", type: "text", required: true },
      { id: "wifeAddress", label: "Wife's Address", type: "text", required: true },
      { id: "marriageDate", label: "Marriage Date", type: "date", required: true },
      { id: "marriagePlace", label: "Marriage Place", type: "text", required: true },
      { id: "witnessName1", label: "Witness 1 Name", type: "text", required: true },
      { id: "witnessName2", label: "Witness 2 Name", type: "text", required: true },
      { id: "declarationDate", label: "Declaration Date", type: "date", required: true },
    ],
  },
  "rent-agreement": {
    title: "Rent Agreement",
    description: "House/room rental agreement contract with legal terms",
    category: "Legal",
    supportedLanguages: ["english", "nepali"],
    variants: [
      {
        id: "basic",
        name: "Basic Rent Agreement",
        description: "Simple rental agreement with essential terms only",
        preview: "/placeholder.svg?height=400&width=300&text=Basic+Rent",
        difficulty: "Easy",
        features: ["Basic terms", "Simple structure", "Essential clauses", "Easy to understand"],
      },
      {
        id: "comprehensive",
        name: "Comprehensive Rent Agreement",
        description: "Detailed agreement with maintenance, utilities, and dispute resolution clauses",
        preview: "/placeholder.svg?height=400&width=300&text=Comprehensive+Rent",
        difficulty: "Advanced",
        features: ["Detailed clauses", "Maintenance terms", "Utility details", "Dispute resolution"],
      },
      {
        id: "furnished",
        name: "Furnished Property Agreement",
        description: "Specialized agreement for furnished properties with inventory details",
        preview: "/placeholder.svg?height=400&width=300&text=Furnished+Rent",
        difficulty: "Medium",
        features: ["Furniture inventory", "Damage clauses", "Furnished terms", "Item conditions"],
      },
    ],
    fields: [
      { id: "ownerName", label: "Owner's Name", type: "text", required: true },
      { id: "tenantName", label: "Tenant's Name", type: "text", required: true },
      { id: "propertyAddress", label: "Property Address", type: "textarea", required: true },
      { id: "rentAmount", label: "Monthly Rent Amount", type: "number", required: true },
      { id: "startDate", label: "Agreement Start Date", type: "date", required: true },
      { id: "endDate", label: "Agreement End Date", type: "date", required: true },
      { id: "depositAmount", label: "Security Deposit Amount", type: "number", required: true },
      { id: "terms", label: "Additional Terms", type: "richtext", required: false },
      { id: "signDate", label: "Signing Date", type: "date", required: true },
    ],
  },
}

export type TemplateId = keyof typeof templates
export type Language = "english" | "nepali"
