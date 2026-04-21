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
    // Ensure the element is visible and properly rendered
    if (!element || !element.offsetParent) {
      throw new Error("Element is not visible or not found")
    }

    // Wait for any images to load
    const images = element.querySelectorAll("img")
    await Promise.all(
      Array.from(images).map((img) => {
        if (img.complete) return Promise.resolve()
        return new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = resolve // Don't fail on image errors
          setTimeout(resolve, 3000) // Timeout after 3 seconds
        })
      }),
    )

    // Create canvas with improved options
    const canvas = await html2canvas(element, {
      scale: quality,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
      width: element.scrollWidth,
      height: element.scrollHeight,
      logging: false,
      removeContainer: true,
      foreignObjectRendering: false,
      imageTimeout: 5000,
      onclone: (clonedDoc, clonedElement) => {
        // Ensure all styles are properly applied in the cloned document
        const clonedBody = clonedDoc.body
        clonedBody.style.fontFamily = "Arial, sans-serif"
        clonedBody.style.fontSize = "12px"
        clonedBody.style.lineHeight = "1.6"
        clonedBody.style.color = "black"
        clonedBody.style.backgroundColor = "white"

        // Fix any potential styling issues
        const allElements = clonedElement.querySelectorAll("*")
        allElements.forEach((el: any) => {
          // Ensure text is visible
          if (el.style) {
            el.style.webkitPrintColorAdjust = "exact"
            el.style.printColorAdjust = "exact"
          }
        })

        // Handle rich text content
        const richTextElements = clonedElement.querySelectorAll("[dangerouslySetInnerHTML]")
        richTextElements.forEach((el: any) => {
          if (el.style) {
            el.style.lineHeight = "1.6"
            el.style.wordWrap = "break-word"
          }
        })
      },
    })

    // Validate canvas
    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error("Failed to create canvas from element")
    }

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

    // Convert canvas to image data
    const imgData = canvas.toDataURL("image/png", 1.0)

    // Add first page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST")
    heightLeft -= pageHeight

    // Add additional pages if content is longer than one page
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST")
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
