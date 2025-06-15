import jsPDF from "jspdf"
import html2canvas from "html2canvas"

export interface PdfGenerationOptions {
  filename?: string
  format?: "a4" | "letter"
  orientation?: "portrait" | "landscape"
  quality?: number
}

// Function to convert HTML content to plain text for PDF generation
function htmlToPlainText(html: string): string {
  const temp = document.createElement("div")
  temp.innerHTML = html

  // Replace common HTML elements with text equivalents
  temp.innerHTML = temp.innerHTML
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<li>/gi, "• ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<strong>|<b>/gi, "")
    .replace(/<\/strong>|<\/b>/gi, "")
    .replace(/<em>|<i>/gi, "")
    .replace(/<\/em>|<\/i>/gi, "")
    .replace(/<u>/gi, "")
    .replace(/<\/u>/gi, "")

  return temp.textContent || temp.innerText || ""
}

export async function generatePdfFromElement(element: HTMLElement, options: PdfGenerationOptions = {}): Promise<void> {
  const { filename = "document.pdf", format = "a4", orientation = "portrait", quality = 1 } = options

  try {
    // Create a clone of the element to avoid modifying the original
    const clonedElement = element.cloneNode(true) as HTMLElement

    // Convert any rich text content to properly formatted HTML for PDF
    const richTextElements = clonedElement.querySelectorAll("[dangerouslySetInnerHTML]")
    richTextElements.forEach((el) => {
      // Ensure proper styling for PDF generation
      el.setAttribute("style", (el.getAttribute("style") || "") + "; line-height: 1.6; word-wrap: break-word;")
    })

    // Create canvas from HTML element
    const canvas = await html2canvas(clonedElement, {
      scale: quality,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      width: clonedElement.scrollWidth,
      height: clonedElement.scrollHeight,
      onclone: (clonedDoc) => {
        // Ensure all styles are properly applied in the cloned document
        const clonedBody = clonedDoc.body
        clonedBody.style.fontFamily = "Arial, sans-serif"
        clonedBody.style.fontSize = "12px"
        clonedBody.style.lineHeight = "1.6"
        clonedBody.style.color = "black"
        clonedBody.style.backgroundColor = "white"
      },
    })

    // Get canvas dimensions
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 295 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    // Create PDF
    const pdf = new jsPDF({
      orientation,
      unit: "mm",
      format,
    })

    let position = 0

    // Add first page
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // Add additional pages if content is longer than one page
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // Save the PDF
    pdf.save(filename)
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw new Error("Failed to generate PDF")
  }
}

export function generatePdfFromHtml(htmlContent: string, options: PdfGenerationOptions = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    // Create a temporary container
    const container = document.createElement("div")
    container.innerHTML = htmlContent
    container.style.position = "absolute"
    container.style.left = "-9999px"
    container.style.top = "-9999px"
    container.style.width = "210mm" // A4 width
    container.style.backgroundColor = "white"
    container.style.padding = "20mm"
    container.style.fontFamily = "Arial, sans-serif"
    container.style.fontSize = "12px"
    container.style.lineHeight = "1.6"
    container.style.color = "black"

    // Add to document
    document.body.appendChild(container)

    // Generate PDF
    generatePdfFromElement(container, options)
      .then(() => {
        // Clean up
        document.body.removeChild(container)
        resolve()
      })
      .catch((error) => {
        // Clean up
        document.body.removeChild(container)
        reject(error)
      })
  })
}
