import { cvResumeTemplate } from "./template-definitions/cv-resume"
import { leaveApplicationTemplate } from "./template-definitions/leave-application"
import { marriageAffidavitTemplate } from "./template-definitions/marriage-affidavit"
import { rentAgreementTemplate } from "./template-definitions/rent-agreement"
import { bankApplicationTemplate } from "./template-definitions/bank-application"
import { complaintLetterTemplate } from "./template-definitions/complaint-letter"
import { scholarshipApplicationTemplate } from "./template-definitions/scholarship-application"
import type { Template } from "./template-definitions/types"

export type { Language, Template, TemplateField, TemplateVariant } from "./template-definitions/types"

export const templates: Record<string, Template> = {
  "cv-resume": cvResumeTemplate,
  "leave-application": leaveApplicationTemplate,
  "marriage-affidavit": marriageAffidavitTemplate,
  "rent-agreement": rentAgreementTemplate,
  "bank-application": bankApplicationTemplate,
  "complaint-letter": complaintLetterTemplate,
  "scholarship-application": scholarshipApplicationTemplate,
}

export type TemplateId = keyof typeof templates
