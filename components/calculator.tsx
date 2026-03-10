"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, FileText, Trash2 } from "lucide-react"

interface CalculatorItem {
  id: string
  name: string
  unitCost: number
  quantity: number
  unit: string
}

export function Calculator({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [items, setItems] = useState<CalculatorItem[]>([
    { id: "demolição", name: "Demolição", unitCost: 200.00, quantity: 0, unit: "un" },
    { id: "pladur teto", name: "Pladur Teto", unitCost: 28.00, quantity: 0, unit: "m²" },
    { id: "pladur parede", name: "Pladur Parede", unitCost: 19.00, quantity: 0, unit: "m²" },
    { id: "vidro", name: "Vidro", unitCost: 175.00, quantity: 0, unit: "m²" },
    { id: "pintura", name: "Pintura", unitCost: 13.00, quantity: 0, unit: "m²" },
    { id: "pavimento", name: "Pavimento", unitCost: 27.50, quantity: 0, unit: "m²" },
    { id: "vinil montra", name: "Vinil Montra", unitCost: 70.00, quantity: 0, unit: "m²" },
    { id: "vinil fosco", name: "Vinil Fosco", unitCost: 60.00, quantity: 0, unit: "m²" },
    { id: "vinil biombo", name: "Vinil Biombo", unitCost: 360.00, quantity: 0, unit: "un" },
    { id: "vinil horário", name: "Vinil Horário", unitCost: 25.00, quantity: 0, unit: "un" },
    { id: "reclamo", name: "Reclamo", unitCost: 300.00, quantity: 0, unit: "m/l" }
  ])

  const updateQuantity = (id: string, quantity: number) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
    ))
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
    alert("Funcionalidade de exportação PDF em desenvolvimento")
  }

  const getTotalCostPerItem = (item: CalculatorItem) => {
    return item.unitCost * item.quantity
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-end z-50">
      <Card className="w-full max-w-md h-full rounded-none border-l border-border/40 shadow-none">
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
            {/* Items List */}
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="p-4 border border-border/20 rounded-lg">
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
                      <div className="w-24">
                        <Input
                          type="number"
                          value={item.quantity || ''}
                          onChange={(e) => handleInputChange(item.id, e.target.value)}
                          placeholder="0"
                          className="text-center"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t border-border/20 pt-6">
              <div className="space-y-4">
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
            </div>
          </div>
        </CardContent>

        {/* Footer */}
        <div className="border-t border-border/20 p-4 bg-muted/30">
          <p className="text-xs text-muted-foreground text-center">
            Os custos não incluem IVA e são estimativas que podem variar consoante a localização, o fornecedor e a complexidade dos trabalhos.
          </p>
        </div>
      </Card>
    </div>
  )
}
