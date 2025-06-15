"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  Eye,
  FileText,
  FileType,
  Loader2,
  Heart,
  Save,
  Edit,
} from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { templates, type TemplateId, type Language } from "@/lib/templates";
import { useToast } from "@/hooks/use-toast";
import { generatePdfFromElement } from "@/lib/pdf-client";
import { LanguageSelector } from "@/components/language-selector";
import { AuthGuard } from "@/components/auth-guard";
import {
  saveDocument,
  updateDocument,
  trackTemplateUsage,
} from "@/lib/documents";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { RichTextEditor } from "@/components/rich-text-editor";

function GenerateDocumentContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const templateId = params.templateId as string;
  const editId = searchParams.get("edit");
  const template = templates[templateId as TemplateId];
  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    template?.supportedLanguages?.[0] || "english"
  );
  const [activeTab, setActiveTab] = useState("form");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingDoc, setIsGeneratingDoc] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [documentId, setDocumentId] = useState<string | null>(editId);
  const [documentTitle, setDocumentTitle] = useState("");

  useEffect(() => {
    if (editId) {
      loadDocument(editId);
    } else {
      // Track template usage for new documents
      trackTemplateUsage(templateId);
    }
  }, [editId, templateId]);

  const loadDocument = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      setFormData(data.form_data);
      setSelectedLanguage(data.language as Language);
      setDocumentTitle(data.title);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load document",
        variant: "destructive",
      });
    }
  };

  if (!template) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Template Not Found</h1>
        <p className="text-muted-foreground">
          The requested template could not be found.
        </p>
      </div>
    );
  }

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
  };

  const generateDocumentTitle = () => {
    if (documentTitle) return documentTitle;

    const name =
      formData.applicantName ||
      formData.fullName ||
      formData.husbandName ||
      "Document";
    const templateName = template.title.split(" ")[0];
    return `${templateName} - ${name}`;
  };

  const handleSaveDocument = async () => {
    setIsSaving(true);
    try {
      const title = generateDocumentTitle();

      if (documentId) {
        // Update existing document
        await updateDocument(documentId, {
          title,
          form_data: formData,
          language: selectedLanguage,
        });
        toast({
          title: "Document updated",
          description: "Your document has been saved successfully",
        });
      } else {
        // Save new document
        const savedDoc = await saveDocument({
          template_id: templateId,
          title,
          form_data: formData,
          language: selectedLanguage,
        });
        setDocumentId(savedDoc.id);
        toast({
          title: "Document saved",
          description: "Your document has been saved to your dashboard",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save document",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const generateLeaveApplicationPreview = () => {
    if (selectedLanguage === "nepali") {
      return (
        <div className="bg-white p-8 text-black min-h-[600px] font-serif">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold">निवेदन</h2>
          </div>

          <div className="space-y-4">
            <div>
              <p>श्रीमान्,</p>
              <p>{formData.officeHead || "प्रमुख / सम्बन्धित अधिकारी"}</p>
              <p>{formData.officeName || "कार्यालयको नाम"}</p>
              <p>{formData.officeAddress || "कार्यालयको ठेगाना"}</p>
            </div>

            <div>
              <p>
                <strong>विषय:</strong>{" "}
                {formData.leaveSubject || "बिदा स्वीकृतिको लागि निवेदन"}
              </p>
            </div>

            <div>
              <p>महोदय,</p>
              <p className="mt-2">
                म यस कार्यालयमा {formData.position || "पद"} मा कार्यरत{" "}
                {formData.applicantName || "तपाईंको नाम"} हुँ। मलाई{" "}
                {formData.startDate || "मिति (साल/महिना/गते)"} देखि{" "}
                {formData.endDate || "मिति (साल/महिना/गते)"} सम्म
                {formData.totalDays || "अवधि"} दिनको बिदा आवश्यक परेको छ। बिदाको
                कारण निम्न अनुसार छ:
              </p>
              <div className="mt-2 prose prose-sm max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      formData.leaveReason ||
                      "यहाँ बिदाको विस्तृत कारण उल्लेख गर्नुहोस्, जस्तै: 'पारिवारिक कार्यका लागि', 'स्वास्थ्य समस्याका कारण', आदि।",
                  }}
                />
              </div>
              <p className="mt-2">
                अतः, मेरो उक्त बिदा निवेदन स्वीकृत गरी बिदा प्रदान गरिदिनुहुन
                हार्दिक अनुरोध गर्दछु।
              </p>
            </div>

            <div className="pt-8">
              <p>भवदीय,</p>
              <p className="mt-4">{formData.applicantName || "निवेदकको नाम"}</p>
              <p>पद: {formData.position || "तपाईंको पद"}</p>
              <p>सम्पर्क नम्बर: {formData.contactNumber || "सम्पर्क नम्बर"}</p>
              <p>
                मिति: {formData.applicationDate || "आजको मिति (साल/महिना/गते)"}
              </p>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-white p-8 text-black min-h-[600px] font-serif">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold">LEAVE APPLICATION</h2>
          </div>

          <div className="space-y-4">
            <div>
              <p>To,</p>
              <p>{formData.officeHead || "The Concerned Authority"}</p>
              <p>{formData.officeName || "Name of the Office/Department"}</p>
              <p>{formData.officeAddress || "Address of the Office"}</p>
            </div>

            <div>
              <p>
                <strong>Subject:</strong>{" "}
                {formData.leaveSubject || "Application for Leave of Absence"}
              </p>
            </div>

            <div>
              <p>Dear Sir/Madam,</p>
              <p className="mt-2">
                I am {formData.applicantName || "Your Full Name"}, holding the
                position of {formData.position || "Your Position"} in your
                esteemed organization. I am writing to request a leave of
                absence for {formData.totalDays || "Number"} day(s) from{" "}
                {formData.startDate || "Start Date (DD/MM/YYYY)"} to{" "}
                {formData.endDate || "End Date (DD/MM/YYYY)"}. The reason for my
                leave is as follows:
              </p>
              <div className="mt-2 prose prose-sm max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      formData.leaveReason ||
                      "Please provide a detailed reason for your leave, e.g., 'due to urgent personal matters', 'for a family event', 'due to a medical appointment', etc.",
                  }}
                />
              </div>
              <p className="mt-2">
                I kindly request you to approve my leave for the aforementioned
                period. I have made arrangements for my duties to be covered
                during my absence.
              </p>
            </div>

            <div className="pt-8">
              <p>Sincerely,</p>
              <p className="mt-4">
                {formData.applicantName || "Your Full Name"}
              </p>
              <p>Position: {formData.position || "Your Position"}</p>
              <p>
                Contact No.: {formData.contactNumber || "Your Contact Number"}
              </p>
              <p>
                Date:{" "}
                {formData.applicationDate || "Application Date (DD/MM/YYYY)"}
              </p>
            </div>
          </div>
        </div>
      );
    }
  };

  const generateCVPreview = () => {
    if (selectedLanguage === "nepali") {
      return (
        <div className="bg-white p-8 text-black min-h-[600px] font-serif">
          <div className="text-center mb-8 border-b pb-4">
            <h1 className="text-2xl font-bold">
              {formData.fullName || "तपाईंको पूरा नाम"}
            </h1>
            <div className="text-sm text-gray-600 mt-2">
              <p>
                ईमेल: {formData.email || "उदाहरण@gmail.com"} | फोन:{" "}
                {formData.phone || "+९७७-xxxxxxxxxx"}
              </p>
              <p>ठेगाना: {formData.address || "शहर, जिल्ला, देश"}</p>
              {formData.linkedin && (
                <p>
                  लिंक्डइन:{" "}
                  <a
                    href={formData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {formData.linkedin}
                  </a>
                </p>
              )}
              {formData.portfolio && (
                <p>
                  पोर्टफोलियो:{" "}
                  <a
                    href={formData.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {formData.portfolio}
                  </a>
                </p>
              )}
            </div>
          </div>

          {formData.objective && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold border-b mb-2">
                करियरको उद्देश्य
              </h2>
              <div
                className="text-sm prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: formData.objective }}
              />
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-lg font-semibold border-b mb-2">शिक्षा</h2>
            <div
              className="text-sm prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html:
                  formData.education ||
                  "यहाँ आफ्नो शैक्षिक योग्यताको विवरण, प्राप्त डिग्री, शिक्षण संस्थाको नाम, उत्तीर्ण वर्ष आदि उल्लेख गर्नुहोस्।",
              }}
            />
          </div>

          {formData.experience && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold border-b mb-2">
                कार्य अनुभव
              </h2>
              <div
                className="text-sm prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: formData.experience }}
              />
            </div>
          )}

          {formData.projects && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold border-b mb-2">
                परियोजनाहरू
              </h2>
              <div
                className="text-sm prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: formData.projects }}
              />
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-lg font-semibold border-b mb-2">सीपहरू</h2>
            <div
              className="text-sm prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html:
                  formData.skills ||
                  "यहाँ प्राविधिक सीपहरू, सफ्टवेयर ज्ञान, भाषाहरू आदि उल्लेख गर्नुहोस्।",
              }}
            />
          </div>

          {formData.awards && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold border-b mb-2">
                पुरस्कार र सम्मान
              </h2>
              <div
                className="text-sm prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: formData.awards }}
              />
            </div>
          )}

          {formData.references && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold border-b mb-2">
                सन्दर्भहरू
              </h2>
              <div
                className="text-sm prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: formData.references }}
              />
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="bg-white p-8 text-black min-h-[600px] font-serif">
          <div className="text-center mb-8 border-b pb-4">
            <h1 className="text-2xl font-bold">
              {formData.fullName || "Your Full Name"}
            </h1>
            <div className="text-sm text-gray-600 mt-2">
              <p>
                {formData.email || "your.email@example.com"} |{" "}
                {formData.phone || "+1-XXX-XXX-XXXX"}
              </p>
              <p>{formData.address || "City, State, Country"}</p>
              {formData.linkedin && (
                <p>
                  LinkedIn:{" "}
                  <a
                    href={formData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {formData.linkedin}
                  </a>
                </p>
              )}
              {formData.portfolio && (
                <p>
                  Portfolio:{" "}
                  <a
                    href={formData.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {formData.portfolio}
                  </a>
                </p>
              )}
            </div>
          </div>

          {formData.objective && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold border-b mb-2">
                PROFESSIONAL SUMMARY
              </h2>
              <div
                className="text-sm prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: formData.objective }}
              />
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-lg font-semibold border-b mb-2">EDUCATION</h2>
            <div
              className="text-sm prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html:
                  formData.education ||
                  "List your academic qualifications, degrees obtained, institutions attended, and years of graduation.",
              }}
            />
          </div>

          {formData.experience && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold border-b mb-2">
                WORK EXPERIENCE
              </h2>
              <div
                className="text-sm prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: formData.experience }}
              />
            </div>
          )}

          {formData.projects && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold border-b mb-2">PROJECTS</h2>
              <div
                className="text-sm prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: formData.projects }}
              />
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-lg font-semibold border-b mb-2">SKILLS</h2>
            <div
              className="text-sm prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html:
                  formData.skills ||
                  "Highlight your technical skills, software proficiency, languages, and other relevant abilities.",
              }}
            />
          </div>

          {formData.awards && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold border-b mb-2">
                AWARDS & RECOGNITION
              </h2>
              <div
                className="text-sm prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: formData.awards }}
              />
            </div>
          )}

          {formData.references && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold border-b mb-2">
                REFERENCES
              </h2>
              <div
                className="text-sm prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: formData.references }}
              />
            </div>
          )}
        </div>
      );
    }
  };

  const generateRentAgreementPreview = () => {
    if (selectedLanguage === "nepali") {
      return (
        <div className="bg-white p-8 text-black min-h-[600px] font-serif">
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold">घर/कोठा भाडा सम्झौता</h1>
            <p className="text-sm text-gray-600 mt-2">
              भाडामा दिने र लिने बीचको सम्झौता
            </p>
          </div>

          <div className="space-y-4 text-sm">
            <p>
              यो भाडा सम्झौता मिति{" "}
              {formData.signDate || "आजको मिति (साल/महिना/गते)"} मा निम्न दुई
              पक्षहरू बीच सम्पन्न भएको छ:
            </p>

            <div className="space-y-2">
              <p>
                पहिलो पक्ष (घरधनी): {formData.ownerName || "घरधनीको पूरा नाम"},
                ठेगाना: {formData.ownerAddress || "घरधनीको ठेगाना"},
                नागरिकता/परिचय पत्र नं: {formData.ownerId || "परिचय पत्र नम्बर"}
                । यसपछि "मालिक" भनिनेछ।
              </p>
              <p>
                दोस्रो पक्ष (भाडावाल):{" "}
                {formData.tenantName || "भाडावालको पूरा नाम"}, ठेगाना:{" "}
                {formData.tenantAddress || "भाडावालको ठेगाना"}, नागरिकता/परिचय
                पत्र नं: {formData.tenantId || "परिचय पत्र नम्बर"}। यसपछि
                "भाडावाल" भनिनेछ।
              </p>
            </div>

            <div>
              <p>
                १. सम्झौताको विषय र सम्पत्तिको विवरण: मालिकको स्वामित्वमा रहेको
                निम्न ठेगानामा अवस्थित घर/कोठा{" "}
                {formData.propertyAddress ||
                  "सम्पत्तिको पूरा ठेगाना, जस्तै: वडा नं, टोल, नगरपालिका/गाउँपालिका, जिल्ला"}
                (यसपछि "सम्पत्ति" भनिनेछ) भाडावाललाई निम्न शर्तहरूमा भाडामा
                दिइएको छ।
              </p>
            </div>

            <div className="space-y-3 mt-6">
              <h2 className="font-bold text-base">नियम र शर्तहरू:</h2>

              <p>
                २. भाडा रकम: उक्त सम्पत्तिको मासिक भाडा रु.{" "}
                {formData.rentAmount || "रकम"}/- (अक्षरमा:{" "}
                {formData.rentAmountInWords || "रकम अक्षरमा"} मात्र) तोकिएको छ।
                यो रकम हरेक महिनाको {formData.paymentDate || "मिति"} गते भित्र
                मालिकलाई बुझाउनु पर्नेछ।
              </p>

              <p>
                ३. धरौटी रकम: भाडावालले मालिकलाई रु.{" "}
                {formData.depositAmount || "रकम"}/- (अक्षरमा:{" "}
                {formData.depositAmountInWords || "रकम अक्षरमा"} मात्र) धरौटी
                बापत बुझाएको छ। यो रकम भाडा अवधि समाप्त भएपछि, सम्पत्तिमा कुनै
                क्षति नभएको खण्डमा, फिर्ता गरिनेछ।
              </p>

              <p>
                ४. भाडा अवधि: यो सम्झौता मिति{" "}
                {formData.startDate || "सुरु मिति (साल/महिना/गते)"} देखि{" "}
                {formData.endDate || "अन्त्य मिति (साल/महिना/गते)"} सम्म{" "}
                {formData.agreementDuration || "अवधि (जस्तै: १ वर्ष)"} अवधिका
                लागि मान्य रहनेछ। अवधि समाप्त भएपछि, दुवै पक्षको सहमतिमा नवीकरण
                गर्न सकिनेछ।
              </p>

              <p>
                ५. उपयोगिता शुल्क: बिजुली, पानी, इन्टरनेट, फोहोरमैला व्यवस्थापन
                लगायतका उपयोगिता शुल्कहरू भाडावालले आफैंले व्यहोर्नुपर्नेछ।
              </p>

              <p>
                ६. मर्मत सम्भार: सम्पत्तिको सामान्य मर्मत सम्भार (जस्तै: बिजुली
                बल्ब फेर्ने, सरसफाइ गर्ने) भाडावालको जिम्मेवारी हुनेछ। ठूलो
                मर्मत सम्भार (जस्तै: संरचनात्मक क्षति, ठूला प्लम्बिङ समस्या)
                मालिकको जिम्मेवारी हुनेछ।
              </p>

              <p>
                ७. सम्पत्तिको उपयोग: भाडावालले सम्पत्तिलाई आवासीय प्रयोजनका लागि
                मात्र प्रयोग गर्नेछ। कुनै पनि व्यावसायिक वा गैरकानुनी
                गतिविधिहरूका लागि प्रयोग गर्न पाइने छैन।
              </p>

              <p>
                ८. सम्झौता रद्द: यदि कुनै पक्षले सम्झौता अवधि समाप्त हुनु अघि
                भाडा रद्द गर्न चाहेमा, उसले अर्को पक्षलाई कम्तीमा{" "}
                {formData.noticePeriod || "३०"} दिन अगावै लिखित सूचना
                दिनुपर्नेछ।
              </p>

              {formData.terms && (
                <div>
                  <strong>९. अन्य शर्तहरू:</strong>
                  <div
                    className="prose prose-sm max-w-none mt-1"
                    dangerouslySetInnerHTML={{ __html: formData.terms }}
                  />
                </div>
              )}
            </div>

            <div className="pt-8">
              <p>
                माथि उल्लेखित नियम र शर्तहरूमा दुवै पक्षको पूर्ण सहमति भई
                स्वेच्छाले यस सम्झौतामा मिति{" "}
                {formData.signDate || "आजको मिति (साल/महिना/गते)"} मा हस्ताक्षर
                गरेका छौं।
              </p>
              <div className="flex justify-between mt-8">
                <div className="text-center">
                  <p>___________________________</p>
                  <p>पहिलो पक्ष (घरधनी) को हस्ताक्षर</p>
                  <p>नाम: {formData.ownerName || "घरधनीको नाम"}</p>
                  <p>मिति: {formData.signDate || "आजको मिति"}</p>
                </div>
                <div className="text-center">
                  <p>___________________________</p>
                  <p>दोस्रो पक्ष (भाडावाल) को हस्ताक्षर</p>
                  <p>नाम: {formData.tenantName || "भाडावालको नाम"}</p>
                  <p>मिति: {formData.signDate || "आजको मिति"}</p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="font-bold">साक्षीहरू:</p>
                <div className="flex justify-around mt-4">
                  <div className="text-center">
                    <p>१. ___________________________</p>
                    <p>नाम: {formData.witness1Name || "साक्षी १ को नाम"}</p>
                    <p>
                      ठेगाना: {formData.witness1Address || "साक्षी १ को ठेगाना"}
                    </p>
                  </div>
                  <div className="text-center">
                    <p>२. ___________________________</p>
                    <p>नाम: {formData.witness2Name || "साक्षी २ को नाम"}</p>
                    <p>
                      ठेगाना: {formData.witness2Address || "साक्षी २ को ठेगाना"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-white p-8 text-black min-h-[600px] font-serif">
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold">RESIDENTIAL LEASE AGREEMENT</h1>
            <p className="text-sm text-gray-600 mt-2">
              Between Landlord and Tenant
            </p>
          </div>

          <div className="space-y-4 text-sm">
            <p>
              This Lease Agreement is made and entered into on this{" "}
              {formData.signDate || "Day of Month, Year"}, by and between the
              following parties:
            </p>

            <div className="space-y-2">
              <p>
                LESSOR (Landlord):{" "}
                {formData.ownerName || "Full Name of Landlord"}, residing at{" "}
                {formData.ownerAddress || "Landlord's Full Address"}, holding
                Identification No.{" "}
                {formData.ownerId || "Landlord's ID/Passport Number"}.
                Hereinafter referred to as the "Landlord".
              </p>
              <p>
                LESSEE (Tenant): {formData.tenantName || "Full Name of Tenant"},
                residing at {formData.tenantAddress || "Tenant's Full Address"},
                holding Identification No.{" "}
                {formData.tenantId || "Tenant's ID/Passport Number"}.
                Hereinafter referred to as the "Tenant".
              </p>
            </div>

            <div>
              <p>
                1. PREMISES: The Landlord hereby leases to the Tenant the
                property located at{" "}
                {formData.propertyAddress ||
                  "Full Address of Property, including City, State, and Zip Code"}
                (hereinafter referred to as the "Premises"), for residential
                purposes only.
              </p>
            </div>

            <div className="space-y-3 mt-6">
              <h2 className="font-bold text-base">TERMS AND CONDITIONS:</h2>

              <p>
                2. RENT: The monthly rent for the Premises shall be Rs.{" "}
                {formData.rentAmount || "Amount"}/- (Rupees{" "}
                {formData.rentAmountInWords || "Amount in Words"} only), payable
                in advance on or before the {formData.paymentDate || "5th"} day
                of each calendar month to the Landlord.
              </p>

              <p>
                3. SECURITY DEPOSIT: The Tenant shall pay a security deposit of
                Rs. {formData.depositAmount || "Amount"}/- (Rupees{" "}
                {formData.depositAmountInWords || "Amount in Words"} only) to
                the Landlord upon signing this agreement. This deposit shall be
                refunded to the Tenant upon the termination of this agreement,
                provided there is no damage to the Premises beyond normal wear
                and tear.
              </p>

              <p>
                4. LEASE TERM: This Agreement shall commence on{" "}
                {formData.startDate || "Start Date (DD/MM/YYYY)"} and shall
                terminate on {formData.endDate || "End Date (DD/MM/YYYY)"}, for
                a total period of{" "}
                {formData.agreementDuration || "e.g., one year"}. This agreement
                may be renewed upon mutual consent of both parties.
              </p>

              <p>
                5. UTILITIES: The Tenant shall be responsible for all utility
                charges, including but not limited to electricity, water,
                internet, and waste management services.
              </p>

              <p>
                6. MAINTENANCE: The Tenant shall be responsible for the general
                cleanliness and minor maintenance of the Premises (e.g.,
                replacing light bulbs, routine cleaning). Major repairs (e.g.,
                structural damage, major plumbing issues) shall be the
                responsibility of the Landlord.
              </p>

              <p>
                7. USE OF PREMISES: The Tenant shall use the Premises solely for
                residential purposes. No commercial or illegal activities are
                permitted.
              </p>

              <p>
                8. TERMINATION OF AGREEMENT: Should either party wish to
                terminate this agreement prior to its expiry, a written notice
                of at least {formData.noticePeriod || "30"} days must be
                provided to the other party.
              </p>

              {formData.terms && (
                <div>
                  <strong>9. ADDITIONAL TERMS:</strong>
                  <div
                    className="prose prose-sm max-w-none mt-1"
                    dangerouslySetInnerHTML={{ __html: formData.terms }}
                  />
                </div>
              )}
            </div>

            <div className="pt-8">
              <p>
                IN WITNESS WHEREOF, both parties have executed this Agreement on
                the date first written above, affirming their full understanding
                and voluntary consent to its terms.
              </p>
              <div className="flex justify-between mt-8">
                <div className="text-center">
                  <p>___________________________</p>
                  <p>Landlord's Signature</p>
                  <p>Name: {formData.ownerName || "Landlord's Full Name"}</p>
                  <p>Date: {formData.signDate || "Signing Date"}</p>
                </div>
                <div className="text-center">
                  <p>___________________________</p>
                  <p>Tenant's Signature</p>
                  <p>Name: {formData.tenantName || "Tenant's Full Name"}</p>
                  <p>Date: {formData.signDate || "Signing Date"}</p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="font-bold">WITNESSES:</p>
                <div className="flex justify-around mt-4">
                  <div className="text-center">
                    <p>1. ___________________________</p>
                    <p>Name: {formData.witness1Name || "Witness 1 Name"}</p>
                    <p>
                      Address: {formData.witness1Address || "Witness 1 Address"}
                    </p>
                  </div>
                  <div className="text-center">
                    <p>2. ___________________________</p>
                    <p>Name: {formData.witness2Name || "Witness 2 Name"}</p>
                    <p>
                      Address: {formData.witness2Address || "Witness 2 Address"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };
  const generateRecommendationLetterPreview = () => {
    const recipientBlock = formData.recipientName ? (
      <div className="mb-8 text-sm">
        <p>{formData.recipientName}</p>
        <p>{formData.recipientTitle}</p>
        <p>{formData.recipientOrganization}</p>
        <p>{formData.recipientAddress}</p>
      </div>
    ) : (
      <div className="mb-8 text-sm">
        <p>
          {selectedLanguage === "nepali"
            ? "सम्बन्धित अधिकारी,"
            : "To Whom It May Concern,"}
        </p>
      </div>
    );

    const salutation = formData.recipientName
      ? selectedLanguage === "nepali"
        ? `प्रिय ${formData.recipientName},`
        : `Dear ${formData.recipientName},`
      : selectedLanguage === "nepali"
      ? "महोदय/महोदया,"
      : "Dear Sir/Madam,";

    if (selectedLanguage === "nepali") {
      return (
        <div className="bg-white p-8 text-black min-h-[600px] font-serif">
          <div className="text-right mb-4 text-sm">
            <p>
              मिति:{" "}
              {formData.recommendationDate || "[सिफारिस मिति (साल/महिना/गते)]"}
            </p>
          </div>

          {recipientBlock}

          <div className="text-center mb-8">
            <h2 className="text-lg font-semibold underline">
              विषय: {formData.candidateName || "[उम्मेदवारको नाम]"} को सिफारिस
              सम्बन्धमा।
            </h2>
          </div>

          <div className="space-y-4 text-sm leading-relaxed">
            <p>{salutation}</p>
            <p className="indent-8 whitespace-pre-wrap">
              {formData.openingStatementNepali ||
                `म ${formData.candidateName || "[उम्मेदवारको नाम]"} लाई ${
                  formData.relationship || "[सम्बन्ध]"
                } को रूपमा ${
                  formData.acquaintanceDuration || "[चिनेको अवधि]"
                } देखि चिन्दछु, र म उहाँलाई ${
                  formData.purpose || "[सिफारिसको उद्देश्य]"
                } को लागि सिफारिस गर्न पाउँदा खुसी छु।`}
            </p>

            <p className="indent-8 whitespace-pre-wrap">
              {formData.qualities1Nepali ||
                `यस अवधिमा, मैले ${
                  formData.candidateName || "[उम्मेदवारको नाम]"
                } को [उदाहरणका लागि: कडा परिश्रम, लगनशीलता, बौद्धिक क्षमता] जस्ता गुणहरू नजिकबाट अवलोकन गरेको छु। उहाँले [कुनै विशेष उपलब्धि वा जिम्मेवारी] मा उल्लेखनीय क्षमता प्रदर्शन गर्नुभयो। उहाँ [अन्य सकारात्मक गुण] पनि हुनुहुन्छ।`}
            </p>

            <p className="indent-8 whitespace-pre-wrap">
              {formData.qualities2Nepali ||
                `एक पटक, [विशिष्ट परिस्थितिको उदाहरण] मा, उहाँले [उहाँको कार्य वा समाधान] द्वारा [सकारात्मक परिणाम] हासिल गर्नुभयो। यो घटनाले उहाँको [कुनै खास सिप वा गुण] र दबाबमा काम गर्ने क्षमतालाई उजागर गर्दछ। मलाई विश्वास छ कि उहाँ कुनै पनि भूमिकामा एक अमूल्य सम्पत्ति साबित हुनुहुनेछ।`}
            </p>

            <p className="indent-8 whitespace-pre-wrap">
              {formData.closingStatementNepali ||
                `यदि तपाईंलाई ${
                  formData.candidateName || "[उम्मेदवारको नाम]"
                } को योग्यता वा क्षमता बारे थप जानकारी चाहिएमा, कृपया मलाई सम्पर्क गर्न नहिचकिचाउनुहोस्। म उहाँको उज्ज्वल भविष्यको कामना गर्दछु।`}
            </p>
          </div>

          <div className="mt-12 text-sm">
            <p>भवदीय,</p>
            <p className="mt-6">
              {formData.recommenderName || "[तपाईंको नाम]"}
            </p>
            <p>{formData.recommenderTitle || "[तपाईंको पद]"}</p>
            <p>{formData.recommenderOrganization || "[तपाईंको संस्था]"}</p>
            <p>इमेल: {formData.recommenderEmail || "[तपाईंको इमेल]"}</p>
            <p>फोन: {formData.recommenderPhone || "[तपाईंको फोन नम्बर]"}</p>
            {formData.recommenderSignature && (
              <p className="mt-4">{formData.recommenderSignature}</p>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-white p-8 text-black min-h-[600px] font-serif">
          <div className="text-right mb-4 text-sm">
            <p>
              Date:{" "}
              {formData.recommendationDate ||
                "[Recommendation Date (DD/MM/YYYY)]"}
            </p>
          </div>

          {recipientBlock}

          <div className="text-center mb-8">
            <h2 className="text-lg font-semibold underline">
              Subject: Recommendation for
              {formData.candidateName || "[Candidate's Name]"}.
            </h2>
          </div>

          <div className="space-y-4 text-sm leading-relaxed">
            <p>{salutation}</p>
            <p className="indent-8 whitespace-pre-wrap">
              {formData.openingStatementEnglish ||
                `It is with great pleasure that I recommend ${
                  formData.candidateName || "[Candidate's Name]"
                } for ${
                  formData.purpose || "[Purpose of Recommendation]"
                }. I have known ${
                  formData.candidateName || "[Candidate's Name]"
                } for ${
                  formData.acquaintanceDuration || "[Duration of Acquaintance]"
                } in my capacity as their ${
                  formData.relationship || "[Your Relationship]"
                } at ${
                  formData.recommenderOrganization ||
                  "[Your Organization/Institution]"
                }.`}
            </p>

            <p className="indent-8 whitespace-pre-wrap">
              {formData.qualities1English ||
                `During this time, I have had the opportunity to observe ${
                  formData.candidateName || "[Candidate's Name]"
                }'s strong work ethic, exceptional dedication, and intellectual curiosity. They consistently demonstrated [e.g., problem-solving skills, leadership abilities, technical proficiency] in their work on [mention a specific project or area]. Their commitment to excellence truly sets them apart.`}
            </p>

            <p className="indent-8 whitespace-pre-wrap">
              {formData.qualities2English ||
                `For instance, during [specific situation/project example], ${
                  formData.candidateName || "[Candidate's Name]"
                } took the initiative to [describe action taken], which resulted in [positive outcome/impact]. This demonstrated their [specific skill like initiative, analytical thinking, teamwork] and ability to [another positive trait like perform under pressure, adapt to new challenges]. I am confident that they will be an invaluable asset to any team or program.`}
            </p>

            <p className="indent-8 whitespace-pre-wrap">
              {formData.closingStatementEnglish ||
                `Please do not hesitate to contact me if you require any further information regarding ${
                  formData.candidateName || "[Candidate's Name]"
                }'s qualifications or character. I can be reached at the contact details provided below. I wholeheartedly recommend them for this opportunity.`}
            </p>
          </div>

          <div className="mt-12 text-sm">
            <p>Sincerely,</p>
            <p className="mt-6">
              {formData.recommenderName || "[Your Full Name]"}
            </p>
            <p>{formData.recommenderTitle || "[Your Title]"}</p>
            <p>
              {formData.recommenderOrganization ||
                "[Your Organization/Institution]"}
            </p>
            <p>Email: {formData.recommenderEmail || "[Your Email]"}</p>
            <p>Phone: {formData.recommenderPhone || "[Your Phone Number]"}</p>
            {formData.recommenderSignature && (
              <p className="mt-4">{formData.recommenderSignature}</p>
            )}
          </div>
        </div>
      );
    }
  };
  const generateRTIApplicationPreview = () => {
    if (selectedLanguage === "nepali") {
      return (
        <div className="bg-white p-8 text-black min-h-[600px] font-serif">
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold underline">
              सूचनाको हक सम्बन्धी निवेदन
            </h1>
            <p className="mt-2 text-sm">
              (सूचनाको हक ऐन, २०६४ को दफा ७ बमोजिम)
            </p>
          </div>

          <div className="space-y-4 text-sm">
            <p>
              मिति:{" "}
              {formData.applicationDate ||
                "[निवेदन दिएको मिति (साल/महिना/गते)]"}
            </p>

            <p className="mt-4">श्रीमान्,</p>
            <p className="ml-8">प्रमुख/सूचना अधिकारी,</p>
            <p className="ml-8">
              {formData.officeName || "[सरकारी कार्यालयको नाम]"}
            </p>
            <p className="ml-8">
              {formData.officeAddress || "[सरकारी कार्यालयको ठेगाना]"}
            </p>

            <p className="mt-4">विषय: सूचना उपलब्ध गराई पाऊँ।</p>

            <p className="indent-8 mt-4">
              म, {formData.applicantName || "[निवेदकको नाम]"}, ठेगाना
              {formData.applicantAddress || "[निवेदकको ठेगाना]"}, फोन नं.
              {formData.applicantPhone || "[फोन नम्बर]"}, इमेल
              {formData.applicantEmail || "[इमेल ठेगाना]"} (ऐच्छिक) यस
              कार्यालयसँग सम्बन्धित देहायका सूचनाहरू सूचनाको हक ऐन, २०६४ को दफा
              ७ बमोजिम प्राप्त गर्न चाहन्छु।
            </p>

            <h2 className="font-bold mt-6">मागेको सूचनाको विवरण:</h2>
            <div className="border border-gray-300 p-4 min-h-[100px]">
              <p className="whitespace-pre-wrap">
                {formData.informationDetailsNepali ||
                  "[मागेको सूचनाको स्पष्ट विवरण यहाँ लेख्नुहोस् (जस्तै: कुन मितिदेखि कुन मितिसम्मको, कुन विषयसँग सम्बन्धित, कुन कागजात आदि)]"}
              </p>
            </div>

            <h2 className="font-bold mt-6">सूचना माग गर्नुको कारण:</h2>
            <div className="border border-gray-300 p-4 min-h-[50px]">
              <p className="whitespace-pre-wrap">
                {formData.reasonForRequestNepali ||
                  "[सूचना माग गर्नुको कारण यहाँ लेख्नुहोस् (जस्तै: व्यक्तिगत प्रयोजन, अनुसन्धानका लागि, सार्वजनिक हितका लागि)]"}
              </p>
            </div>

            <h2 className="font-bold mt-6">सूचना प्राप्त गर्ने तरिका:</h2>
            <div>
              <p>{formData.deliveryMethod}</p>
            </div>
            <br></br>

            <p className="indent-8 mt-6">
              उक्त सूचना उपलब्ध गराउन लाग्ने शुल्क बुझाउन म तयार छु। यदि सूचना
              उपलब्ध गराउन सम्भव नभएमा वा आंशिक सूचना प्राप्त भएमा, सूचनाको हक
              ऐन, २०६४ बमोजिम पुनरावेदन गर्ने मेरो अधिकार सुरक्षित रहनेछ।
            </p>

            <div className="pt-12 flex justify-end">
              <div className="text-center">
                <p>निवेदकको,</p>
                <p>दस्तखत: ___________________________</p>
                <p>नाम: {formData.applicantName || "[निवेदकको नाम]"}</p>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-white p-8 text-black min-h-[600px] font-serif">
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold underline">
              RIGHT TO INFORMATION APPLICATION FORM
            </h1>
            <p className="mt-2 text-sm">
              (As per Section 7 of the Right to Information Act, 2064)
            </p>
          </div>

          <div className="space-y-4 text-sm">
            <p>
              Date:{" "}
              {formData.applicationDate || "[Date of Application (DD/MM/YYYY)]"}
            </p>

            <p className="mt-4">To,</p>
            <p className="ml-8">Chief/Information Officer,</p>
            <p className="ml-8">
              {formData.officeName || "[Name of Government Office]"}
            </p>
            <p className="ml-8">
              {formData.officeAddress || "[Address of Government Office]"}
            </p>

            <p className="mt-4">Subject: Request for Information.</p>

            <p className="indent-8 mt-4">
              I, {formData.applicantName || "[Applicant's Name]"}, residing at{" "}
              {formData.applicantAddress || "[Applicant's Address]"}, Phone No.{" "}
              {formData.applicantPhone || "[Phone Number]"}, Email
              {formData.applicantEmail || "[Email Address]"} (Optional), would
              like to obtain the following information related to your office as
              per Section 7 of the Right to Information Act, 2064.
            </p>

            <h2 className="font-bold mt-6">
              Details of Information Requested:
            </h2>
            <div className="border border-gray-300 p-4 min-h-[100px]">
              <p className="whitespace-pre-wrap">
                {formData.informationDetailsEnglish ||
                  "[Clearly describe the information required here (e.g., from what date to what date, related to what subject, which documents, etc.)]"}
              </p>
            </div>

            <h2 className="font-bold mt-6">
              Reason for Requesting Information:
            </h2>
            <div className="border border-gray-300 p-4 min-h-[50px]">
              <p className="whitespace-pre-wrap">
                {formData.reasonForRequestEnglish ||
                  "[State the reason for requesting information here (e.g., for personal use, for research, for public interest)]"}
              </p>
            </div>

            <h2 className="font-bold mt-6">Method of Receiving Information:</h2>
            <div>
              <p>{formData.deliveryMethod || "[Eg. email, hardcopy]"}</p>
            </div>
            <br></br>

            <p className="indent-8 mt-6">
              I am prepared to pay the applicable fees for providing the said
              information. If the information cannot be provided or only partial
              information is received, my right to appeal as per the Right to
              Information Act, 2064 shall remain reserved.
            </p>

            <div className="pt-12 flex justify-end">
              <div className="text-center">
                <p>Sincerely,</p>
                <p>Signature: ___________________________</p>
                <p>Name: {formData.applicantName || "[Applicant's Name]"}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };
  const generateCharacterCertificatePreview = () => {
    if (selectedLanguage === "nepali") {
      return (
        <div className="bg-white p-8 text-black min-h-[600px] font-serif">
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold underline">चरित्र प्रमाणपत्र</h1>
          </div>

          <div className="space-y-4 text-sm">
            <p className="indent-8">
              प्रस्तुत प्रमाणपत्र यसै विद्यालय/कलेज/संस्थाका
              {formData.studentName || "[विद्यार्थी/व्यक्तिको नाम]"} लाई निजको
              असल चरित्र प्रमाणित गर्न जारी गरिएको हो। निज
              {formData.fatherName || "[बुवाको नाम]"} का सुपुत्र/सुपुत्री
              हुनुहुन्छ।
            </p>

            <p className="indent-8">
              निजको जन्ममिति {formData.dob || "[जन्म मिति (साल/महिना/गते)]"}
              हो। निजले यस विद्यालय/कलेज/संस्थामा मिति
              {formData.enrollDate || "[भर्ना भएको मिति (साल/महिना/गते)]"}
              देखि मिति
              {formData.leaveDate || "[छाडेको मिति (साल/महिना/गते)]"} सम्म
              {formData.programName || "[कार्यक्रम/कक्षाको नाम]"} अध्ययन/कार्य
              गर्नुभएको थियो।
            </p>

            <p className="indent-8">
              यस अवधिमा निजको आचरण
              {formData.conduct || "[असल/अति असल/सन्तोषजनक]"} रहेको कुरा
              प्रमाणित गरिन्छ। निजको रेकर्डमा कुनै पनि किसिमको अनुशासनहीन कार्य
              वा नकारात्मक टिप्पणी उल्लेख छैन।
            </p>

            <p className="indent-8">
              हामी निजको उज्ज्वल भविष्यको कामना गर्दछौं।
            </p>

            <div className="pt-12">
              <p>जारी गर्ने निकाय:</p>
              <p className="mt-2">
                {formData.issuingAuthority || "[जारी गर्ने संस्थाको नाम]"}
              </p>
              <p>ठेगाना: {formData.authorityAddress || "[संस्थाको ठेगाना]"}</p>
              <p>
                मिति:{" "}
                {formData.issueDate || "[जारी गरेको मिति (साल/महिना/गते)]"}
              </p>

              <div className="mt-12 flex justify-end">
                <div className="text-center">
                  <p>___________________________</p>
                  <p>प्रिन्सिपल/प्रमुखको हस्ताक्षर</p>
                  <p>
                    नाम: {formData.principalName || "[प्रिन्सिपल/प्रमुखको नाम]"}
                  </p>
                  <p>पद: {formData.principalTitle || "प्रिन्सिपल / प्रमुख"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-white p-8 text-black min-h-[600px] font-serif">
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold underline">
              CHARACTER CERTIFICATE
            </h1>
          </div>

          <div className="space-y-4 text-sm">
            <p className="indent-8">
              This is to certify that
              {formData.studentName || "[Name of Student/Individual]"},
              son/daughter of {formData.fatherName || "[Father's Name]"}, born
              on {formData.dob || "[Date of Birth (DD/MM/YYYY)]"}, was a
              student/employee of this institution/organization from
              {formData.enrollDate || "[Enrollment Date (DD/MM/YYYY)]"} to
              {formData.leaveDate || "[Leaving Date (DD/MM/YYYY)]"},
              pursuing/working in the
              {formData.programName || "[Program/Course/Department Name]"}.
            </p>

            <p className="indent-8">
              During the period of his/her association with this
              institution/organization, his/her conduct was
              {formData.conduct || "[Good/Excellent/Satisfactory]"}. He/She
              bears a good moral character and has never been involved in any
              undesirable activities, nor has any adverse remark been found
              against him/her in our records.
            </p>

            <p className="indent-8">
              We wish him/her all the best in his/her future endeavors.
            </p>

            <div className="pt-12">
              <p>Issued By:</p>
              <p className="mt-2">
                {formData.issuingAuthority ||
                  "[Name of Issuing Institution/Organization]"}
              </p>
              <p>
                Address:{" "}
                {formData.authorityAddress ||
                  "[Address of Institution/Organization]"}
              </p>
              <p>
                Date: {formData.issueDate || "[Date of Issue (DD/MM/YYYY)]"}
              </p>

              <div className="mt-12 flex justify-end">
                <div className="text-center">
                  <p>___________________________</p>
                  <p>Signature of Principal/Head</p>
                  <p>
                    Name: {formData.principalName || "[Name of Principal/Head]"}
                  </p>
                  <p>
                    Title:{" "}
                    {formData.principalTitle ||
                      "Principal / Head of Institution"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };
  const generateJobApplicationLetterPreview = () => {
    if (selectedLanguage === "nepali") {
      return (
        <div className="bg-white p-8 text-black min-h-[600px] font-serif">
          <div className="text-right mb-4 text-sm">
            <p>
              मिति:{" "}
              {formData.applicationDate ||
                "[निवेदन दिएको मिति (साल/महिना/गते)]"}
            </p>
          </div>

          <div className="mb-8 text-sm">
            <p>सेवामा,</p>
            <p>
              {formData.hiringManagerName
                ? `श्रीमान् ${formData.hiringManagerName},`
                : "सम्बन्धित विभाग,"}
            </p>
            <p>{formData.companyName || "[कम्पनीको नाम]"}</p>
            <p>{formData.companyAddress || "[कम्पनीको ठेगाना]"}</p>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-lg font-semibold underline">
              विषय: {formData.jobTitle || "[पदको नाम]"} पदका लागि निवेदन।
            </h2>
          </div>

          <div className="space-y-4 text-sm leading-relaxed">
            <p>महोदय/महोदया,</p>
            <p className="indent-8 whitespace-pre-wrap">
              {formData.openingParagraphNepali ||
                `तपाईंको कम्पनीले ${
                  formData.jobSource || "[स्रोत]"
                } मा प्रकाशन गरेको ${
                  formData.jobTitle || "[पदको नाम]"
                } पदको विज्ञापनको सन्दर्भमा, म यस पदका लागि आफ्नो निवेदन प्रस्तुत गर्न चाहन्छु।`}
            </p>

            <p className="indent-8 whitespace-pre-wrap">
              {formData.bodyParagraph1Nepali ||
                `मेरो [आफ्नो अनुभव वर्ष] वर्षको अनुभव र [मुख्य सिपहरू] जस्ता सिपहरूले मलाई यस पदका लागि उपयुक्त बनाउँछ। मैले [अघिल्लो कम्पनी/संस्थाको नाम] मा [अघिल्लो पदको नाम] को रूपमा काम गर्दा [प्रमुख उपलब्धि/जिम्मेवारी] जस्ता कार्यहरू सफलतापूर्वक सम्पन्न गरेको छु।`}
            </p>

            <p className="indent-8 whitespace-pre-wrap">
              {formData.bodyParagraph2Nepali ||
                `मलाई विश्वास छ कि मेरो सीप, अनुभव र तपाईंको कम्पनीको लक्ष्य प्रति मेरो उत्साहले यस पदमा सफलता हासिल गर्न र तपाईंको संगठनमा महत्त्वपूर्ण योगदान पुर्‍याउन मद्दत गर्नेछ। म ${
                  formData.companyName || "[कम्पनीको नाम]"
                } को सफलतामा सहभागी हुन उत्सुक छु।`}
            </p>

            <p className="indent-8 whitespace-pre-wrap">
              {formData.closingParagraphNepali ||
                `मेरो संलग्न Curriculum Vitae (CV) मा मेरो योग्यता र अनुभवको विस्तृत जानकारी पाउनुहुनेछ। म यस पदका लागि अन्तर्वार्तामा सहभागी हुन उत्सुक छु र तपाईंको प्रतिक्रियाको लागि तत्पर छु।`}
            </p>
          </div>

          <div className="mt-12 text-sm">
            <p>भवदीय,</p>
            <p className="mt-6">
              {formData.applicantName || "[तपाईंको नाम]"}
            </p>
            <p>{formData.applicantAddress || "[तपाईंको ठेगाना]"}</p>
            <p>फोन: {formData.applicantPhone || "[तपाईंको फोन नम्बर]"}</p>
            <p>इमेल: {formData.applicantEmail || "[तपाईंको इमेल ठेगाना]"}</p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-white p-8 text-black min-h-[600px] font-serif">
          <div className="text-right mb-4 text-sm">
            <p>Date: {formData.applicationDate || "[Date (DD/MM/YYYY)]"}</p>
          </div>

          <div className="mb-8 text-sm">
            <p>To,</p>
            <p>
              {formData.hiringManagerName
                ? formData.hiringManagerName
                : "Hiring Manager"}
            </p>
            <p>{formData.companyName || "[Company Name]"}</p>
            <p>{formData.companyAddress || "[Company Address]"}</p>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-lg font-semibold underline">
              Subject: Application for the Position of 
              {formData.jobTitle || "[Job Title]"}.
            </h2>
          </div>

          <div className="space-y-4 text-sm leading-relaxed">
            <p>
              Dear{" "}
              {formData.hiringManagerName
                ? formData.hiringManagerName
                : "Hiring Manager"}
              ,
            </p>
            <p className="indent-8 whitespace-pre-wrap">
              {formData.openingParagraph ||
                `I am writing to express my keen interest in the ${
                  formData.jobTitle || "[Job Title]"
                } position at ${
                  formData.companyName || "[Company Name]"
                }, as advertised on ${
                  formData.jobSource || "[Source of advertisement]"
                }. With my background in [Your Field/Area], I am confident that my skills and experience align well with the requirements of this role.`}
            </p>

            <p className="indent-8 whitespace-pre-wrap">
              {formData.bodyParagraph1 ||
                `Throughout my [Number] years of experience at [Previous Company Name] as a [Previous Job Title], I have developed a strong proficiency in [Key Skills/Responsibilities]. I successfully [mention a key achievement or responsibility], which demonstrates my ability to [relevant skill/trait]. My proven track record includes [another achievement/skill].`}
            </p>

            <p className="indent-8 whitespace-pre-wrap">
              {formData.bodyParagraph2 ||
                `I am particularly drawn to ${
                  formData.companyName || "[Company Name]"
                }'s commitment to [mention something specific about the company, e.g., innovation, customer service, your values], which resonates with my own professional aspirations. I am eager to leverage my abilities to contribute to your team's success and grow within a dynamic environment.`}
            </p>

            <p className="indent-8 whitespace-pre-wrap">
              {formData.closingParagraph ||
                `Thank you for considering my application. I have attached my resume for your review and welcome the opportunity to discuss my qualifications further in an interview. I am available at your earliest convenience and look forward to hearing from you soon.`}
            </p>
          </div>

          <div className="mt-12 text-sm">
            <p>Sincerely,</p>
            <p className="mt-6">
              {formData.applicantName || "[Your Full Name]"}
            </p>
            <p>{formData.applicantAddress || "[Your Address]"}</p>
            <p>Phone: {formData.applicantPhone || "[Your Phone Number]"}</p>
            <p>Email: {formData.applicantEmail || "[Your Email Address]"}</p>
          </div>
        </div>
      );
    }
  };
  const generateMarriageAffidavitPreview = () => {
    return (
      <div className="bg-white p-8 text-black min-h-[600px] font-serif">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold">
            AFFIDAVIT FOR MARRIAGE REGISTRATION
          </h1>
          <p className="text-sm text-gray-600 mt-2">Solemn Declaration</p>
        </div>

        <div className="space-y-4 text-sm">
          <p>
            I, {formData.husbandName || "Husband's Full Name"}, son of{" "}
            {formData.husbandFatherName || "Husband's Father's Name"}, aged
            about {formData.husbandAge || "XX"} years, residing at{" "}
            {formData.husbandAddress || "Husband's Full Address"}, and I,{" "}
            {formData.wifeName || "Wife's Full Name"}, daughter of{" "}
            {formData.wifeFatherName || "Wife's Father's Name"}, aged about{" "}
            {formData.wifeAge || "XX"} years, residing at{" "}
            {formData.wifeAddress || "Wife's Full Address"}, do hereby solemnly
            affirm and declare on oath as follows:
          </p>

          <div className="space-y-3">
            <p>
              1. That we are citizens of {formData.nationality || "Nationality"}{" "}
              by birth/descent and are of sound mind.
            </p>
            <p>
              2. That we were married to each other on{" "}
              {formData.marriageDate || "Date of Marriage (DD/MM/YYYY)"} at{" "}
              {formData.marriagePlace || "Place of Marriage"}
              according to{" "}
              {formData.marriageRites ||
                "e.g., Hindu/Christian/Muslim/Buddhist"}{" "}
              rites and ceremonies.
            </p>

            <p>
              3. That at the time of our marriage, I,{" "}
              {formData.husbandName || "Husband's Name"}, was{" "}
              {formData.husbandMaritalStatus || "unmarried/widower/divorcee"}
              and I, {formData.wifeName || "Wife's Name"}, was{" "}
              {formData.wifeMaritalStatus || "unmarried/widow/divorcee"}.
            </p>

            <p>
              4. That our marriage was solemnized in the presence of relatives
              and friends, including:
            </p>
            <p className="ml-4">
              a) {formData.witnessName1 || "Witness 1 Full Name"}, son/daughter
              of {formData.witnessFatherName1 || "Witness 1 Father's Name"},
              residing at {formData.witnessAddress1 || "Witness 1 Address"}.
            </p>
            <p className="ml-4">
              b) {formData.witnessName2 || "Witness 2 Full Name"}, son/daughter
              of {formData.witnessFatherName2 || "Witness 2 Father's Name"},
              residing at {formData.witnessAddress2 || "Witness 2 Address"}.
            </p>

            <p>
              5. That we have no prior subsisting marriage or legal impediments
              to our marriage as per the laws of{" "}
              {formData.countryLaw || "Country's Law"}.
            </p>

            <p>
              6. That we are making this affidavit for the purpose of getting
              our marriage officially registered and for all other legal
              purposes as may be required.
            </p>

            <p>
              7. That the contents of this affidavit are true and correct to the
              best of our knowledge and belief, and nothing material has been
              concealed therefrom.
            </p>
          </div>

          <div className="pt-8">
            <p className="font-bold">DEPONENTS:</p>
            <div className="flex justify-between mt-8">
              <div className="text-center">
                <p>___________________________</p>
                <p>Signature of {formData.husbandName || "Husband's Name"}</p>
                <p>(Husband)</p>
              </div>
              <div className="text-center">
                <p>___________________________</p>
                <p>Signature of {formData.wifeName || "Wife's Name"}</p>
                <p>(Wife)</p>
              </div>
            </div>
            <p className="mt-6">
              Verified at{" "}
              {formData.verificationPlace || "Place of Verification"} on this{" "}
              {formData.declarationDate || "Day of Month, Year"} that the
              contents of the above affidavit are true and correct to the best
              of our knowledge and belief.
            </p>
            <p className="mt-4">Identified by me:</p>
            <p>___________________________</p>
            <p>Signature of Advocate/Notary Public</p>
            <p>Name: {formData.advocateName || "[Advocate/Notary Name]"}</p>
          </div>
        </div>
      </div>
    );
  };

  const generatePreview = () => {
    if (templateId === "leave-application") {
      return generateLeaveApplicationPreview();
    } else if (templateId === "cv-resume") {
      return generateCVPreview();
    } else if (templateId === "marriage-affidavit") {
      return generateMarriageAffidavitPreview();
    } else if (templateId === "rent-agreement") {
      return generateRentAgreementPreview();
    } else if (templateId === "character-certificate") {
      return generateCharacterCertificatePreview();
    } else if (templateId === "rti-application") {
      return generateRTIApplicationPreview();
    } else if (templateId === "recommendation-letter") {
      return generateRecommendationLetterPreview();
    } else if (templateId === "job-application-letter") {
      return generateJobApplicationLetterPreview();
    }

    // Default preview for unhandled templates
    return (
      <div className="bg-white p-8 text-black min-h-[600px] font-serif">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold">{template.title.toUpperCase()}</h2>
        </div>
        <div className="space-y-4">
          {Object.entries(formData).map(([key, value]) => (
            <div key={key} className="flex">
              <span className="font-semibold min-w-[150px]">
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
                :
              </span>
              <span>{value || "[Not provided]"}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleGeneratePdf = async () => {
    try {
      setIsGeneratingPdf(true);

      // Check if required fields are filled
      if (template.fields) {
        const missingFields = template.fields
          .filter((field) => field.required && !formData[field.id])
          .map((field) => field.label);

        if (missingFields.length > 0) {
          toast({
            title: "Missing required fields",
            description: `Please fill in the following fields: ${missingFields.join(
              ", "
            )}`,
            variant: "destructive",
          });
          setIsGeneratingPdf(false);
          return;
        }
      }

      // Auto-save document before generating PDF
      if (!documentId) {
        await handleSaveDocument();
      }

      // Make sure we're on the preview tab
      if (activeTab !== "preview") {
        setActiveTab("preview");
        // Wait a bit for the tab to switch and render
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Get the preview element
      const previewElement = previewRef.current;
      if (!previewElement) {
        throw new Error("Preview element not found");
      }

      // Generate PDF from the preview element
      const languageSuffix = selectedLanguage === "nepali" ? "_NP" : "_EN";
      await generatePdfFromElement(previewElement, {
        filename: `${template.title.replace(
          /[^a-zA-Z0-9]/g,
          "_"
        )}${languageSuffix}.pdf`,
        format: "a4",
        orientation: "portrait",
        quality: 2,
      });

      toast({
        title: "PDF Generated Successfully",
        description: `Your document has been generated in ${
          selectedLanguage === "nepali" ? "Nepali" : "English"
        } and downloaded.`,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error Generating PDF",
        description:
          "There was an error generating your PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleGenerateDoc = async () => {
    try {
      setIsGeneratingDoc(true);

      // Check if required fields are filled
      if (template.fields) {
        const missingFields = template.fields
          .filter((field) => field.required && !formData[field.id])
          .map((field) => field.label);

        if (missingFields.length > 0) {
          toast({
            title: "Missing required fields",
            description: `Please fill in the following fields: ${missingFields.join(
              ", "
            )}`,
            variant: "destructive",
          });
          setIsGeneratingDoc(false);
          return;
        }
      }

      // Show message about DOC format
      toast({
        title: "DOC Format Coming Soon",
        description:
          "We're working on adding DOC format support. Currently only PDF is available.",
      });
    } catch (error) {
      console.error("Error generating DOC:", error);
      toast({
        title: "Error",
        description: "There was an error processing your request.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingDoc(false);
    }
  };

  return (
    <AuthGuard>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="h-6 w-6 text-primary" />
            <Badge>{template.category}</Badge>
            {template.supportedLanguages &&
              template.supportedLanguages.length > 1 && (
                <Badge variant="secondary">Multi-language</Badge>
              )}
            {documentId && (
              <Badge variant="outline" className="flex items-center">
                <Edit className="h-3 w-3 mr-1" />
                Editing
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold mb-2">{template.title}</h1>
          <p className="text-muted-foreground">{template.description}</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form">Fill Form</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="mt-6">
            {/* Language Selector */}
            <LanguageSelector
              supportedLanguages={template.supportedLanguages || ["english"]}
              selectedLanguage={selectedLanguage}
              onLanguageChange={handleLanguageChange}
            />

            <Card>
              <CardHeader>
                <CardTitle>Document Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Document Title */}
                <div className="space-y-2">
                  <Label htmlFor="documentTitle">
                    Document Title (Optional)
                  </Label>
                  <Input
                    id="documentTitle"
                    placeholder="Enter custom title or leave blank for auto-generated"
                    value={documentTitle}
                    onChange={(e) => setDocumentTitle(e.target.value)}
                  />
                </div>

                {template.fields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id}>
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </Label>
                    {field.type === "textarea" ? (
                      <Textarea
                        id={field.id}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        value={formData[field.id] || ""}
                        onChange={(e) =>
                          handleInputChange(field.id, e.target.value)
                        }
                        rows={4}
                      />
                    ) : field.type === "richtext" ? (
                      <RichTextEditor
                        value={formData[field.id] || ""}
                        onChange={(value) => handleInputChange(field.id, value)}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        minHeight="150px"
                      />
                    ) : (
                      <Input
                        id={field.id}
                        type={field.type}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        value={formData[field.id] || ""}
                        onChange={(e) =>
                          handleInputChange(field.id, e.target.value)
                        }
                      />
                    )}
                  </div>
                ))}

                <div className="flex space-x-4 pt-4">
                  <Button
                    onClick={handleSaveDocument}
                    variant="outline"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Document
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setActiveTab("preview")}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Document Preview
                      {template.supportedLanguages &&
                        template.supportedLanguages.length > 1 && (
                          <Badge variant="outline">
                            {selectedLanguage === "nepali"
                              ? "नेपाली"
                              : "English"}
                          </Badge>
                        )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="border rounded-lg overflow-hidden">
                      <div ref={previewRef} className="relative">
                        {generatePreview()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      onClick={handleSaveDocument}
                      variant="outline"
                      className="w-full"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {documentId ? "Update Document" : "Save Document"}
                        </>
                      )}
                    </Button>
                    <Button
                      className="w-full"
                      onClick={handleGeneratePdf}
                      disabled={isGeneratingPdf}
                    >
                      {isGeneratingPdf ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF (
                          {selectedLanguage === "nepali" ? "नेपाली" : "English"}
                          )
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleGenerateDoc}
                      disabled={isGeneratingDoc}
                    >
                      {isGeneratingDoc ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <FileType className="h-4 w-4 mr-2" />
                          Download DOC (Coming Soon)
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Need Help?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      If you have any questions or need assistance with this
                      template, feel free to contact our support.
                    </p>
                    <Link href="/contact" passHref>
                      <Button variant="ghost" className="w-full">
                        Contact Support <Heart className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AuthGuard>
  );
}

export default GenerateDocumentContent;
