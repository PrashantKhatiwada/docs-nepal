import type { Template } from "./types"

export const leaseAgreementKoshiTemplate: Template = {
  title: "Lease Agreement (Koshi ICAS Format)",
  description: "Koshi Province ICAS नमुना lease agreement को संरचना अनुसार",
  category: "Legal",
  supportedLanguages: ["english", "nepali"],
  variants: [
    {
      id: "official-koshi-lease",
      name: "Official Lease Style",
      description: "सरकारी नमुना ढाँचा शैलीमा lease agreement",
      preview: "/placeholder.svg?height=400&width=300&text=Koshi+Lease",
      difficulty: "Medium",
      features: ["Clause-based structure", "Rent and term details", "Party obligations", "Signature block"],
    },
  ],
  fields: [
    { id: "ownerName", label: "Lessor / Owner Name", type: "text", required: true },
    { id: "tenantName", label: "Lessee / Tenant Name", type: "text", required: true },
    { id: "propertyAddress", label: "Leased Property Address", type: "textarea", required: true },
    { id: "rentAmount", label: "Monthly Lease Amount", type: "number", required: true },
    { id: "startDate", label: "Lease Start Date", type: "date", required: true },
    { id: "endDate", label: "Lease End Date", type: "date", required: true },
    { id: "depositAmount", label: "Security Deposit", type: "number", required: false },
    { id: "terms", label: "Special Terms", type: "richtext", required: false },
    { id: "signDate", label: "Signing Date", type: "date", required: true },
  ],
}
