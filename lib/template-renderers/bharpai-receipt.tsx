import type { ReactNode } from "react"

export function renderBharpaiReceiptPreview(formData: Record<string, string>): ReactNode {
  return (
    <div className="bg-white p-8 text-black min-h-[600px] font-serif">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">भर्पाई</h1>
      </div>

      <div className="text-sm space-y-4 leading-7">
        <p className="text-right">मिति: {formData.receiptDate || "[मिति]"}</p>

        <div>
          <p>श्रीमान {formData.recipientName || "[प्राप्तकर्ता नाम]"} ज्यु</p>
          <p>{formData.officeName || "[कार्यालय/संस्था]"}</p>
        </div>

        <p className="font-semibold">विषय: {formData.subject || "[विषय]"}</p>

        <p>महोदय,</p>

        <div className="pl-6">
          <p
            dangerouslySetInnerHTML={{
              __html: formData.body || "[मुख्य विवरण लेख्नुहोस्]",
            }}
          />
        </div>

        {formData.amount ? <p>बुझेको रकम: रु. {formData.amount}</p> : null}

        <div className="pt-12 text-right">
          <p>निवेदक/पेशकर्ता</p>
          <p className="mt-8">({formData.senderName || "[नाम]"})</p>
          <p>हस्ताक्षर: __________________</p>
        </div>
      </div>
    </div>
  )
}
