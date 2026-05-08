import type { Template } from "./types"

export const bharpaiReceiptTemplate: Template = {
  title: "भर्पाई (Receipt Letter)",
  description: "नेपाली ढाँचामा रकम वा कागजात बुझेको भर्पाई पत्र",
  category: "Legal",
  supportedLanguages: ["nepali"],
  variants: [
    {
      id: "standard-nepali",
      name: "Standard Bhrapai Format",
      description: "हस्तलिखित शैली जस्तै औपचारिक भर्पाई पत्र",
      preview: "/placeholder.svg?height=400&width=300&text=Bharpai+Receipt",
      difficulty: "Easy",
      features: ["सरल नेपाली संरचना", "विषय र मिति", "रकम/विवरण", "हस्ताक्षर खण्ड"],
    },
  ],
  fields: [
    { id: "receiptDate", label: "मिति", type: "date", required: true },
    { id: "officeName", label: "कार्यालय/संस्था", type: "text", required: true },
    { id: "recipientName", label: "श्रीमान/प्राप्तकर्ता", type: "text", required: true },
    { id: "subject", label: "विषय", type: "text", required: true },
    { id: "body", label: "मुख्य विवरण", type: "richtext", required: true },
    { id: "amount", label: "रकम (रु.)", type: "text", required: false },
    { id: "senderName", label: "निवेदक/पेशकर्ता नाम", type: "text", required: true },
  ],
}
