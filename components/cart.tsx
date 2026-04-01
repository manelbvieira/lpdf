"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, FileText, Plus, Minus, Trash2, Mail, Store } from "lucide-react"
import { generateQuotePDF } from "@/lib/pdf-generator"
import { useCart } from "@/contexts/cart-context"
import Image from "next/image"

interface CartProps {
  isOpen: boolean
  onClose: () => void
}

export function Cart({ isOpen, onClose }: CartProps) {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, getTotalWithoutVAT, getVATAmount, clearCart } =
    useCart()

  // Estado para a modal de exportação PDF
  const [showPDFModal, setShowPDFModal] = useState(false)
  const [exportEmail, setExportEmail] = useState("")
  const [storeName, setStoreName] = useState("")
  const [isExporting, setIsExporting] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  // Group items by category
  const getItemsByCategory = (category: string) => {
    return cartItems.filter(item => item.categoria === category)
  }

  const getCategorySubtotal = (category: string) => {
    return cartItems
      .filter(item => item.categoria === category)
      .reduce((total, item) => total + (item.preco * item.quantidade), 0)
  }

  const getUniqueCategories = () => {
    return Array.from(new Set(cartItems.map(item => item.categoria)))
  }

  const getCategoryPercentage = (category: string) => {
    const categoryTotal = getCategorySubtotal(category)
    const overallTotal = getTotalWithoutVAT()
    return overallTotal > 0 ? (categoryTotal / overallTotal) * 100 : 0
  }

  const handleExportPDF = () => {
    if (cartItems.length === 0) {
      alert("Adiciona itens ao orçamento antes de exportar.")
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
      // Gerar PDF com os dados
      const success = await generateQuotePDF(cartItems, storeName, exportEmail)

      if (success) {
        // Enviar cópia para manuel.vieira@doutorfinancas.pt
        await sendPDFCopy(exportEmail, storeName, cartItems)
        
        console.log("[v0] Cart PDF exported successfully")
        alert("PDF gerado e enviado com sucesso!")
        
        // Limpar campos e fechar modal
        setExportEmail("")
        setStoreName("")
        setShowPDFModal(false)
      }
    } catch (error) {
      console.error("[v0] Error generating Cart PDF:", error)
      alert("Erro ao gerar PDF. Tenta novamente.")
    } finally {
      setIsExporting(false)
    }
  }

  const sendPDFCopy = async (email: string, storeName: string, items: any[]) => {
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
        ${items.map(item => `${item.nome}: ${item.quantidade} x €${item.preco} = €${(item.preco * item.quantidade).toFixed(2)}`).join('\n')}
        
        Total: €${items.reduce((total, item) => total + (item.preco * item.quantidade), 0).toFixed(2)}
      `
    }

    // Simular envio (log para desenvolvimento)
    console.log("[v0] Email data to send:", emailData)
    
    // Em produção, aqui faria uma chamada API para enviar o email
    // await fetch('/api/send-pdf', { method: 'POST', body: JSON.stringify(emailData) })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-end z-50">
      <Card className="w-full max-w-md h-full rounded-none border-l border-border/40 shadow-none rounded-xl">
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
              {/* Cart Items by Category */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {getUniqueCategories().map((category) => {
                  const categoryItems = getItemsByCategory(category)
                  const categorySubtotal = getCategorySubtotal(category)
                  
                  return (
                    <Card key={category} className="border border-border/20 shadow-lg shadow-black/15 rounded-xl">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-sm font-medium text-foreground capitalize">
                              {category}
                            </CardTitle>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-[#0099CC]">
                              {formatPrice(categorySubtotal)}
                            </p>
                            <p className="text-xs text-muted-foreground">Subtotal</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          {categoryItems.map((item) => (
                            <div key={item.id} className="flex gap-3 p-3 border border-border/10 rounded-xl bg-muted/30">
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
                                      onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                                      className="w-6 h-6 p-0"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </Button>
                                    <span className="text-xs w-8 text-center">{item.quantidade}</span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                                      className="w-6 h-6 p-0"
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
                      </CardContent>
                    </Card>
                  )
                })}
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

                {/* Category Distribution Chart */}
                {cartItems.length > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-muted-foreground">Distribuição por Categoria</span>
                      <span className="text-xs text-muted-foreground">100%</span>
                    </div>
                    <div className="w-full h-8 bg-border/20 overflow-hidden flex">
                      {getUniqueCategories().map((category) => {
                        const percentage = getCategoryPercentage(category)
                        if (percentage === 0) return null
                        
                        const categoryColors: { [key: string]: string } = {}
                        getUniqueCategories().forEach((cat) => {
                          const hash = cat.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
                          const colors = ['bg-blue-900', 'bg-gray-600', 'bg-amber-700', 'bg-slate-700', 'bg-stone-600']
                          categoryColors[cat] = colors[hash % colors.length]
                        })
                        
                        return (
                          <div
                            key={category}
                            className={`h-full transition-all duration-500 ease-out ${categoryColors[category] || 'bg-gray-500'}`}
                            style={{ width: `${percentage}%` }}
                            title={`${category}: ${percentage.toFixed(1)}%`}
                          />
                        )
                      })}
                    </div>
                    <div className="flex justify-between mt-2">
                      {getUniqueCategories().map((category) => {
                        const percentage = getCategoryPercentage(category)
                        if (percentage === 0) return null
                        
                        const categoryColors: { [key: string]: string } = {}
                        getUniqueCategories().forEach((cat) => {
                          const hash = cat.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
                          const colors = ['bg-blue-900', 'bg-gray-600', 'bg-amber-700', 'bg-slate-700', 'bg-stone-600']
                          categoryColors[cat] = colors[hash % colors.length]
                        })
                        
                        return (
                          <div key={category} className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${categoryColors[category] || 'bg-gray-500'}`} />
                            <span className="text-xs text-muted-foreground">
                              {category} ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

              </div>

              {/* Botões fixos no fundo - FORA do scroll */}
              <div className="p-4 border-t border-border/40 bg-background space-y-2">
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

      {/* Modal de Exportação PDF */}
      {showPDFModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">Exportar orçamento</h3>
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
                  O teu email
                </label>
                <input
                  type="email"
                  value={exportEmail}
                  onChange={(e) => setExportEmail(e.target.value)}
                  placeholder="nome@email.com"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0099CC] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Store className="w-4 h-4 inline mr-2" />
                  Nome da loja/localidade
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Nome da loja/localidade"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0099CC] focus:border-transparent"
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
                O PDF será gerado e enviado também para a equipa de Facilities Experience
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
