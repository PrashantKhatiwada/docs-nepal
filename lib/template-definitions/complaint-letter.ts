import type { Template } from "./types"

export const complaintLetterTemplate: Template = {
  title: "Complaint Letter",
  description: "Write a structured complaint letter for institutions or offices",
  category: "Legal",
  supportedLanguages: ["english", "nepali"],
  variants: [
    {
      id: "formal",
      name: "Formal Complaint",
      description: "Standard formal complaint format",
      preview: "/placeholder.svg?height=400&width=300&text=Complaint+Letter",
      difficulty: "Easy",
      features: ["Formal heading", "Incident details", "Requested action", "Signature block"],
    },
  ],
  fields: [
    { id: "applicationDate", label: "Date", type: "date", required: true },
    { id: "recipientName", label: "Recipient Name/Office", type: "text", required: true },
    { id: "recipientAddress", label: "Recipient Address", type: "textarea", required: true },
    { id: "applicantName", label: "Your Name", type: "text", required: true },
    { id: "subject", label: "Subject", type: "text", required: true },
    { id: "incidentDetails", label: "Complaint Details", type: "richtext", required: true },
    { id: "requestedAction", label: "Requested Action", type: "richtext", required: true },
  ],
}
