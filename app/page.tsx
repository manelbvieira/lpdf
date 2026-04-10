"use client"

import { useState, useRef, useEffect } from "react"
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
import { ChevronDown, ShoppingCart, LogOut, X, Sofa, Table } from "lucide-react"

export default function HomePage() {
  const { isAuthenticated, login, logout } = useAuth()
  const [selectedItem, setSelectedItem] = useState<FurnitureItem | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false)
  const [cartAnimation, setCartAnimation] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)
  const { addToCart, getTotalItems } = useCart()
  const feedRef = useRef<HTMLDivElement>(null)
  const roomDisplayRef = useRef<HTMLDivElement>(null)

  const handleHotspotClick = (item: FurnitureItem) => {
    setSelectedItem(item)
  }

  const handleCloseModal = () => {
    setSelectedItem(null)
  }

  const handleAddToCart = (item: FurnitureItem, quantidade: number) => {
    addToCart(item, quantidade)
    setCartAnimation(true)
    setTimeout(() => setCartAnimation(false), 500)
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

  const scrollToNextSection = () => {
    const nextSection = document.querySelector('[data-section="product-gallery"]')
    nextSection?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToSuppliers = () => {
    // Scroll to suppliers section
    const suppliersSection = document.querySelector('[data-section="certified-suppliers"]')
    suppliersSection?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToTop = () => {
    // Scroll to hero section (top of page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const getRoomIcon = (roomName: string) => {
    // Return appropriate icon based on room name
    if (roomName.toLowerCase().includes('lounge')) {
      return Sofa
    }
    if (roomName.toLowerCase().includes('reunião') || roomName.toLowerCase().includes('reuniao')) {
      return Table
    }
    return ChevronDown // Usando ChevronDown como fallback
  }

  // Listen for messages from child components
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.action === 'scrollToSuppliers') {
        scrollToSuppliers()
      } else if (event.data?.action === 'scrollToTop') {
        scrollToTop()
      }
    }

    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  // Track current section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const section = Math.round(scrollPosition / windowHeight)
      setCurrentSection(section)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Login desativado - página sempre acessível
  // if (!isAuthenticated) {
  //   return <LoginPage onLogin={login} />
  // }

  return (
    <div className="min-h-screen bg-background snap-y snap-mandatory overflow-y-scroll scroll-smooth" style={{ scrollSnapType: 'y mandatory' }}>
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

      {/* Vertical Paging Indicator - Fixed Position */}
      <div className="fixed left-6 lg:left-10 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-1">
        {[
          { id: 0, name: 'Início' },
          { id: 1, name: 'Espaços' },
          { id: 2, name: 'Materiais' },
          { id: 3, name: 'Fornecedores' }
        ].map((section) => (
          <div key={section.id} className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentSection === section.id
                  ? 'bg-[#0099CC] scale-110'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
            <span
              className={`text-xs tracking-[0.1em] uppercase transition-all duration-300 ${
                currentSection === section.id
                  ? 'text-[#0099CC] font-medium'
                  : 'text-gray-400'
              }`}
            >
              {section.name}
            </span>
          </div>
        ))}
      </div>

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
            <span className="text-sm font-medium tracking-[0.2em] uppercase">Explora</span>
            <ChevronDown className="w-5 h-5 group-hover:animate-bounce transition-all duration-300 group-hover:translate-y-1" />
          </div>
        </button>
      </section>

      {/* Projects / Rooms Selection */}
      <div ref={feedRef} className="overflow-visible">
        {/* Section Header */}
        <section className="pl-40 lg:pl-48 pr-40 lg:pr-48 py-20 lg:py-28 border-b border-border/20 snap-start h-screen">
          <div className="max-w-6xl mx-auto w-full text-center">
            {/* Section Info */}
            <div className="mb-12 text-center">
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-4">
                Materiais e mobiliário
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl text-foreground uppercase tracking-[0.05em]">
                ESPAÇOS E AMBIENTES
              </h2>
              <p className="text-sm text-muted-foreground mt-4 max-w-2xl leading-relaxed mx-auto">
                Explora os ambientes de loja e descobre as soluções ideais para o teu espaço
              </p>
            </div>
            
            {/* Room Selection Buttons - Now as CTAs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roomsData.map((room) => {
                return (
                  <button
                    key={room.id}
                    onClick={() => handleRoomChange(room.id)}
                    className="group relative h-64 w-full overflow-hidden rounded-xl bg-background border border-border/20 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/10"
                  >
                    {/* Background Image */}
                    <Image
                      src={room.imagem || "/placeholder.svg"}
                      alt={room.nome}
                      fill
                      className="object-cover"
                      quality={85}
                    />
                    
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
                    
                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-white">
                      <span className="text-lg tracking-[0.2em] uppercase font-medium">
                        {room.nome}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
            
            {/* CTA Button */}
            <div className="mt-20 text-center">
              <button
                type="button"
                onClick={scrollToNextSection}
                className="group inline-flex items-center justify-center gap-3 px-6 py-3 bg-[#0099CC] hover:bg-[#007aa3] text-white rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-[#0099CC]/30"
              >
                <ChevronDown className="w-5 h-5 text-white group-hover:animate-bounce transition-all duration-300 group-hover:translate-y-1" />
              </button>
            </div>
          </div>
        </section>

        {/* Room Modal */}
        {selectedRoom && isRoomModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
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
                              className={`text-sm tracking-[0.1em] uppercase transition-all duration-300 hover:scale-110 ${
                                selectedRoom === room.id
                                  ? "text-white font-bold"
                                  : "text-white/60 hover:text-white/80 font-medium"
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
                          <p className="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed">
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
        <section data-section="product-gallery" className="snap-start h-screen flex flex-col justify-center items-center text-center pl-40 lg:pl-48 pr-40 lg:pr-48">
          <div className="max-w-6xl mx-auto w-full">
            <ProductGallery onAddToCart={handleAddToCart} />
          </div>
        </section>

        {/* Certified Suppliers Section */}
        <section data-section="certified-suppliers" className="snap-start h-screen flex flex-col justify-between items-center text-center pl-40 lg:pl-48 pr-40 lg:pr-48 py-20 lg:py-28">
          <div className="max-w-6xl mx-auto w-full">
            <CertifiedSuppliers />
          </div>
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
