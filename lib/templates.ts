export const templates = {
  "leave-application": {
    title: "Leave Application (निवेदन)",
    description: "Generate a professional leave application in Nepali or English format",
    category: "Employment",
    supportedLanguages: ["nepali", "english"],
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
  },
  "cv-resume": {
    title: "CV/Resume Generator",
    description: "Create a professional CV in Nepali and English format",
    category: "Personal",
    supportedLanguages: ["nepali", "english"],
    fields: [
      { id: "fullName", label: "Full Name", type: "text", required: true },
      { id: "email", label: "Email Address", type: "email", required: true },
      { id: "phone", label: "Phone Number", type: "tel", required: true },
      { id: "address", label: "Address", type: "text", required: true },
      { id: "objective", label: "Career Objective", type: "richtext", required: false },
      { id: "education", label: "Education", type: "richtext", required: true },
      { id: "experience", label: "Work Experience", type: "richtext", required: false },
      { id: "skills", label: "Skills", type: "richtext", required: true },
    ],
  },
  "marriage-affidavit": {
    title: "Marriage Affidavit",
    description: "Legal marriage affidavit document for official purposes",
    category: "Legal",
    supportedLanguages: ["english"],
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
  },
  "rent-agreement": {
    title: "Rent Agreement",
    description: "House/room rental agreement contract with legal terms",
    category: "Legal",
    supportedLanguages: ["english", "nepali"],
    fields: [
      { id: "ownerName", label: "Owner's Name", type: "text", required: true },
      { id: "tenantName", label: "Tenant's Name", type: "text", required: true },
      { id: "propertyAddress", label: "Property Address", type: "textarea", required: true },
      { id: "rentAmount", label: "Monthly Rent Amount", type: "number", required: true },
      { id: "startDate", label: "Agreement Start Date", type: "date", required: true },
      { id: "endDate", label: "Agreement End Date", type: "date", required: true },
      { id: "depositAmount", label: "Security Deposit Amount", type: "number", required: true },
      { id: "terms", label: "Additional Terms", type: "richtext", required: false },
      { id: "signDate", label: "Signing Date", type: "date", required: true },
    ],
  },
  "character-certificate": {
    id: "character-certificate",
    title: "Character Certificate",
    description: "Generate a character certificate for academic or professional purposes.",
    category: "Personal",
    supportedLanguages: ["english", "nepali"],
    fields: [
      { id: "studentName", label: "Student/Individual Name", type: "text", required: true },
      { id: "fatherName", label: "Father's Name", type: "text", required: true },
      { id: "dob", label: "Date of Birth", type: "date", required: true },
      { id: "enrollDate", label: "Enrollment/Start Date", type: "date", required: true },
      { id: "leaveDate", label: "Leaving/End Date", type: "date", required: true },
      { id: "programName", label: "Program/Course/Department", type: "text", required: false },
      { id: "conduct", label: "Conduct/Behavior (e.g., Excellent, Good, Satisfactory)", type: "text", required: true },
      { id: "issuingAuthority", label: "Name of Issuing Authority/Institution", type: "text", required: true },
      { id: "authorityAddress", label: "Address of Issuing Authority", type: "textarea", required: true },
      { id: "issueDate", label: "Date of Issue", type: "date", required: true },
      { id: "principalName", label: "Principal/Head's Name", type: "text", required: true },
      { id: "principalTitle", label: "Principal/Head's Title", type: "text", required: false },
    ],
  },
  "rti-application": {
    id: "rti-application",
    title: "Right to Information (RTI) Application",
    description: "Generate a request form to obtain information from government offices.",
    category: "Applications",
    supportedLanguages: ["english", "nepali"],
    fields: [
      { id: "applicationDate", label: "Date of Application", type: "date", required: true },
      { id: "officeName", label: "Name of Government Office", type: "text", required: true },
      { id: "officeAddress", label: "Address of Government Office", type: "textarea", required: true },
      { id: "applicantName", label: "Applicant's Name", type: "text", required: true },
      { id: "applicantAddress", label: "Applicant's Address", type: "textarea", required: true },
      { id: "applicantPhone", label: "Applicant's Phone Number", type: "text", required: false },
      { id: "applicantEmail", label: "Applicant's Email (Optional)", type: "email", required: false },
      { id: "informationDetailsEnglish", label: "Details of Information Requested (English)", type: "textarea", required: true, rows: 5 },
      { id: "reasonForRequestEnglish", label: "Reason for Request (English)", type: "textarea", required: true, rows: 3 },
      {id: "deliveryMethod", label: "Method of Receiving Information", type: "select",required: true,}
    ],
  },
  "recommendation-letter": {
    id: "recommendation-letter",
    title: "Recommendation Letter",
    description: "Generate a professional letter of recommendation for an individual.",
    category: "Letters",
    icon: "ClipboardCheck", // You might need to import this icon if you want it
    supportedLanguages: ["english", "nepali"],
    fields: [
      { id: "recommendationDate", label: "Date of Recommendation", type: "date", required: true },
      { id: "recommenderName", label: "Your Full Name (Recommender)", type: "text", required: true },
      { id: "recommenderTitle", label: "Your Title (Recommender)", type: "text", required: true },
      { id: "recommenderOrganization", label: "Your Organization/Institution", type: "text", required: true },
      { id: "recommenderEmail", label: "Your Email Address", type: "email", required: true },
      { id: "recommenderPhone", label: "Your Phone Number (Optional)", type: "text", required: false },

      { id: "recipientName", label: "Recipient's Name (Optional)", type: "text", required: false },
      { id: "recipientTitle", label: "Recipient's Title (Optional)", type: "text", required: false },
      { id: "recipientOrganization", label: "Recipient's Organization/Institution", type: "text", required: false },
      { id: "recipientAddress", label: "Recipient's Address (Optional)", type: "textarea", required: false },

      { id: "candidateName", label: "Candidate's Full Name", type: "text", required: true },
      { id: "purpose", label: "Purpose of Recommendation (e.g., Job Application, University Admission)", type: "text", required: true },
      { id: "relationship", label: "Your Relationship to Candidate (e.g., Professor, Manager, Colleague)", type: "text", required: true },
      { id: "acquaintanceDuration", label: "Duration of Acquaintance (e.g., '3 years', 'since 2020')", type: "text", required: true },

      { id: "openingStatementEnglish", label: "Opening Statement (English)", type: "textarea", required: true, rows: 2 },
      { id: "openingStatementNepali", label: "सुरुवाती भनाइ (Nepali)", type: "textarea", required: true, rows: 2 },

      { id: "qualities1English", label: "First Paragraph: Key Qualities/Achievements (English)", type: "textarea", required: true, rows: 5 },
      { id: "qualities1Nepali", label: "पहिलो अनुच्छेद: मुख्य गुण/उपलब्धि (Nepali)", type: "textarea", required: true, rows: 5 },

      { id: "qualities2English", label: "Second Paragraph: Specific Examples/Impact (English)", type: "textarea", required: true, rows: 5 },
      { id: "qualities2Nepali", label: "दोस्रो अनुच्छेद: विशिष्ट उदाहरण/प्रभाव (Nepali)", type: "textarea", required: true, rows: 5 },

      { id: "closingStatementEnglish", label: "Closing Statement (English)", type: "textarea", required: true, rows: 3 },
      { id: "closingStatementNepali", label: "अन्तिम भनाइ (Nepali)", type: "textarea", required: true, rows: 3 },

      { id: "recommenderSignature", label: "Recommender's Signature (for physical copy)", type: "text", required: false, placeholder: "e.g., [Your Signature]" },
    ],
  },
  "job-application-letter": {
    id: "job-application-letter",
    title: "Job Application Letter",
    description: "Generate a formal letter for job applications.",
    category: "Employment",
    supportedLanguages: ["english", "nepali"],
    fields: [
      { id: "applicationDate", label: "Date of Application", type: "date", required: true },
      { id: "applicantName", label: "Your Full Name", type: "text", required: true },
      { id: "applicantAddress", label: "Your Address", type: "textarea", required: true },
      { id: "applicantPhone", label: "Your Phone Number", type: "text", required: true },
      { id: "applicantEmail", label: "Your Email Address", type: "email", required: true },
      { id: "hiringManagerName", label: "Hiring Manager's Name (Optional)", type: "text", required: false },
      { id: "companyName", label: "Company Name", type: "text", required: true },
      { id: "companyAddress", label: "Company Address", type: "textarea", required: true },
      { id: "jobTitle", label: "Job Title You're Applying For", type: "text", required: true },
      { id: "jobSource", label: "Where You Saw the Job Advertisement (e.g., Company Website, LinkedIn)", type: "text", required: true },
      { id: "openingParagraph", label: "Opening Paragraph (English)", type: "textarea", required: true, rows: 3 },
      { id: "openingParagraphNepali", label: "सुरुको अनुच्छेद (Nepali)", type: "textarea", required: true, rows: 3 },
      { id: "bodyParagraph1", label: "Body Paragraph 1 (English) - Experience/Skills", type: "textarea", required: true, rows: 5 },
      { id: "bodyParagraph1Nepali", label: "दोस्रो अनुच्छेद (Nepali) - अनुभव/सिप", type: "textarea", required: true, rows: 5 },
      { id: "bodyParagraph2", label: "Body Paragraph 2 (English) - Why You're a Good Fit/Enthusiasm", type: "textarea", required: true, rows: 5 },
      { id: "bodyParagraph2Nepali", label: "तेस्रो अनुच्छेद (Nepali) - किन उपयुक्त हुनुहुन्छ/उत्साह", type: "textarea", required: true, rows: 5 },
      { id: "closingParagraph", label: "Closing Paragraph (English)", type: "textarea", required: true, rows: 3 },
      { id: "closingParagraphNepali", label: "अन्तिम अनुच्छेद (Nepali)", type: "textarea", required: true, rows: 3 },
    ],
  },
}

export type TemplateId = keyof typeof templates
export type Language = "english" | "nepali"
