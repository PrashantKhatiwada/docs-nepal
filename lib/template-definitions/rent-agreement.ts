import type { Template } from "./types"

export const rentAgreementTemplate: Template = {
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
}
