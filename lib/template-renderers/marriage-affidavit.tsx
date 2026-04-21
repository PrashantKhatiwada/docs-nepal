import type { ReactNode } from "react"

export function renderMarriageAffidavitPreview(formData: Record<string, string>, selectedVariant: string): ReactNode {
  if (selectedVariant === "detailed") {
    return (
      <div className="bg-white p-8 text-black min-h-[600px] font-serif">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold">DETAILED MARRIAGE AFFIDAVIT</h1>
        </div>
        <div className="space-y-4 text-sm">
          <p>
            We, <strong>{formData.husbandName || "[Husband's Name]"}</strong>, son of _______, aged _____ years,
            residing at {formData.husbandAddress || "[Husband's Address]"}, and{" "}
            <strong>{formData.wifeName || "[Wife's Name]"}</strong>, daughter of _______, aged _____ years, residing at{" "}
            {formData.wifeAddress || "[Wife's Address]"}, do hereby solemnly affirm and declare as follows:
          </p>
          <div className="space-y-3">
            <p>
              <strong>1. MARRIAGE DETAILS:</strong> That we were married to each other on{" "}
              <strong>{formData.marriageDate || "[Marriage Date]"}</strong> at{" "}
              <strong>{formData.marriagePlace || "[Marriage Place]"}</strong> according to
              Hindu/Christian/Muslim/Buddhist rites and ceremonies in the presence of family members and friends.
            </p>
            <p>
              <strong>2. MARITAL STATUS:</strong> That at the time of our marriage, I,{" "}
              {formData.husbandName || "[Husband's Name]"} was unmarried/widower/divorcee and I,{" "}
              {formData.wifeName || "[Wife's Name]"} was unmarried/widow/divorcee.
            </p>
            <p>
              <strong>3. FAMILY BACKGROUND:</strong> That both families were present during the marriage ceremony and
              gave their full consent and blessings for our union.
            </p>
            <p>
              <strong>4. CEREMONY DETAILS:</strong> That our marriage was conducted according to traditional customs and
              all religious rituals were properly performed in the presence of relatives and friends.
            </p>
            <p>
              <strong>5. WITNESSES:</strong> That our marriage was solemnized in the presence of the following
              witnesses:
            </p>
            <div className="ml-4 space-y-1">
              <p>
                a) <strong>{formData.witnessName1 || "[Witness 1 Name]"}</strong> - Relationship: _______, Address:
                _______
              </p>
              <p>
                b) <strong>{formData.witnessName2 || "[Witness 2 Name]"}</strong> - Relationship: _______, Address:
                _______
              </p>
              <p>c) _______ - Relationship: _______, Address: _______</p>
              <p>d) _______ - Relationship: _______, Address: _______</p>
            </div>
            <p>
              <strong>6. LEGAL PURPOSE:</strong> That we are making this affidavit for the purpose of getting our
              marriage registered with the appropriate authorities and for all other legal purposes including passport,
              visa, and other official documentation.
            </p>
            <p>
              <strong>7. DECLARATION:</strong> That the contents of this affidavit are true and correct to the best of
              our knowledge and belief and nothing has been concealed therein.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-8 text-black min-h-[600px] font-serif">
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold">MARRIAGE AFFIDAVIT</h1>
      </div>
      <div className="space-y-4 text-sm">
        <p>
          I, <strong>{formData.husbandName || "[Husband's Name]"}</strong>, son of _______, aged _____ years, residing
          at {formData.husbandAddress || "[Husband's Address]"}, and I,{" "}
          <strong>{formData.wifeName || "[Wife's Name]"}</strong>, daughter of _______, aged _____ years, residing at{" "}
          {formData.wifeAddress || "[Wife's Address]"}, do hereby solemnly affirm and declare as follows:
        </p>
        <div className="space-y-3">
          <p>
            1. That we were married to each other on <strong>{formData.marriageDate || "[Marriage Date]"}</strong> at{" "}
            <strong>{formData.marriagePlace || "[Marriage Place]"}</strong> according to
            Hindu/Christian/Muslim/Buddhist rites and ceremonies.
          </p>
          <p>
            2. That at the time of our marriage, I, {formData.husbandName || "[Husband's Name]"} was
            unmarried/widower/divorcee and I, {formData.wifeName || "[Wife's Name]"} was unmarried/widow/divorcee.
          </p>
        </div>
      </div>
    </div>
  )
}
