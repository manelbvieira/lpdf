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

    // Header com logo e informações
    try {
      console.log("[v0] Loading logo...")
      // Adicionar logo no canto superior esquerdo
      const logoResponse = await fetch('/logo-df.png')
      if (!logoResponse.ok) {
        throw new Error(`Logo fetch failed: ${logoResponse.status}`)
      }
      
      const logoBlob = await logoResponse.blob()
      const logoData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result)
          } else {
            reject(new Error('Failed to convert logo to base64'))
          }
        }
        reader.onerror = () => reject(new Error('FileReader error'))
        reader.readAsDataURL(logoBlob)
      })
      
      console.log("[v0] Logo loaded successfully, dimensions:", logoBlob.size)
      const logoWidth = 40
      const logoHeight = 20
      doc.addImage(logoData, 'PNG', margin, 15, logoWidth, logoHeight)
    } catch (error) {
      console.error("[v0] Logo loading failed:", error)
      // Fallback: texto do logo com a mesma fonte da página
      doc.setFont("helvetica", "bold")
      doc.setFontSize(16)
      doc.text("DOUTOR FINANÇAS", margin, 25)
    }

    // Informações ao lado do logo - usando a mesma fonte da página (Inter/Noto Sans)
    doc.setFont("helvetica", "bold")  // Inter/Noto Sans equivalent
    doc.setFontSize(14)
    doc.text("ORÇAMENTO", margin + 50, 25)

    if (storeName) {
      doc.setFont("helvetica", "normal")  // Inter/Noto Sans equivalent
      doc.setFontSize(12)
      doc.text(`Loja: ${storeName}`, margin + 50, 35)
    }

    if (userEmail) {
      doc.setFont("helvetica", "normal")  // Inter/Noto Sans equivalent
      doc.setFontSize(10)
      doc.text(`Email: ${userEmail}`, margin + 50, 48)
    }

    doc.setFont("helvetica", "normal")  // Inter/Noto Sans equivalent
    doc.setFontSize(10)
    const now = new Date()
    doc.text(`Data: ${now.toLocaleDateString('pt-PT')} ${now.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}`, margin + 50, 42)

    // Line separator - ajustado para acomodar email
    doc.setLineWidth(0.5)
    doc.line(margin, 60, pageWidth - margin, 60)

    // Agrupar itens por categoria
    const itemsByCategory = cartItems.reduce((acc, item) => {
      if (!acc[item.categoria]) {
        acc[item.categoria] = []
      }
      acc[item.categoria].push(item)
      return acc
    }, {} as Record<string, CartItem[]>)

    let yPosition = 75
    let grandTotal = 0

    // Iterar por categorias
    for (const [category, items] of Object.entries(itemsByCategory)) {
      // Verificar se precisa de nova página
      if (yPosition > 220) {
        doc.addPage()
        yPosition = 30
      }

      // Header da categoria
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text(category.toUpperCase(), margin, yPosition)
      
      yPosition += 10

      // Linha separadora da categoria
      doc.setLineWidth(0.3)
      doc.line(margin, yPosition, pageWidth - margin, yPosition)
      yPosition += 5

      // Itens da categoria
      let categoryTotal = 0
      items.forEach((item) => {
        if (yPosition > 250) {
          doc.addPage()
          yPosition = 30
        }

        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        doc.text(item.nome, margin + 5, yPosition)
        
        const itemTotal = item.preco * item.quantidade
        doc.text(`${item.quantidade} x €${item.preco.toFixed(2)}`, margin + 80, yPosition)
        doc.text(`€${itemTotal.toFixed(2)}`, pageWidth - margin - 30, yPosition)
        
        categoryTotal += itemTotal
        yPosition += 8
      })

      // Subtotal da categoria
      yPosition += 5
      doc.setLineWidth(0.5)
      doc.line(margin, yPosition, pageWidth - margin, yPosition)
      yPosition += 5

      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text(`Subtotal ${category}:`, margin, yPosition)
      doc.text(`€${categoryTotal.toFixed(2)}`, pageWidth - margin - 30, yPosition)
      
      grandTotal += categoryTotal
      yPosition += 15

      // Espaço entre categorias
      doc.setLineWidth(0.2)
      doc.line(margin, yPosition, pageWidth - margin, yPosition)
      yPosition += 10
    }

    // Totals finais
    const subtotal = grandTotal
    const vat = subtotal * 0.23
    const total = subtotal + vat

    yPosition += 10
    doc.setLineWidth(0.8)
    doc.line(margin, yPosition, pageWidth - margin, yPosition)

    yPosition += 10
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text(`Subtotal (sem IVA): €${subtotal.toFixed(2)}`, margin, yPosition)
    yPosition += 8
    doc.text(`IVA (23%): €${vat.toFixed(2)}`, margin, yPosition)
    yPosition += 8
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text(`TOTAL: €${total.toFixed(2)}`, margin, yPosition)

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
