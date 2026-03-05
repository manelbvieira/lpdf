"use client"

import jsPDF from "jspdf"
import type { CartItem } from "./furniture-data"

export async function generateQuotePDF(cartItems: CartItem[]) {
  try {
    console.log("[v0] Starting PDF generation...")

    if (typeof jsPDF === "undefined") {
      throw new Error("jsPDF library not loaded")
    }

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width
    const margin = 20

    // Header
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("Orçamento - Mobiliário Doutor Finanças", margin, 30)

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(`Data: ${new Date().toLocaleDateString("pt-PT")}`, margin, 45)
    doc.text(`Orçamento #${Date.now().toString().slice(-6)}`, margin, 55)

    // Line separator
    doc.setLineWidth(0.5)
    doc.line(margin, 65, pageWidth - margin, 65)

    // Table headers
    let yPosition = 85
    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.text("Item", margin, yPosition)
    doc.text("Categoria", margin + 60, yPosition)
    doc.text("Qtd", margin + 110, yPosition)
    doc.text("Preço Unit.", margin + 130, yPosition)
    doc.text("Subtotal", margin + 160, yPosition)

    // Line under headers
    doc.line(margin, yPosition + 5, pageWidth - margin, yPosition + 5)

    // Table content
    yPosition += 15
    doc.setFont("helvetica", "normal")

    let subtotalWithoutVAT = 0

    cartItems.forEach((item) => {
      const itemSubtotal = item.preco * item.quantidade
      subtotalWithoutVAT += itemSubtotal

      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 30
      }

      doc.text(item.nome.substring(0, 25), margin, yPosition)
      doc.text(item.categoria, margin + 60, yPosition)
      doc.text(item.quantidade.toString(), margin + 110, yPosition)
      doc.text(`€${item.preco.toFixed(2)}`, margin + 130, yPosition)
      doc.text(`€${itemSubtotal.toFixed(2)}`, margin + 160, yPosition)

      yPosition += 10
    })

    // Summary
    yPosition += 10
    doc.line(margin, yPosition, pageWidth - margin, yPosition)
    yPosition += 15

    const vatAmount = subtotalWithoutVAT * 0.23 // Add 23% VAT
    const totalWithVAT = subtotalWithoutVAT + vatAmount

    doc.setFont("helvetica", "normal")
    doc.text("Subtotal (sem IVA):", margin + 100, yPosition)
    doc.text(`€${subtotalWithoutVAT.toFixed(2)}`, margin + 160, yPosition)

    yPosition += 10
    doc.text("IVA (23%):", margin + 100, yPosition)
    doc.text(`€${vatAmount.toFixed(2)}`, margin + 160, yPosition)

    yPosition += 10
    doc.setFont("helvetica", "bold")
    doc.text("Total (com IVA):", margin + 100, yPosition)
    doc.text(`€${totalWithVAT.toFixed(2)}`, margin + 160, yPosition)

    // Footer
    yPosition += 30
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.text("Este orçamento é indicativo e os preços podem estar desatualizados. Consulta diretamente os fornecedores ou confere os websites respectivos.", margin, yPosition)
    doc.text("Para mais informações, contacta a equipa de Facilities Experience.", margin, yPosition + 10)

    // Company info
    doc.text("Rede Doutor Finanças", margin, yPosition + 25)
    doc.text("Email: facilities.experience@doutorfinancas.pt", margin, yPosition + 35)
    doc.text("Telefone: +351 123 456 789", margin, yPosition + 45)

    const fileName = `orcamento-${Date.now().toString().slice(-6)}.pdf`
    console.log("[v0] Saving PDF as:", fileName)

    // Try different methods for better browser compatibility
    try {
      doc.save(fileName)
    } catch (saveError) {
      console.warn("[v0] Standard save failed, trying alternative method:", saveError)
      // Alternative method using blob
      const pdfBlob = doc.output("blob")
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }

    console.log("[v0] PDF generation completed successfully")
    return true
  } catch (error) {
    console.error("[v0] Error in PDF generation:", error)
    throw error
  }
}
