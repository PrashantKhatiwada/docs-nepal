import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx"

interface DocxOptions {
  filename?: string
}

function looksLikeMainHeading(line: string): boolean {
  if (!line) return false
  if (line.length > 70) return false
  const upper = line.toUpperCase()
  const isAllUpper = upper === line && /[A-Z]/.test(line)
  const hasNepaliChars = /[\u0900-\u097F]/.test(line)
  return isAllUpper || hasNepaliChars
}

function looksLikeSubHeading(line: string): boolean {
  if (!line) return false
  return line.endsWith(":") || /^(Subject|विषय|To,|श्रीमान्)/i.test(line)
}

function toParagraphsFromElement(element: HTMLElement): Paragraph[] {
  const text = element.innerText || ""
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line, index, arr) => line.length > 0 || (index > 0 && arr[index - 1].length > 0)) // keep single blank separators

  if (!lines.length) {
    return [new Paragraph({ children: [new TextRun(" ")] })]
  }

  const firstNonEmpty = lines.findIndex((line) => line.length > 0)

  return lines.map((line, idx) => {
    if (!line) {
      return new Paragraph({
        children: [new TextRun("")],
        spacing: { after: 140 },
      })
    }

    if (idx === firstNonEmpty && looksLikeMainHeading(line)) {
      return new Paragraph({
        children: [new TextRun({ text: line, bold: true })],
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 220 },
      })
    }

    if (looksLikeSubHeading(line)) {
      return new Paragraph({
        children: [new TextRun({ text: line, bold: true })],
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 160 },
      })
    }

    const numberedClause = /^\d+[\.\)]\s/.test(line)
    const signatureLine = /signature|हस्ताक्षर|deponent|भवदीय|धन्यवाद/i.test(line)

    return new Paragraph({
      children: [
        new TextRun({
          text: line,
          bold: numberedClause || signatureLine,
        }),
      ],
      spacing: { after: numberedClause ? 180 : 120 },
    })
  })
}

export async function generateDocxFromElement(element: HTMLElement, options: DocxOptions = {}) {
  const paragraphs = toParagraphsFromElement(element)

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  const filename = options.filename || `document_${Date.now()}.docx`

  const url = URL.createObjectURL(blob)
  const link = window.document.createElement("a")
  link.href = url
  link.download = filename
  window.document.body.appendChild(link)
  link.click()
  window.document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
