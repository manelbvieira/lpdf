"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Plus, Minus, Grid3x3, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { FurnitureItem } from "@/lib/furniture-data"
import { SimilarProductsGallery } from "./similar-products-gallery"

interface ProductModalProps {
  item: FurnitureItem
  onClose: () => void
  onAddToCart: (item: FurnitureItem, quantidade: number) => void
}

export function ProductModal({ item, onClose, onAddToCart }: ProductModalProps) {
  const [quantidade, setQuantidade] = useState(1)
  const [showSimilarProducts, setShowSimilarProducts] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleQuantityChange = (delta: number) => {
    setQuantidade((prev) => Math.max(1, prev + delta))
  }

  const handleAddToCart = () => {
    onAddToCart(item, quantidade)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  const handleShowSimilarProducts = () => {
    setShowSimilarProducts(true)
  }

  const handleCloseSimilarProducts = () => {
    setShowSimilarProducts(false)
  }

  const handleBackToDetails = () => {
    setShowSimilarProducts(false)
  }

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? item.imagens.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === item.imagens.length - 1 ? 0 : prev + 1))
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardContent className="p-0">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/40">
              <p className="text-[10px] tracking-widest uppercase text-muted-foreground">Detalhes do produto</p>
              <Button variant="ghost" size="sm" onClick={onClose} className="bg-transparent text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="aspect-square relative overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={item.imagens[currentImageIndex] || "/placeholder.svg"}
                      alt={`${item.nome} - Imagem ${currentImageIndex + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {item.imagens.length > 1 && (
                      <>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute left-2 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
                          onClick={handlePreviousImage}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
                          onClick={handleNextImage}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                  {item.imagens.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {item.imagens.map((imagem, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                            currentImageIndex === index
                              ? "border-primary"
                              : "border-transparent opacity-60 hover:opacity-100"
                          }`}
                        >
                          <Image
                            src={imagem || "/placeholder.svg"}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="space-y-5">
                  <div>
                    <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-2">
                      {item.categoria}
                    </p>
                    <h3 className="font-serif text-2xl tracking-tight text-foreground">{item.nome}</h3>
                    {item.fornecedor && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {item.fornecedor}
                      </p>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">{item.descricao}</p>

                  <div className="text-2xl font-light text-foreground">{formatPrice(item.preco)}</div>

                  {/* Quantity Selector */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Quantidade</label>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantidade <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{quantidade}</span>
                      <Button variant="outline" size="sm" onClick={() => handleQuantityChange(1)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Total Price */}
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Subtotal:</span>
                      <span className="text-lg font-semibold text-foreground">
                        {formatPrice(item.preco * quantidade)}
                      </span>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    onClick={handleAddToCart}
                    className="w-full h-12 rounded-none bg-[#0099CC] hover:bg-[#007aa3] text-white text-xs tracking-widest uppercase"
                    size="lg"
                  >
                    Adicionar ao orçamento
                  </Button>

                  <button
                    type="button"
                    onClick={handleShowSimilarProducts}
                    className="w-full flex items-center justify-center gap-2 h-12 border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors text-xs tracking-widest uppercase"
                  >
                    <Grid3x3 className="w-3.5 h-3.5" />
                    Explorar outras opções
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showSimilarProducts && (
        <SimilarProductsGallery
          products={item.alternativas || []}
          onClose={handleCloseSimilarProducts}
          onBack={handleBackToDetails}
          onAddToCart={onAddToCart}
        />
      )}
    </>
  )
}
