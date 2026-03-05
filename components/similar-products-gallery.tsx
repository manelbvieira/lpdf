"use client"
import { useState } from "react"
import Image from "next/image"
import { X, ShoppingCart, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { FurnitureItem } from "@/lib/furniture-data"
import { ProductModal } from "./product-modal"

interface SimilarProductsGalleryProps {
  products: FurnitureItem[]
  onClose: () => void
  onBack: () => void
  onAddToCart: (item: FurnitureItem, quantidade: number) => void
}

export function SimilarProductsGallery({ products, onClose, onBack, onAddToCart }: SimilarProductsGalleryProps) {
  const [selectedProduct, setSelectedProduct] = useState<FurnitureItem | null>(null)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  const handleAddToCart = (product: FurnitureItem) => {
    onAddToCart(product, 1)
  }

  const handleProductClick = (product: FurnitureItem) => {
    setSelectedProduct(product)
  }

  const handleCloseProductModal = () => {
    setSelectedProduct(null)
  }

  if (!products || products.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-0">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/40">
              <p className="text-[10px] tracking-widest uppercase text-muted-foreground">Explorar outras opções</p>
              <Button variant="ghost" size="sm" onClick={onClose} className="bg-transparent text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Empty State */}
            <div className="p-16 text-center space-y-6">
              <div className="space-y-3">
                <h3 className="font-serif text-xl text-foreground">Não existem outras opções</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Contacta a equipa Doutor Finanças para esclarecimentos sobre produtos alternativos.
                </p>
              </div>
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Voltar aos detalhes
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
          <CardContent className="p-0">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/40 sticky top-0 bg-card z-10">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Voltar
                </button>
                <span className="text-border">|</span>
                <p className="text-[10px] tracking-widest uppercase text-muted-foreground">
                  Outras Opcoes
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="bg-transparent text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Products Grid */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card
                    key={product.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleProductClick(product)}
                  >
                    <CardContent className="p-0">
                      {/* Product Image */}
                      <div className="aspect-square relative overflow-hidden bg-muted">
                        <Image
                          src={product.imagens[0] || "/placeholder.svg"}
                          alt={product.nome}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        {product.imagens.length > 1 && (
                          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                            {product.imagens.length} fotos
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4 space-y-3">
                        <div>
                          <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-1">
                            {product.categoria}
                          </p>
                          <h3 className="font-serif text-base text-foreground line-clamp-1">{product.nome}</h3>
                        </div>

                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {product.descricao}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-border/40">
                          <span className="text-base font-light text-foreground">{formatPrice(product.preco)}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAddToCart(product)
                            }}
                            className="text-[10px] tracking-widest uppercase text-[#0099CC] hover:text-[#007aa3] transition-colors"
                          >
                            Adicionar
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedProduct && (
        <ProductModal item={selectedProduct} onClose={handleCloseProductModal} onAddToCart={onAddToCart} />
      )}
    </>
  )
}
