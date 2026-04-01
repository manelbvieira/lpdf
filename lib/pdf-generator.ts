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

export async function generateQuotePDF(cartItems: CartItem[], storeName?: string, userEmail?: string) {
  try {
    console.log("[v0] Starting PDF generation...")

    if (typeof jsPDF === "undefined") {
      throw new Error("jsPDF library not loaded")
    }

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20

    // Função formatPrice com espaçamento melhorado
    const formatPrice = (price: number) => {
      return new Intl.NumberFormat("pt-PT", {
        style: "currency",
        currency: "EUR",
        currencyDisplay: "symbol",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price).replace("€", "€ ")
    }

    // Header com logo e informações - texto apenas
    // Texto do logo Doutor Finanças
    doc.setFont("helvetica", "bold")
    doc.setFontSize(16)
    doc.text("DOUTOR FINANÇAS", margin, 25)

    // Informações ao lado do logo
    doc.setFont("helvetica", "bold")
    doc.setFontSize(14)
    doc.text("ORÇAMENTO", margin + 50, 25)

    if (storeName) {
      doc.setFont("helvetica", "normal")
      doc.setFontSize(12)
      doc.text(`Loja: ${storeName}`, margin + 50, 35)
    }

    if (userEmail) {
      doc.setFont("helvetica", "normal")
      doc.setFontSize(10)
      doc.text(`Email: ${userEmail}`, margin + 50, 45) // Reduzido espaçamento
    }

    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    const now = new Date()
    doc.text(`Data: ${now.toLocaleDateString('pt-PT')} ${now.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}`, margin + 50, 40) // Ajustado posição

    // Line separator
    doc.setLineWidth(0.5)
    doc.line(margin, 55, pageWidth - margin, 55) // Reduzido posição

    // Agrupar itens por categoria
    const itemsByCategory = cartItems.reduce((acc, item) => {
      if (!acc[item.categoria]) {
        acc[item.categoria] = []
      }
      acc[item.categoria].push(item)
      return acc
    }, {} as Record<string, CartItem[]>)

    let yPosition = 65 // Reduzido posição inicial
    let grandTotal = 0

    // Iterar por categorias - espaçamento reduzido
    for (const [category, items] of Object.entries(itemsByCategory)) {
      // Verificar se precisa de nova página
      if (yPosition > 220) {
        doc.addPage()
        yPosition = 30
      }

      // Header da categoria
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text(category.toUpperCase(), margin, yPosition)
      
      yPosition += 8 // Reduzido espaçamento

      // Linha separadora da categoria
      doc.setLineWidth(0.3)
      doc.line(margin, yPosition, pageWidth - margin, yPosition)
      yPosition += 3 // Reduzido espaçamento

      // Itens da categoria - sem imagens, layout compacto
      let categoryTotal = 0
      for (const item of items) {
        if (yPosition > 250) {
          doc.addPage()
          yPosition = 30
        }

        // Nome do item
        doc.setFontSize(9)
        doc.setFont("helvetica", "medium")
        doc.text(item.nome, margin + 5, yPosition)
        
        // Categoria e fornecedor
        doc.setFontSize(7)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(150, 150, 150)
        doc.text(`${item.categoria} • ${item.fornecedor || 'N/A'}`, margin + 5, yPosition + 4)
        doc.setTextColor(0, 0, 0)
        
        // Preços no lado direito
        const itemTotal = item.preco * item.quantidade
        doc.setFontSize(8)
        doc.text(`${item.quantidade} x € ${item.preco.toFixed(2)}`, margin + 120, yPosition)
        doc.setFontSize(9)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(0, 153, 204)
        doc.text(`€ ${itemTotal.toFixed(2)}`, pageWidth - margin - 30, yPosition)
        doc.setTextColor(0, 0, 0)
        doc.setFont("helvetica", "normal")
        
        categoryTotal += itemTotal
        yPosition += 10 // Reduzido espaçamento
      }

      // Subtotal da categoria
      yPosition += 3 // Reduzido espaçamento
      doc.setLineWidth(0.5)
      doc.line(margin, yPosition, pageWidth - margin, yPosition)
      yPosition += 3 // Reduzido espaçamento

      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text(`Subtotal ${category}:`, margin, yPosition)
      doc.text(`€ ${categoryTotal.toFixed(2)}`, pageWidth - margin - 30, yPosition)
      
      grandTotal += categoryTotal
      yPosition += 10 // Reduzido espaçamento

      // Espaço entre categorias
      doc.setLineWidth(0.2)
      doc.line(margin, yPosition, pageWidth - margin, yPosition)
      yPosition += 5 // Reduzido espaçamento
    }

    // Totals finais - espaçamento reduzido
    const subtotal = grandTotal
    const vat = subtotal * 0.23
    const total = subtotal + vat

    yPosition += 8 // Reduzido espaçamento
    doc.setLineWidth(0.8)
    doc.line(margin, yPosition, pageWidth - margin, yPosition)

    yPosition += 5 // Reduzido espaçamento
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text(`Subtotal (sem IVA): € ${subtotal.toFixed(2)}`, margin, yPosition)
    yPosition += 6 // Reduzido espaçamento
    doc.text(`IVA (23%): € ${vat.toFixed(2)}`, margin, yPosition)
    yPosition += 6 // Reduzido espaçamento
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text(`TOTAL: € ${total.toFixed(2)}`, margin, yPosition)

    // Footer simplificado
    yPosition += 30
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.text("Este orçamento é indicativo e os preços podem estar desatualizados. Consulta diretamente os fornecedores ou confere os websites respectivos.", margin, yPosition)
    doc.text("Para mais informações, contacta a equipa de Facilities Experience.", margin, yPosition + 8) // Reduzido espaçamento

    const fileName = storeName 
    ? `orcamento-${storeName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`
    : `orcamento-${Date.now().toString().slice(-6)}.pdf`
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
