import { PDFDocument, rgb } from 'pdf-lib'
import fs from 'fs'

export async function generateCertificate(
  menteeName: string,
  sourcePdfPath: string,
  outputPath: string
): Promise<string> {
  try {
    const existingPdfBytes = fs.readFileSync(sourcePdfPath)
    const pdfDoc = await PDFDocument.load(existingPdfBytes)
    const page = pdfDoc.getPage(0)
    const fontSize = 24
    const datezFontSize = 18

    page.drawText(menteeName, {
      x: 66,
      y: page.getHeight() - 220,
      size: fontSize,
      color: rgb(0, 0, 0)
    })

    const issueDate = new Date().toLocaleDateString()

    page.drawText(issueDate, {
      x: 160,
      y: page.getHeight() - 476,
      size: datezFontSize,
      color: rgb(0, 0, 0)
    })

    const pdfBytes = await pdfDoc.save()

    fs.writeFileSync(outputPath, pdfBytes)
    return outputPath
  } catch (error) {
    console.error('Failed to modify the PDF:', error)
    throw error
  }
}
