"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { ProductModal } from "@/components/product-modal"
import { Cart } from "@/components/cart"
import { LoginPage } from "@/components/login-page"
import { Hotspot } from "@/components/hotspot"
import { CertifiedSuppliers } from "@/components/certified-suppliers"
import { ProductGallery } from "@/components/product-gallery"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { roomsData, type FurnitureItem } from "@/lib/furniture-data"
import { Home, ArrowDown, ShoppingCart, LogOut, X, Sofa, Table } from "lucide-react"

export default function HomePage() {
  const { isAuthenticated, login, logout } = useAuth()
  const [selectedItem, setSelectedItem] = useState<FurnitureItem | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false)
  const [cartAnimation, setCartAnimation] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const { addToCart, getTotalItems } = useCart()
  const feedRef = useRef<HTMLDivElement>(null)
  const roomDisplayRef = useRef<HTMLDivElement>(null)

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
    
    // Open modal instead of scrolling
    setTimeout(() => {
      setSelectedRoom(roomId)
      setIsRoomModalOpen(true)
      setIsTransitioning(false)
    }, 150)
  }

  const scrollToFeed = () => {
    feedRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const getRoomIcon = (roomName: string) => {
    const name = roomName.toLowerCase()
    if (name.includes('lounge') || name === 'lounge') {
      return Sofa
    }
    if (name.includes('reunião') || name.includes('reuniao') || name.includes('meeting') || name === 'sala de reunião') {
      return Table
    }
    if (name.includes('open space') || name === 'open space') {
      return Home
    }
    return Home // fallback
  }

  return (
    <div className="min-h-screen bg-background snap-y snap-mandatory overflow-y-scroll scroll-smooth">
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
      <section className="relative h-screen w-full overflow-hidden snap-start">
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

        {/* Call to Action Button */}
        <button
          type="button"
          onClick={scrollToFeed}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 group"
        >
          <div className="flex items-center gap-3 px-8 py-4 bg-[#0099CC] hover:bg-[#007aa3] text-white rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-[#0099CC]/30">
            <span className="text-sm font-medium tracking-[0.2em] uppercase">Explorar</span>
            <ArrowDown className="w-4 h-4 group-hover:animate-bounce" />
          </div>
        </button>
      </section>

      {/* Projects / Rooms Selection */}
      <div ref={feedRef} className="overflow-visible">
        {/* Section Header */}
        <section className="px-6 lg:px-10 py-20 lg:py-28 border-b border-border/20 snap-start">
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {roomsData.map((room) => (
              <button
                key={room.id}
                onClick={() => handleRoomChange(room.id)}
                className={`group relative h-64 overflow-hidden rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20 ${
                  selectedRoom === room.id
                    ? "shadow-lg shadow-[#0099CC]/20"
                    : "border-border/40 hover:border-[#0099CC]/50"
                }`}
              >
                {/* Room Image */}
                <div className="relative h-full overflow-hidden">
                  <Image
                    src={room.imagem || "/placeholder.svg"}
                    alt={room.nome}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    quality={85}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/15 transition-colors duration-300" />
                </div>

                {/* Content - Centered like categories */}
                <div className="absolute inset-0 z-10 h-full flex flex-col items-center justify-center gap-2 text-white">
                  {(() => {
                    const IconComponent = getRoomIcon(room.nome)
                    return <IconComponent className="w-6 h-6" />
                  })()}
                  <span className="text-sm tracking-[0.2em] uppercase font-medium">
                    {room.nome}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Room Modal */}
        {selectedRoom && isRoomModalOpen && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-7xl max-h-[90vh] bg-background rounded-xl overflow-hidden">
              {/* Room Content */}
              <div className="relative h-[80vh]">
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

                      {/* Room Navigation - Floating over image */}
                      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-40">
                        <div className="flex items-center gap-6">
                          {roomsData.map((room) => (
                            <button
                              key={room.id}
                              onClick={() => handleRoomChange(room.id)}
                              className={`text-sm font-medium tracking-[0.1em] uppercase transition-all duration-300 hover:scale-110 ${
                                selectedRoom === room.id
                                  ? "text-white"
                                  : "text-white/60 hover:text-white/80"
                              }`}
                            >
                              {room.nome}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Close Button */}
                      <button
                        onClick={() => setIsRoomModalOpen(false)}
                        className="absolute top-8 right-8 z-40 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      {/* Hotspots */}
                      <div className="absolute inset-0">
                        {room.moveis.map((item) => (
                          <Hotspot key={item.id} item={item} onHotspotClick={handleHotspotClick} />
                        ))}
                      </div>

                      {/* Room Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
                        <div className="max-w-4xl">
                          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 uppercase tracking-[0.05em]">
                            {room.nome}
                          </h3>
                          <p className="text-sm sm:text-base text-white/80 max-w-2xl leading-relaxed">
                            {room.descricao}
                          </p>
                        </div>
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Product Gallery Section */}
        <section className="snap-start">
          <ProductGallery onAddToCart={handleAddToCart} />
        </section>

        {/* Certified Suppliers Section */}
        <section className="snap-start">
          <CertifiedSuppliers />
        </section>

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
    </div>
  )
}
