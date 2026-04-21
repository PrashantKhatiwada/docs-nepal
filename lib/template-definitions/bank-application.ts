import type { Template } from "./types"

export const bankApplicationTemplate: Template = {
  title: "Bank Application",
  description: "Application letter for common bank requests",
  category: "Personal",
  supportedLanguages: ["english", "nepali"],
  variants: [
    {
      id: "account-service",
      name: "Account Service Request",
      description: "Request updates or services related to your bank account",
      preview: "/placeholder.svg?height=400&width=300&text=Bank+Application",
      difficulty: "Easy",
      features: ["Formal format", "Branch details", "Request summary", "Signature section"],
    },
  ],
  fields: [
    { id: "applicationDate", label: "Application Date", type: "date", required: true },
    { id: "branchName", label: "Branch Name", type: "text", required: true },
    { id: "bankName", label: "Bank Name", type: "text", required: true },
    { id: "applicantName", label: "Applicant Name", type: "text", required: true },
    { id: "accountNumber", label: "Account Number", type: "text", required: true },
    { id: "subject", label: "Subject", type: "text", required: true },
    { id: "requestBody", label: "Request Details", type: "richtext", required: true },
  ],
}
