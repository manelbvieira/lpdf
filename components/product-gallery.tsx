"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Home, Package, Wrench, Search } from "lucide-react"
import { roomsData, type FurnitureItem } from "@/lib/furniture-data"

const CATEGORIES = [
  { id: "decoração", name: "Decoração", icon: Home },
  { id: "materiais", name: "Materiais", icon: Package },
  { id: "mobiliário", name: "Mobiliário", icon: Wrench }
] as const

export function ProductGallery() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<FurnitureItem | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")

  // Extract all items from all rooms including alternatives
  const allItems = roomsData.flatMap(room => {
    const mainItems = room.moveis.map(item => ({ ...item, isAlternative: false }))
    const alternativeItems = room.moveis.flatMap(item => 
      item.alternativas ? item.alternativas.map(alt => ({ ...alt, isAlternative: true, mainItemId: item.id })) : []
    )
    return [...mainItems, ...alternativeItems]
  })

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
        <div className="mb-12">
          <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-4">
            GALERIA DE PRODUTOS
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl tracking-[0.05em] uppercase text-foreground">
            EXPLORA POR CATEGORIA
          </h2>
          <p className="mt-4 text-sm tracking-[0.2em] uppercase text-muted-foreground max-w-2xl leading-relaxed">
            VISUALIZA OS PRODUTOS SELECIONADOS
          </p>
        </div>

        {/* Category Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CATEGORIES.map((category) => (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className="h-24 tracking-[0.2em] uppercase flex flex-col items-center justify-center gap-2"
            >
              <category.icon className="w-6 h-6" />
              {category.name}
            </Button>
          ))}
        </div>
      </section>

      {/* Category Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-background rounded-lg border border-border/40">
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
                  <div key={item.id} className="group cursor-pointer border border-border/20 rounded-lg p-4 hover:border-[#0099CC] transition-all duration-300">
                    {/* Product Image */}
                    <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-muted">
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background rounded-lg border border-border/40">
            <div className="sticky top-0 bg-background border-b border-border/40 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-foreground uppercase tracking-[0.2em]">
                  {selectedItem.nome}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedItem.descricao}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleCloseModal} className="bg-transparent">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Images */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-foreground mb-4">Imagens</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedItem.imagens.map((image, index) => (
                      <div key={index} className="aspect-square overflow-hidden rounded-lg border border-border/20">
                        <img
                          src={image}
                          alt={`${selectedItem.nome} - Imagem ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Detalhes</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p><strong>Categoria:</strong> {selectedItem.categoria}</p>
                      <p><strong>Fornecedor:</strong> {selectedItem.fornecedor}</p>
                      <p><strong>Preço:</strong> €{selectedItem.preco.toFixed(2)}</p>
                      {selectedItem.alternativas && selectedItem.alternativas.length > 0 && (
                        <p><strong>Alternativa de:</strong> {selectedItem.alternativas[0].id}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Descrição</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedItem.descricao}
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleCloseModal}
                      className="flex-1 tracking-[0.2em] uppercase"
                    >
                      FECHAR
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
