// lib/invoice-pdf.ts
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import fs from 'fs'

type InvoiceData = {
  invoiceNumber: string
  customerEmail: string
  eventName: string
  plan: string
  amountCHF: number
  date: Date
}

export async function generateInvoicePdf(
  data: InvoiceData
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create()
  const page = pdf.addPage([595, 842]) // A4
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)

  const draw = (text: string, x: number, y: number, size = 10, b = false) =>
    page.drawText(text, {
      x,
      y,
      size,
      font: b ? bold : font,
      color: rgb(0, 0, 0),
    })

  // LOGO
  const logoBytes = fs.readFileSync('public/EdelByte_Logo_Light_Rect.png')
  const logo = await pdf.embedPng(logoBytes)
  page.drawImage(logo, { x: 50, y: 770, width: 180, height: 40 })

  // HEADER
  draw('Rechnung', 400, 780, 16, true)

  draw(`Rechnungsnummer: ${data.invoiceNumber}`, 400, 750)
  draw(`Datum: ${data.date.toLocaleDateString('de-CH')}`, 400, 735)

  // FIRMA
  draw('EdelByte – IT mit Leidenschaft', 50, 720, 11, true)
  draw('Endrit Veliji', 50, 705)
  draw('Schweiz', 50, 690)
  draw('CHE-123.456.789', 50, 675)

  // KUNDE
  draw('Rechnung an:', 50, 645, 11, true)
  draw(data.customerEmail, 50, 630)

  // LEISTUNG
  draw('Leistung', 50, 580, 11, true)
  draw(`EventShot – ${data.plan}`, 50, 560)
  draw(`Event: ${data.eventName}`, 50, 545)

  draw(`CHF ${data.amountCHF.toFixed(2)}`, 450, 545, 11, true)

  // FOOTER
  draw('Zahlungsstatus: Bezahlt', 50, 150)
  draw(`Zahlungseingang: ${data.date.toLocaleDateString('de-CH')}`, 50, 135)
  draw('Zahlungsart: Stripe', 50, 120)

  draw('Nicht MwSt-pflichtig gemäss Art. 10 MWSTG', 50, 95)
  draw('Keine Zahlung mehr erforderlich.', 50, 80)

  return pdf.save()
}
