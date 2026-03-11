"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { ProductModal } from "@/components/product-modal"
import { Cart } from "@/components/cart"
import { Calculator } from "@/components/calculator"
import { LoginPage } from "@/components/login-page"
import { Hotspot } from "@/components/hotspot"
import { CertifiedSuppliers } from "@/components/certified-suppliers"
import { ProductGallery } from "@/components/product-gallery"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { roomsData, type FurnitureItem } from "@/lib/furniture-data"
import { ShoppingCart, LogOut, ArrowDown, Calculator as CalculatorIcon } from "lucide-react"

export default function HomePage() {
  const { isAuthenticated, login, logout } = useAuth()
  const [selectedItem, setSelectedItem] = useState<FurnitureItem | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [cartAnimation, setCartAnimation] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const { addToCart, getTotalItems } = useCart()
  const feedRef = useRef<HTMLDivElement>(null)

  if (!isAuthenticated) {
    return <LoginPage onLogin={login} />
  }

  const handleHotspotClick = (item: FurnitureItem) => {
    setSelectedItem(item)
  }

  const handleCloseModal = () => {
    setSelectedItem(null)
  }

  const handleAddToCart = (item: FurnitureItem, quantidade: number) => {
    addToCart(item, quantidade)
    setSelectedItem(null)
    
    // Trigger cart animation
    setCartAnimation(true)
    setTimeout(() => setCartAnimation(false), 600)
  }

  const handleRoomChange = (roomId: string) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setSelectedRoom(roomId)
      setIsTransitioning(false)
    }, 150)
  }

  const scrollToFeed = () => {
    feedRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="bg-background">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-6 lg:px-10 h-20">
          <img 
            src="/logo-df.png" 
            alt="Doutor Finanças" 
            className="h-8 w-auto"
          />
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative bg-white text-black text-xs tracking-[0.15em] uppercase flex items-center gap-2 px-3 py-2 rounded"
            >
              <ShoppingCart className={`w-4 h-4 transition-all duration-300 ${cartAnimation ? 'scale-125 text-[#0099CC]' : ''}`} />
              <span className="hidden sm:inline">Orçamento</span>
              {getTotalItems() > 0 && (
                <span className={`absolute -top-2 -right-4 bg-[#0099CC] text-white text-[9px] font-semibold rounded-full w-5 h-5 flex items-center justify-center transition-all duration-300 ${cartAnimation ? 'scale-125 bg-green-500' : ''}`}>
                  {getTotalItems()}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsCalculatorOpen(true)}
              className="bg-white text-black text-xs tracking-[0.15em] uppercase flex items-center gap-2 px-3 py-2 rounded"
            >
              <CalculatorIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Calculadora</span>
            </button>
            <button
              type="button"
              onClick={logout}
              className="bg-white text-black hover:opacity-90 transition-opacity px-3 py-2 rounded"
              title="Terminar sessao"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Full Screen with space-street */}
      <section className="relative h-screen w-full overflow-hidden">
        <Image
          src="/space-street.png"
          alt="Doutor Financas - Loja modelo"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-black/30" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col justify-end px-6 lg:px-10 pb-20">
          <p className="mt-6 text-xs sm:text-sm text-white/60 uppercase tracking-[0.05em] whitespace-nowrap">
            EXPLORA CADA AMBIENTE E <span className="font-bold text-white">CRIA O TEU ORÇAMENTO</span> DE FORMA INTERATIVA
          </p>
        </div>

        {/* Scroll indicator */}
        <button
          type="button"
          onClick={scrollToFeed}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 hover:text-white transition-colors flex flex-col items-center gap-2"
        >
          <span className="text-[9px] tracking-[0.3em] uppercase">Explorar</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </button>
      </section>

      {/* Projects / Rooms Selection */}
      <div ref={feedRef}>
        {/* Section Header */}
        <section className="px-6 lg:px-10 py-20 lg:py-28 border-b border-border/20">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-4">
                Materiais e mobiliário
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl text-foreground uppercase tracking-[0.05em]">
                ESPAÇOS E AMBIENTES
              </h2>
            </div>
            <p className="text-sm text-muted-foreground hidden sm:block">
              ({String(roomsData.length).padStart(2, "0")}) Espaços
            </p>
          </div>
          <div className="mb-12">
            <p className="mt-4 text-sm tracking-[0.2em] uppercase text-muted-foreground max-w-2xl leading-relaxed">
              SELECIONA O ESPAÇO E CRIA A TUA LOJA
            </p>
          </div>
        </section>

        {/* Room Selection Buttons */}
        <section className="px-6 lg:px-10 py-12 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {roomsData.map((room) => (
              <button
                key={room.id}
                onClick={() => handleRoomChange(room.id)}
                className={`group relative overflow-hidden rounded-lg border transition-all duration-300 ${
                  selectedRoom === room.id
                    ? "border-[#0099CC] shadow-lg shadow-[#0099CC]/20"
                    : "border-border/40 hover:border-[#0099CC]/50"
                }`}
              >
                {/* Room Image */}
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={room.imagem || "/placeholder.svg"}
                    alt={room.nome}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    quality={85}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                </div>

                {/* Room Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-white/40 block mb-3">
                    {String(roomsData.indexOf(room) + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-xl sm:text-2xl text-white mb-2">
                    {room.nome}
                  </h3>
                </div>

                {/* Selection Indicator */}
                {selectedRoom === room.id && (
                  <div className="absolute top-4 right-4 w-8 h-8 bg-[#0099CC] rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Selected Room Display */}
        {selectedRoom && (
          <section className={`relative w-full transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {/* Full-width room image with hotspots */}
            <div className="relative w-full" style={{ minHeight: "100vh" }}>
              {(() => {
                const room = roomsData.find(r => r.id === selectedRoom)
                if (!room) return null
                return (
                  <>
                    <Image
                      src={room.imagem || "/placeholder.svg"}
                      alt={room.nome}
                      fill
                      className="object-cover"
                      quality={85}
                    />
                    {/* Dark gradient overlay at bottom for text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    {/* Hotspots */}
                    <div className="absolute inset-0">
                      {room.moveis.map((item) => (
                        <Hotspot key={item.id} item={item} onHotspotClick={handleHotspotClick} />
                      ))}
                    </div>

                    {/* Room info overlay at bottom-left */}
                    <div className="absolute bottom-0 left-0 right-0 px-6 lg:px-10 pb-12 lg:pb-16">
                      <div className="flex items-end justify-between">
                        <div>
                          <span className="text-[10px] tracking-[0.3em] uppercase text-white/40 block mb-3">
                            {String(roomsData.indexOf(room) + 1).padStart(2, "0")}
                          </span>
                          <h3 className="text-3xl sm:text-4xl lg:text-5xl text-white mb-2">
                            {room.nome}
                          </h3>
                          <p className="text-xs text-white/50 whitespace-nowrap">
                            {room.descricao}
                          </p>
                        </div>
                        <p className="text-[9px] tracking-[0.2em] uppercase text-white/30 hidden sm:block">
                          Clica nos pontos para explorar
                        </p>
                      </div>
                    </div>
                  </>
                )
              })()}
            </div>
          </section>
        )}

        {/* Product Gallery Section */}
        <ProductGallery />

        {/* Certified Suppliers Section */}
        <CertifiedSuppliers />

        {/* Footer */}
        <footer className="border-t border-border/20">
          <div className="px-6 lg:px-10 py-16 lg:py-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-4">
                  Contacto
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  facilities.experience@doutorfinancas.pt</p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-4">
                  Informação
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Os preços apresentados não incluem IVA e podem estar desatualizados</p>
              </div>
              <div className="md:text-right">
                <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-4">
                  Rede Doutor Finanças
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Catálogo de mobiliário e materiais</p>
                <p className="text-xs text-muted-foreground mt-1"> </p>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Product Modal */}
      {selectedItem && <ProductModal item={selectedItem} onClose={handleCloseModal} onAddToCart={handleAddToCart} />}

      {/* Cart Sidebar */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Calculator Modal */}
      <Calculator isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} />
    </div>
  )
}
