"use client"

import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProductModal } from "@/components/product-modal"
import type { FurnitureItem } from "@/lib/furniture-data"
import { ChevronRight, Home, Package, Wrench, Search, Minus, Plus, ChevronLeft, ChevronDown } from "lucide-react"
import { roomsData } from "@/lib/furniture-data"

const CATEGORIES = [
  { id: "Decoração", name: "Decoração", icon: Home, texture: "/textures/decoracao-texture.jpg" },
  { id: "Materiais", name: "Materiais", icon: Package, texture: "/textures/materiais-texture.jpg" },
  { id: "Mobiliário", name: "Mobiliário", icon: Wrench, texture: "/textures/mobiliario-texture.jpg" }
] as const

export function ProductGallery({ onAddToCart }: { onAddToCart: (item: FurnitureItem, quantidade: number) => void }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<FurnitureItem | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [quantidade, setQuantidade] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Extract all items from all rooms including alternatives
  const allItems = roomsData.flatMap(room => {
    const mainItems = room.moveis.map(item => ({ ...item, isAlternative: false }))
    const alternativeItems = room.moveis.flatMap(item => 
      item.alternativas ? item.alternativas.map(alt => ({ ...alt, isAlternative: true, mainItemId: item.id })) : []
    )
    return [...mainItems, ...alternativeItems]
  })

  // Calculate unique items count for each category (same logic as modal)
  const getUniqueItemsCount = (categoryId: string) => {
    const filteredItems = allItems
      .filter(item => item.categoria.toLowerCase() === categoryId.toLowerCase())
      .sort((a, b) => a.nome.localeCompare(b.nome))
    
    const uniqueItems = filteredItems.filter((item, index, self) => 
      filteredItems.findIndex(i => 
        i.nome.toLowerCase() === item.nome.toLowerCase() && 
        i.fornecedor?.toLowerCase() === item.fornecedor?.toLowerCase()
      ) === index
    )
    
    return uniqueItems.length
  }

  // Filter items by category and sort alphabetically
  const filteredItems = selectedCategory 
    ? allItems
        .filter(item => item.categoria.toLowerCase() === selectedCategory.toLowerCase())
        .sort((a, b) => a.nome.localeCompare(b.nome))
    : []

  // Remove duplicates by keeping main items over alternatives
  const uniqueItems = filteredItems.filter((item, index, self) => 
    filteredItems.findIndex(i => 
      i.nome.toLowerCase() === item.nome.toLowerCase() && 
      i.fornecedor?.toLowerCase() === item.fornecedor?.toLowerCase()
    ) === index
  )

  // Filter by search term
  const searchFilteredItems = uniqueItems.filter(item =>
    item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.fornecedor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCloseModal = () => {
    setSelectedItem(null)
    setQuantidade(1)
    setCurrentImageIndex(0)
  }

  const handleQuantityChange = (delta: number) => {
    setQuantidade((prev) => Math.max(1, prev + delta))
  }

  const handleAddToCart = () => {
    if (selectedItem) {
      onAddToCart(selectedItem, quantidade)
      setSelectedItem(null)
      setQuantidade(1)
      setCurrentImageIndex(0)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  const handlePreviousImage = () => {
    if (selectedItem) {
      setCurrentImageIndex((prev) => (prev === 0 ? selectedItem.imagens.length - 1 : prev - 1))
    }
  }

  const handleNextImage = () => {
    if (selectedItem) {
      setCurrentImageIndex((prev) => (prev === selectedItem.imagens.length - 1 ? 0 : prev + 1))
    }
  }

  const handleCategoryClose = () => {
    setSelectedCategory(null)
  }

  const handleImageClick = (item: FurnitureItem) => {
    // Only show details, don't allow adding to cart from gallery
    setSelectedItem(item)
  }

  return (
    <>
      {/* Category Filter Bar */}
      <section className="px-6 lg:px-10 py-20 lg:py-28 border-b border-border/20">
        <div className="max-w-6xl mx-auto w-full text-center">
          <div className="mb-12 text-center">
            <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-4">
              GALERIA DE PRODUTOS
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl tracking-[0.05em] uppercase text-foreground">
              EXPLORA CADA CATEGORIA
            </h2>
            <p className="mt-4 text-sm text-muted-foreground max-w-2xl leading-relaxed mx-auto">
              Conhece os produtos selecionados e as suas características
            </p>
          </div>

          {/* Category Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="group relative h-64 w-full overflow-hidden rounded-xl bg-background border border-border/20 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/10"
              >
                {/* Background Texture Image */}
                <Image
                  src={category.texture}
                  alt={category.name}
                  fill
                  className="object-cover"
                  quality={85}
                />
                
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-white">
                  <span className="text-lg tracking-[0.2em] uppercase font-medium">
                    {category.name}
                  </span>
                  <p className="text-sm text-white/80 mt-2 text-center">
                    {getUniqueItemsCount(category.id)} peças
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Button */}
      <div className="mt-20 text-center">
        <button
          type="button"
          onClick={() => window.parent?.postMessage({ action: 'scrollToSuppliers' }, '*')}
          className="group inline-flex items-center justify-center gap-3 px-6 py-3 bg-[#0099CC] hover:bg-[#007aa3] text-white rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-[#0099CC]/30"
        >
          <ChevronDown className="w-5 h-5 text-white group-hover:animate-bounce transition-all duration-300 group-hover:translate-y-1" />
        </button>
      </div>

      {/* Category Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-background rounded-xl border border-border/40">
            <div className="sticky top-0 bg-background border-b border-border/40 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-foreground uppercase tracking-[0.2em]">
                  {selectedCategory}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchFilteredItems.length} produtos encontrados
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleCategoryClose} className="bg-transparent">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Search Bar */}
            <div className="px-6 pb-4 border-b border-border/20">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Pesquisar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-muted border border-border/20 rounded-lg text-sm tracking-[0.15em] uppercase placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0099CC] focus:border-transparent"
                />
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {searchFilteredItems.map((item) => (
                  <div key={item.id} className="group cursor-pointer border border-border/20 rounded-xl p-4 hover:border-[#0099CC] hover:shadow-xl hover:shadow-black/20 hover:scale-[1.02] transition-all duration-300 bg-background">
                    {/* Product Image */}
                    <div className="aspect-square relative overflow-hidden rounded-xl bg-muted">
                      <img
                        src={item.imagens[0]}
                        alt={item.nome}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                        onClick={() => handleImageClick(item)}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium tracking-[0.15em] uppercase text-foreground line-clamp-2">
                        {item.nome}
                      </h4>
                      
                      {/* Price and Supplier */}
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                          {item.fornecedor}
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          €{item.preco.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-0">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border/40">
                <p className="text-[10px] tracking-widest uppercase text-muted-foreground">Detalhes do produto</p>
                <Button variant="ghost" size="sm" onClick={handleCloseModal} className="bg-transparent text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="aspect-square relative overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={selectedItem.imagens[currentImageIndex] || "/placeholder.svg"}
                        alt={`${selectedItem.nome} - Imagem ${currentImageIndex + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      {selectedItem.imagens.length > 1 && (
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
                    {selectedItem.imagens.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto">
                        {selectedItem.imagens.map((imagem, index) => (
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
                        {selectedItem.categoria}
                      </p>
                      <h3 className="font-serif text-2xl tracking-tight text-foreground">{selectedItem.nome}</h3>
                      {selectedItem.fornecedor && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {selectedItem.fornecedor}
                        </p>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">{selectedItem.descricao}</p>

                    <div className="text-2xl font-light text-foreground">{formatPrice(selectedItem.preco)}</div>

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
                          {formatPrice(selectedItem.preco * quantidade)}
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
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
