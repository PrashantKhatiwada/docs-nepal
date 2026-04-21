import { z } from "zod"
import { templates, type TemplateId } from "./templates"

const htmlTagRegex = /<[^>]*>/g

function toPlainText(value: unknown): string {
  if (typeof value !== "string") return ""
  return value.replace(htmlTagRegex, "").replace(/&nbsp;/g, " ").trim()
}

function requiredString(label: string) {
  return z
    .string()
    .transform((value) => toPlainText(value))
    .refine((value) => value.length > 0, `${label} is required`)
}

const baseSchema = z.record(z.string(), z.any())

const templateSchemas: Partial<Record<TemplateId, z.ZodTypeAny>> = {
  "cv-resume": z.object({
    fullName: requiredString("Full Name"),
    email: z.string().email("Email Address must be valid"),
    phone: requiredString("Phone Number"),
    address: requiredString("Address"),
    education: requiredString("Education"),
    skills: requiredString("Skills"),
  }),
  "leave-application": z
    .object({
      applicantName: requiredString("Applicant Name"),
      position: requiredString("Position"),
      officeName: requiredString("Office Name"),
      officeHead: requiredString("Office Head"),
      leaveReason: requiredString("Reason for Leave"),
      startDate: requiredString("Start Date"),
      endDate: requiredString("End Date"),
      applicationDate: requiredString("Application Date"),
    })
    .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
      message: "End Date must be on or after Start Date",
      path: ["endDate"],
    }),
  "marriage-affidavit": z.object({
    husbandName: requiredString("Husband's Name"),
    wifeName: requiredString("Wife's Name"),
    husbandAddress: requiredString("Husband's Address"),
    wifeAddress: requiredString("Wife's Address"),
    marriageDate: requiredString("Marriage Date"),
    marriagePlace: requiredString("Marriage Place"),
    witnessName1: requiredString("Witness 1 Name"),
    witnessName2: requiredString("Witness 2 Name"),
    declarationDate: requiredString("Declaration Date"),
  }),
  "rent-agreement": z
    .object({
      ownerName: requiredString("Owner's Name"),
      tenantName: requiredString("Tenant's Name"),
      propertyAddress: requiredString("Property Address"),
      rentAmount: requiredString("Monthly Rent Amount"),
      startDate: requiredString("Agreement Start Date"),
      endDate: requiredString("Agreement End Date"),
      depositAmount: requiredString("Security Deposit Amount"),
      signDate: requiredString("Signing Date"),
    })
    .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
      message: "Agreement End Date must be on or after Start Date",
      path: ["endDate"],
    }),
}

function validateRequiredFields(templateId: TemplateId, formData: Record<string, any>): string[] {
  const template = templates[templateId]
  if (!template) return ["Unknown template selected"]

  return template.fields
    .filter((field) => field.required && toPlainText(formData[field.id]).length === 0)
    .map((field) => `${field.label} is required`)
}

export function validateTemplateForm(templateId: TemplateId, formData: Record<string, any>) {
  const requiredErrors = validateRequiredFields(templateId, formData)
  const schema = templateSchemas[templateId] ?? baseSchema

  const result = schema.safeParse(formData)
  const schemaErrors = result.success ? [] : result.error.issues.map((issue) => issue.message)

  const allErrors = [...new Set([...requiredErrors, ...schemaErrors])]

  return {
    success: allErrors.length === 0,
    errors: allErrors,
  }
}
