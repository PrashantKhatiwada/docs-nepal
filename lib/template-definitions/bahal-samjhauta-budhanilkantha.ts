import type { Template } from "./types"

export const bahalSamjhautaBudhanilkanthaTemplate: Template = {
  title: "घर/जग्गा बहाल सम्झौता (Budhanilkantha Format)",
  description: "बुढानीलकण्ठ नगरपालिका प्रकाशित बहाल सम्झौता ढाँचा अनुसार",
  category: "Legal",
  supportedLanguages: ["nepali"],
  variants: [
    {
      id: "official-budhanilkantha",
      name: "Official Municipality Style",
      description: "नगरपालिका नमुना ढाँचाबाट प्रेरित नेपाली बहाल सम्झौता पत्र",
      preview: "/placeholder.svg?height=400&width=300&text=Budhanilkantha+Bahal",
      difficulty: "Medium",
      features: ["नेपाली कानुनी शैली", "धारा अनुसार संरचना", "भाडा/अवधि/दायित्व", "दुवै पक्ष हस्ताक्षर"],
    },
  ],
  fields: [
    { id: "ownerName", label: "घरधनीको नाम", type: "text", required: true },
    { id: "tenantName", label: "बहालमा बस्नेको नाम", type: "text", required: true },
    { id: "propertyAddress", label: "घर/जग्गाको ठेगाना", type: "textarea", required: true },
    { id: "rentAmount", label: "मासिक भाडा रकम", type: "number", required: true },
    { id: "startDate", label: "सम्झौता सुरु मिति", type: "date", required: true },
    { id: "endDate", label: "सम्झौता अन्त्य मिति", type: "date", required: true },
    { id: "depositAmount", label: "धरौटी रकम", type: "number", required: false },
    { id: "terms", label: "थप शर्तहरू", type: "richtext", required: false },
    { id: "signDate", label: "हस्ताक्षर मिति", type: "date", required: true },
  ],
}
