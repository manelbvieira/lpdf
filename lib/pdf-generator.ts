"use client"

import jsPDF from "jspdf"
import type { CartItem } from "./furniture-data"

export interface CalculatorItem {
  id: string
  name: string
  unitCost: number
  quantity: number
  unit: string
}

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

    // Items
    let yPosition = 80
    cartItems.forEach((item, index) => {
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 30
      }

      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text(item.nome, margin, yPosition)

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.text(`${item.quantidade} x ${item.preco.toFixed(2)}€ = ${(item.quantidade * item.preco).toFixed(2)}€`, margin, yPosition + 8)
      
      yPosition += 20
    })

    // Totals
    const subtotal = cartItems.reduce((total, item) => total + (item.preco * item.quantidade), 0)
    const vat = subtotal * 0.23
    const total = subtotal + vat

    yPosition += 10
    doc.setLineWidth(0.5)
    doc.line(margin, yPosition, pageWidth - margin, yPosition)

    yPosition += 10
    doc.setFontSize(12)
    doc.text(`Subtotal (sem IVA): ${subtotal.toFixed(2)}€`, margin, yPosition)
    yPosition += 8
    doc.text(`IVA (23%): ${vat.toFixed(2)}€`, margin, yPosition)
    yPosition += 8
    doc.setFont("helvetica", "bold")
    doc.text(`Total (com IVA): ${total.toFixed(2)}€`, margin, yPosition)

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

export async function generateCalculatorPDF(calculatorItems: CalculatorItem[]) {
  try {
    console.log("[v0] Starting Calculator PDF generation...")

    if (typeof jsPDF === "undefined") {
      throw new Error("jsPDF library not loaded")
    }

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width
    const margin = 20

    // Header
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("Calculadora de Custos - Doutor Finanças", margin, 30)

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(`Data: ${new Date().toLocaleDateString("pt-PT")}`, margin, 45)
    doc.text(`Cálculo #${Date.now().toString().slice(-6)}`, margin, 55)

    // Line separator
    doc.setLineWidth(0.5)
    doc.line(margin, 65, pageWidth - margin, 65)

    // Items
    let yPosition = 80
    calculatorItems.forEach((item, index) => {
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 30
      }

      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text(item.name, margin, yPosition)

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.text(`${item.quantity} ${item.unit} x ${item.unitCost.toFixed(2)}€ = ${(item.unitCost * item.quantity).toFixed(2)}€`, margin, yPosition + 8)
      
      yPosition += 20
    })

    // Totals
    const subtotal = calculatorItems.reduce((total, item) => total + (item.unitCost * item.quantity), 0)
    const vat = subtotal * 0.23
    const total = subtotal + vat

    yPosition += 10
    doc.setLineWidth(0.5)
    doc.line(margin, yPosition, pageWidth - margin, yPosition)

    yPosition += 10
    doc.setFontSize(12)
    doc.text(`Subtotal (sem IVA): ${subtotal.toFixed(2)}€`, margin, yPosition)
    yPosition += 8
    doc.text(`IVA (23%): ${vat.toFixed(2)}€`, margin, yPosition)
    yPosition += 8
    doc.setFont("helvetica", "bold")
    doc.text(`Total (com IVA): ${total.toFixed(2)}€`, margin, yPosition)

    // Notes
    yPosition += 15
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.text("Os custos não incluem IVA e são estimativas que podem variar consoante a localização, o fornecedor e a complexidade dos trabalhos.", margin, yPosition)

    // Company info
    yPosition += 15
    doc.text("Rede Doutor Finanças", margin, yPosition)
    doc.text("Email: facilities.experience@doutorfinancas.pt", margin, yPosition + 10)

    const fileName = `calculadora-custos-${Date.now().toString().slice(-6)}.pdf`
    console.log("[v0] Saving Calculator PDF as:", fileName)

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

    console.log("[v0] Calculator PDF generation completed successfully")
    return true
  } catch (error) {
    console.error("[v0] Error in Calculator PDF generation:", error)
    throw error
  }
}
