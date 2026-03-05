"use client"

import { X, Plus, Minus, Trash2, FileText } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { generateQuotePDF } from "@/lib/pdf-generator"

interface CartProps {
  isOpen: boolean
  onClose: () => void
}

export function Cart({ isOpen, onClose }: CartProps) {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, getTotalWithoutVAT, getVATAmount, clearCart } =
    useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  const handleExportPDF = async () => {
    if (cartItems.length === 0) {
      alert("Adiciona itens ao orçamento antes de exportar.")
      return
    }

    try {
      const success = await generateQuotePDF(cartItems)
      if (success) {
        // Show success message briefly
        console.log("[v0] PDF exported successfully")
      }
    } catch (error) {
      console.error("[v0] Error generating PDF:", error)
      alert("Erro ao gerar PDF. Verifica se o teu navegador permite downloads automáticos e tenta novamente.")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-end z-50">
      <Card className="w-full max-w-md h-full rounded-none border-l border-border/40 shadow-none">
        <CardHeader className="border-b border-border/40">
          <div className="flex items-center justify-between">
            <p className="text-[10px] tracking-widest uppercase text-muted-foreground">Orçamento</p>
            <Button variant="ghost" size="sm" onClick={onClose} className="bg-transparent text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col h-full p-0">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-foreground mb-2">Orçamento vazio</h3>
                <p className="text-sm text-muted-foreground">Adiciona mobiliário e materiais clicando nos pontos interativos da imagem</p>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
                    <div className="w-16 h-16 relative overflow-hidden rounded bg-muted flex-shrink-0">
                      <Image
                        src={item.imagens[0] || "/placeholder.svg"}
                        alt={item.nome}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-foreground truncate">{item.nome}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{item.categoria}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-6 h-6 p-0 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-xs w-8 text-center">{item.quantidade}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-6 h-6 p-0 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-6 h-6 p-0 text-destructive hover:text-destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-muted-foreground">{formatPrice(item.preco)} cada</span>
                        <span className="text-sm font-medium text-foreground">
                          {formatPrice(item.preco * item.quantidade)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="border-t p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal (sem IVA):</span>
                    <span className="text-foreground">{formatPrice(getTotalWithoutVAT())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">IVA (23%):</span>
                    <span className="text-foreground">{formatPrice(getVATAmount())}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span className="text-foreground">Total (com IVA):</span>
                    <span className="text-foreground">{formatPrice(getTotalPrice())}</span>
                  </div>
                </div>

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
                    onClick={clearCart}
                    className="w-full h-9 text-[10px] tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Limpar orçamento
                  </button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
