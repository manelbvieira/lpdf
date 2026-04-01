"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, FileText, Trash2, Mail, Store } from "lucide-react"
import { generateCalculatorPDF, type CalculatorItem as PDFCalculatorItem } from "@/lib/pdf-generator"

interface CalculatorItem {
  id: string
  name: string
  unitCost: number
  quantity: number
  unit: string
  category: string
}

interface Category {
  id: string
  name: string
  icon: string
}

const categories: Category[] = [
  { id: 'estrutura', name: 'Estruturas', icon: '' },
  { id: 'superficies', name: 'Superfícies', icon: '' },
  { id: 'publicidade', name: 'Publicidade', icon: '' }
]

export function Calculator({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [items, setItems] = useState<CalculatorItem[]>([
    { id: "demolição", name: "Demolição", unitCost: 100.00, quantity: 0, unit: "un", category: "estrutura" },
    { id: "eletricidade", name: "Eletricidade", unitCost: 100.00, quantity: 0, unit: "m²", category: "estrutura" },
    { id: "pladur teto", name: "Pladur Teto", unitCost: 28.00, quantity: 0, unit: "m²", category: "estrutura" },
    { id: "pladur parede", name: "Pladur Parede", unitCost: 19.00, quantity: 0, unit: "m²", category: "estrutura" },
    { id: "vidro", name: "Vidro", unitCost: 175.00, quantity: 0, unit: "m²", category: "estrutura" },
    { id: "pintura", name: "Pintura", unitCost: 13.00, quantity: 0, unit: "m²", category: "superficies" },
    { id: "pavimento", name: "Pavimento", unitCost: 27.50, quantity: 0, unit: "m²", category: "superficies" },
    { id: "vinil montra", name: "Vinil Montra", unitCost: 70.00, quantity: 0, unit: "m²", category: "publicidade" },
    { id: "vinil fosco", name: "Vinil Fosco", unitCost: 60.00, quantity: 0, unit: "m²", category: "publicidade" },
    { id: "vinil biombo", name: "Vinil Biombo", unitCost: 360.00, quantity: 0, unit: "un", category: "publicidade" },
    { id: "vinil horário", name: "Vinil Horário", unitCost: 25.00, quantity: 0, unit: "un", category: "publicidade" },
    { id: "reclamo", name: "Reclamo", unitCost: 300.00, quantity: 0, unit: "m/l", category: "publicidade" }
  ])

  // Estado para a modal de exportação PDF
  const [showPDFModal, setShowPDFModal] = useState(false)
  const [exportEmail, setExportEmail] = useState("")
  const [storeName, setStoreName] = useState("")
  const [isExporting, setIsExporting] = useState(false)

  const updateQuantity = (id: string, quantity: number) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
    ))
  }

  const getCategorySubtotal = (categoryId: string) => {
    return items
      .filter(item => item.category === categoryId)
      .reduce((total, item) => total + (item.unitCost * item.quantity), 0)
  }

  const getCategoryPercentage = (categoryId: string) => {
    const categoryTotal = getCategorySubtotal(categoryId)
    const overallTotal = getSubtotal()
    return overallTotal > 0 ? (categoryTotal / overallTotal) * 100 : 0
  }

  const getItemsByCategory = (categoryId: string) => {
    return items.filter(item => item.category === categoryId)
  }

  const handleInputChange = (id: string, value: string) => {
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      updateQuantity(id, numValue)
    } else if (value === '' || value === '0') {
      updateQuantity(id, 0)
    }
  }

  const getTotalCost = () => {
    return items.reduce((total, item) => total + (item.unitCost * item.quantity), 0)
  }

  const getSubtotal = () => {
    return getTotalCost()
  }

  const getVATAmount = () => {
    return getSubtotal() * 0.23
  }

  const getTotalWithVAT = () => {
    return getSubtotal() + getVATAmount()
  }

  const clearCalculator = () => {
    setItems(prev => prev.map(item => ({ ...item, quantity: 0 })))
  }

  const handleExportPDF = () => {
    const pdfItems = items.filter(item => item.quantity > 0)
    
    if (pdfItems.length === 0) {
      alert("Adiciona quantidades aos itens antes de exportar.")
      return
    }

    // Abrir a modal para preencher email e nome da loja
    setShowPDFModal(true)
  }

  const handlePDFExport = async () => {
    if (!exportEmail || !storeName) {
      alert("Por favor, preencha todos os campos.")
      return
    }

    setIsExporting(true)
    
    try {
      const pdfItems: PDFCalculatorItem[] = items.filter(item => item.quantity > 0).map(item => ({
        id: item.id,
        name: item.name,
        unitCost: item.unitCost,
        quantity: item.quantity,
        unit: item.unit
      }))

      // Gerar PDF com os dados adicionais
      const success = await generateCalculatorPDF(pdfItems)

      if (success) {
        // Enviar cópia para manuel.vieira@doutorfinancas.pt
        await sendPDFCopy(exportEmail, storeName, pdfItems)
        
        console.log("[v0] Calculator PDF exported successfully")
        alert("PDF gerado e enviado com sucesso!")
        
        // Limpar campos e fechar modal
        setExportEmail("")
        setStoreName("")
        setShowPDFModal(false)
      }
    } catch (error) {
      console.error("[v0] Error generating Calculator PDF:", error)
      alert("Erro ao gerar PDF. Tenta novamente.")
    } finally {
      setIsExporting(false)
    }
  }

  const sendPDFCopy = async (email: string, storeName: string, items: PDFCalculatorItem[]) => {
    // Simular envio de email (em produção, isto seria uma API call)
    const emailData = {
      to: "manuel.vieira@doutorfinancas.pt",
      subject: `Novo Orçamento - ${storeName}`,
      body: `
        Novo orçamento gerado:
        
        Loja: ${storeName}
        Email do criador: ${email}
        Data: ${new Date().toLocaleDateString('pt-PT')}
        
        Itens:
        ${items.map(item => `${item.name}: ${item.quantity} ${item.unit} x €${item.unitCost} = €${(item.unitCost * item.quantity).toFixed(2)}`).join('\n')}
        
        Total: €${items.reduce((total, item) => total + (item.unitCost * item.quantity), 0).toFixed(2)}
      `
    }

    // Simular envio (log para desenvolvimento)
    console.log("[v0] Email data to send:", emailData)
    
    // Em produção, aqui faria uma chamada API para enviar o email
    // await fetch('/api/send-pdf', { method: 'POST', body: JSON.stringify(emailData) })
  }

  const getTotalCostPerItem = (item: CalculatorItem) => {
    return item.unitCost * item.quantity
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-end z-50">
      <Card className="w-full max-w-md h-full rounded-none border-l border-border/40 shadow-none rounded-xl">
        {/* Header */}
        <CardHeader className="border-b border-border/40">
          <div className="flex items-center justify-between">
            <p className="text-[10px] tracking-widest uppercase text-muted-foreground">Calculadora</p>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            {/* Categories */}
            {categories.map((category) => {
              const categoryItems = getItemsByCategory(category.id)
              const categorySubtotal = getCategorySubtotal(category.id)
              
              return (
                <Card key={category.id} className="border border-border/20 shadow-lg shadow-black/15 rounded-xl">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-sm font-medium text-foreground">
                          {category.name}
                        </CardTitle>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[#0099CC]">
                          {categorySubtotal.toFixed(2)}€
                        </p>
                        <p className="text-xs text-muted-foreground">Subtotal</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {categoryItems.map((item) => (
                        <div key={item.id} className="p-3 border border-border/10 rounded-xl bg-muted/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-sm text-foreground">{item.name}</h4>
                              <p className="text-xs text-muted-foreground mb-2">
                                {item.unitCost.toFixed(2)}€ / {item.unit}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="font-semibold text-foreground">
                                  {getTotalCostPerItem(item).toFixed(2)}€
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {item.quantity} {item.unit}
                                </p>
                              </div>
                              <div className="w-20">
                                <Input
                                  type="number"
                                  value={item.quantity || ''}
                                  onChange={(e) => handleInputChange(item.id, e.target.value)}
                                  placeholder="0"
                                  className="text-center text-sm"
                                  min="0"
                                  step="0.01"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>

        {/* Footer */}
        <div className="border-t border-border/20 p-4 bg-muted/30">
          {/* Totals */}
          <div className="space-y-4 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal (sem IVA):</span>
              <span className="text-foreground">{getSubtotal().toFixed(2)}€</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">IVA (23%):</span>
              <span className="text-foreground">{getVATAmount().toFixed(2)}€</span>
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <span className="text-foreground">Total (com IVA):</span>
              <span className="text-xl font-bold text-[#0099CC]">{getTotalWithVAT().toFixed(2)}€</span>
            </div>
          </div>

          {/* Category Distribution Chart */}
          {getSubtotal() > 0 && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-muted-foreground">Distribuição por Categoria</span>
                <span className="text-xs text-muted-foreground">100%</span>
              </div>
              <div className="w-full h-8 bg-border/20 overflow-hidden flex">
                {categories.map((category) => {
                  const percentage = getCategoryPercentage(category.id)
                  if (percentage === 0) return null
                  
                  const categoryColors = {
                    estrutura: 'bg-blue-900',      // Azul Petróleo
                    superficies: 'bg-gray-600',     // Cinza Quente
                    acabamentos: 'bg-amber-700'      // Beige/Marrom
                  }
                  
                  return (
                    <div
                      key={category.id}
                      className={`h-full transition-all duration-500 ease-out ${categoryColors[category.id as keyof typeof categoryColors] || 'bg-gray-500'}`}
                      style={{ width: `${percentage}%` }}
                      title={`${category.name}: ${percentage.toFixed(1)}%`}
                    />
                  )
                })}
              </div>
              <div className="flex justify-between mt-2">
                {categories.map((category) => {
                  const percentage = getCategoryPercentage(category.id)
                  if (percentage === 0) return null
                  
                  const categoryColors = {
                    estrutura: 'bg-blue-900',      // Azul Petróleo
                    superficies: 'bg-gray-600',     // Cinza Quente
                    acabamentos: 'bg-amber-700'      // Beige/Marrom
                  }
                  
                  return (
                    <div key={category.id} className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${categoryColors[category.id as keyof typeof categoryColors] || 'bg-gray-500'}`} />
                      <span className="text-xs text-muted-foreground">
                        {category.name} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              onClick={handleExportPDF}
              className="w-full h-11 rounded-none bg-[#0099CC] hover:bg-[#007aa3] text-white text-xs tracking-widest uppercase"
              size="lg"
            >
              <FileText className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
            <button
              type="button"
              onClick={clearCalculator}
              className="w-full h-9 text-[10px] tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Limpar calculadora
            </button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Os custos não incluem IVA e são estimativas que podem variar consoante a localização, o fornecedor e a complexidade dos trabalhos.
          </p>
        </div>
      </Card>

      {/* Modal de Exportação PDF */}
      {showPDFModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">Exportar Orçamento</h3>
              <button
                onClick={() => setShowPDFModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email do criador
                </label>
                <Input
                  type="email"
                  value={exportEmail}
                  onChange={(e) => setExportEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Store className="w-4 h-4 inline mr-2" />
                  Nome da loja
                </label>
                <Input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Nome da loja"
                  className="w-full"
                />
              </div>

              <div className="pt-4">
                <Button
                  onClick={handlePDFExport}
                  disabled={isExporting || !exportEmail || !storeName}
                  className="w-full h-11 rounded-none bg-[#0099CC] hover:bg-[#007aa3] text-white text-xs tracking-widest uppercase"
                >
                  {isExporting ? "A gerar..." : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Gerar PDF e Enviar
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                O PDF será gerado e enviado para a equipa de Facilities Experience
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
