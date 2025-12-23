import { PDFDocument, StandardFonts } from 'pdf-lib'

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

  const draw = (text: string, y: number, size = 11) => {
    page.drawText(text, { x: 50, y, size, font })
  }

  draw('EdelByte – IT mit Leidenschaft', 780, 18)
  draw('Rechnung', 750, 14)

  draw(`Rechnungsnummer: ${data.invoiceNumber}`, 710)
  draw(`Datum: ${data.date.toLocaleDateString('de-CH')}`, 690)

  draw(`Kunde: ${data.customerEmail}`, 650)
  draw(`Event: ${data.eventName}`, 630)
  draw(`Plan: ${data.plan}`, 610)

  draw('---------------------------------------------', 580)

  draw(`Betrag: CHF ${data.amountCHF.toFixed(2)}`, 550, 14)

  draw('Vielen Dank für Ihr Vertrauen.', 500)

  return pdf.save()
}
