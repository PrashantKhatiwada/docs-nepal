import type { Template } from "./types"

export const scholarshipApplicationTemplate: Template = {
  title: "Scholarship Application",
  description: "Scholarship request letter for academic institutions",
  category: "Education",
  supportedLanguages: ["english", "nepali"],
  variants: [
    {
      id: "student",
      name: "Student Scholarship Request",
      description: "Standard format for scholarship consideration",
      preview: "/placeholder.svg?height=400&width=300&text=Scholarship+Application",
      difficulty: "Medium",
      features: ["Academic summary", "Financial background", "Request reason", "Formal closing"],
    },
  ],
  fields: [
    { id: "applicationDate", label: "Date", type: "date", required: true },
    { id: "institutionName", label: "Institution Name", type: "text", required: true },
    { id: "applicantName", label: "Student Name", type: "text", required: true },
    { id: "programName", label: "Program/Class", type: "text", required: true },
    { id: "academicYear", label: "Academic Year", type: "text", required: true },
    { id: "gpaOrScore", label: "GPA / Score", type: "text", required: false },
    { id: "reason", label: "Reason for Scholarship", type: "richtext", required: true },
  ],
}
