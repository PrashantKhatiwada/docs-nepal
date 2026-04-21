import type { Template } from "./types"

export const leaveApplicationTemplate: Template = {
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
}
