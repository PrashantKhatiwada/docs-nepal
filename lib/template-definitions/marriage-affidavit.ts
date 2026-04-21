import type { Template } from "./types"

export const marriageAffidavitTemplate: Template = {
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
}
