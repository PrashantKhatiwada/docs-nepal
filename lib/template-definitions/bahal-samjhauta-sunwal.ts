import type { Template } from "./types"

export const bahalSamjhautaSunwalTemplate: Template = {
  title: "बहाल सम्झौता-पत्र (Sunwal Format)",
  description: "सुनवल नगरपालिका ढाँचा अनुसार नेपाली बहाल सम्झौता पत्र",
  category: "Legal",
  supportedLanguages: ["nepali"],
  variants: [
    {
      id: "official-sunwal",
      name: "Official Sunwal Style",
      description: "नगरपालिका ढाँचा जस्तै क्लज संरचनासहितको बहाल सम्झौता",
      preview: "/placeholder.svg?height=400&width=300&text=Sunwal+Bahal",
      difficulty: "Medium",
      features: ["भाडा रकम र भुक्तानी प्रावधान", "अवधि र नवीकरण", "क्षति/मर्मत दायित्व", "कानुनी शैली"],
    },
  ],
  fields: [
    { id: "ownerName", label: "प्रथम पक्ष (घरधनी)", type: "text", required: true },
    { id: "tenantName", label: "दोस्रो पक्ष (बहालमा बस्ने)", type: "text", required: true },
    { id: "propertyAddress", label: "बहालमा दिने सम्पत्तिको विवरण", type: "textarea", required: true },
    { id: "rentAmount", label: "भाडा रकम", type: "number", required: true },
    { id: "startDate", label: "सम्झौता सुरु मिति", type: "date", required: true },
    { id: "endDate", label: "सम्झौता अन्त्य मिति", type: "date", required: true },
    { id: "depositAmount", label: "धरौटी (यदि लागू भए)", type: "number", required: false },
    { id: "terms", label: "अतिरिक्त प्रावधान", type: "richtext", required: false },
    { id: "signDate", label: "सम्झौता भएको मिति", type: "date", required: true },
  ],
}
