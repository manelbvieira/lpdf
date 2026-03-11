"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, FileText, Trash2 } from "lucide-react"
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
  { id: 'estrutura', name: 'Estrutura', icon: '' },
  { id: 'superficies', name: 'Superfícies', icon: '' },
  { id: 'acabamentos', name: 'Acabamentos', icon: '' }
]

export function Calculator({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [items, setItems] = useState<CalculatorItem[]>([
    { id: "demolição", name: "Demolição", unitCost: 200.00, quantity: 0, unit: "un", category: "estrutura" },
    { id: "pladur teto", name: "Pladur Teto", unitCost: 28.00, quantity: 0, unit: "m²", category: "estrutura" },
    { id: "pladur parede", name: "Pladur Parede", unitCost: 19.00, quantity: 0, unit: "m²", category: "estrutura" },
    { id: "vidro", name: "Vidro", unitCost: 175.00, quantity: 0, unit: "m²", category: "estrutura" },
    { id: "pintura", name: "Pintura", unitCost: 13.00, quantity: 0, unit: "m²", category: "acabamentos" },
    { id: "pavimento", name: "Pavimento", unitCost: 27.50, quantity: 0, unit: "m²", category: "superficies" },
    { id: "vinil montra", name: "Vinil Montra", unitCost: 70.00, quantity: 0, unit: "m²", category: "acabamentos" },
    { id: "vinil fosco", name: "Vinil Fosco", unitCost: 60.00, quantity: 0, unit: "m²", category: "acabamentos" },
    { id: "vinil biombo", name: "Vinil Biombo", unitCost: 360.00, quantity: 0, unit: "un", category: "acabamentos" },
    { id: "vinil horário", name: "Vinil Horário", unitCost: 25.00, quantity: 0, unit: "un", category: "acabamentos" },
    { id: "reclamo", name: "Reclamo", unitCost: 300.00, quantity: 0, unit: "m/l", category: "acabamentos" }
  ])

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

  const handleExportPDF = async () => {
    try {
      const pdfItems: PDFCalculatorItem[] = items.filter(item => item.quantity > 0).map(item => ({
        id: item.id,
        name: item.name,
        unitCost: item.unitCost,
        quantity: item.quantity,
        unit: item.unit
      }))
      
      if (pdfItems.length === 0) {
        alert("Adiciona quantidades aos itens antes de exportar.")
        return
      }

      const success = await generateCalculatorPDF(pdfItems)
      if (success) {
        console.log("[v0] Calculator PDF exported successfully")
      }
    } catch (error) {
      console.error("[v0] Error generating Calculator PDF:", error)
      alert("Erro ao gerar PDF. Verifica se o teu navegador permite downloads automáticos e tenta novamente.")
    }
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
    </div>
  )
}
