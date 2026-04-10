"use client"

import { useState, useEffect, useRef } from "react"
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
import { ChevronDown, ShoppingCart, LogOut, X } from "lucide-react"

// Estados da máquina de estados para transições de sala
type RoomState = 
  | { status: 'idle' }
  | { status: 'open'; roomId: string }

// Mapeamento de secções para navegação robusta
const SECTION_IDS = ['hero', 'rooms', 'product-gallery', 'certified-suppliers'] as const

export default function HomePage() {
  const { isAuthenticated, login, logout } = useAuth()
  const [selectedItem, setSelectedItem] = useState<FurnitureItem | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [roomState, setRoomState] = useState<RoomState>({ status: 'idle' })
  const [cartAnimation, setCartAnimation] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)
  const { addToCart, getTotalItems } = useCart()
  const modalRef = useRef<HTMLDivElement>(null)

  // Dados da sala selecionada (só quando 'open')
  const selectedRoomData = roomState.status === 'open' 
    ? roomsData.find(r => r.id === roomState.roomId) 
    : null

  const handleHotspotClick = (item: FurnitureItem) => {
    setSelectedItem(item)
  }

  const handleAddToCart = (item: FurnitureItem, quantidade: number) => {
    addToCart(item, quantidade)
    setCartAnimation(true)
    
    // Fechar modal automaticamente após adicionar ao carrinho
    setSelectedItem(null)
  }

  // Cleanup da animação do carrinho
  useEffect(() => {
    if (!cartAnimation) return
    
    const timeoutId = setTimeout(() => setCartAnimation(false), 500)
    return () => clearTimeout(timeoutId)
  }, [cartAnimation])

  const handleRoomChange = (roomId: string) => {
    setRoomState({ status: 'open', roomId })
  }

  const scrollToSection = (index: number) => {
    // Proteção contra índice fora do array
    if (index < 0 || index >= SECTION_IDS.length) return
    
    const element = document.querySelector(`[data-section="${SECTION_IDS[index]}"]`)
    element?.scrollIntoView({ behavior: "smooth" })
  }

  // Focus trap para o modal
  useEffect(() => {
    if (roomState.status !== 'open') return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setRoomState({ status: 'idle' })
        return
      }

      // Tab key - focus trap
      if (event.key === 'Tab') {
        const modalElement = modalRef.current
        if (!modalElement) return

        const focusableElements = modalElement.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>

        if (focusableElements.length === 0) return

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (event.shiftKey) {
          // Shift + Tab = volta
          if (document.activeElement === firstElement) {
            event.preventDefault()
            ;(lastElement as HTMLElement).focus()
          }
        } else {
          // Tab = avança
          if (document.activeElement === lastElement) {
            event.preventDefault()
            ;(firstElement as HTMLElement).focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    
    // Foco inicial no modal quando abre
    const timeoutId = setTimeout(() => {
      const firstFocusable = modalRef.current?.querySelector('button, [tabindex="0"]') as HTMLElement
      firstFocusable?.focus()
    }, 100)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      clearTimeout(timeoutId)
    }
  }, [roomState.status])

  // Track current section based on scroll position com throttle
  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollPosition = window.scrollY
          const windowHeight = window.innerHeight
          const section = Math.round(scrollPosition / windowHeight)
          setCurrentSection(section)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Login ativado - página requer autenticação
  if (!isAuthenticated) {
    return <LoginPage onLogin={login} />
  }

  return (
    <div className="min-h-screen bg-background overflow-y-auto" style={{ scrollBehavior: 'smooth' }}>
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-6 lg:px-10 h-20">
          <Image 
            src="/logo-df.png" 
            alt="Doutor Finanças" 
            width={120}
            height={32}
            className="object-contain"
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
              title="Terminar sessão"
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
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className="flex items-center gap-2 cursor-pointer group"
            title={`Navegar para ${section.name}`}
          >
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentSection === section.id
                  ? 'bg-[#0099CC] scale-110'
                  : 'bg-gray-300 hover:bg-gray-400 group-hover:scale-110'
              }`}
              aria-current={currentSection === section.id ? 'true' : 'false'}
            />
            <span
              className={`text-xs tracking-[0.1em] uppercase transition-all duration-300 ${
                currentSection === section.id
                  ? 'text-[#0099CC] font-medium'
                  : 'text-gray-400 group-hover:text-gray-600'
              }`}
            >
              {section.name}
            </span>
          </button>
        ))}
      </div>

      {/* Hero Section - Full Screen with space-street */}
      <section data-section="hero" className="relative h-screen w-full overflow-hidden">
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
          onClick={() => scrollToSection(1)}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 group"
        >
          <div className="flex items-center gap-3 px-8 py-4 bg-[#0099CC] hover:bg-[#007aa3] text-white rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-[#0099CC]/30">
            <span className="text-sm font-medium tracking-[0.2em] uppercase">Explora</span>
            <ChevronDown className="w-5 h-5 group-hover:animate-bounce transition-all duration-300 group-hover:translate-y-1" />
          </div>
        </button>
      </section>

      {/* Projects / Rooms Selection */}
      <section data-section="rooms" className="px-4 sm:px-6 lg:px-10 py-20 lg:py-28 border-b border-border/20 min-h-screen">
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
                  aria-label={`Ver detalhes do ambiente ${room.nome}`}
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
              onClick={() => scrollToSection(2)}
              className="group inline-flex items-center justify-center gap-3 px-6 py-3 bg-[#0099CC] hover:bg-[#007aa3] text-white rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-[#0099CC]/30"
            >
              <ChevronDown className="w-5 h-5 text-white group-hover:animate-bounce transition-all duration-300 group-hover:translate-y-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Room Modal - sempre no DOM, visibilidade controlada por CSS */}
      <div 
        ref={modalRef}
        className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 transition-all duration-300 ${
          roomState.status === 'open'
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-95 pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="room-modal-title"
        aria-hidden={roomState.status === 'idle' ? 'true' : undefined}
      >
        <div 
          className={`relative w-full max-w-7xl max-h-[90vh] bg-background rounded-xl overflow-hidden transition-all duration-300 ${
            roomState.status === 'open'
              ? 'opacity-100 scale-100 translate-y-0' 
                : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
          }`}
        >
          {/* Room Content */}
          <div className="relative h-[80vh]">
            {selectedRoomData && (
              <>
                <h2 id="room-modal-title" className="sr-only">
                  Ambiente {selectedRoomData.nome}
                </h2>
                <Image
                  src={selectedRoomData.imagem || "/placeholder.svg"}
                  alt={selectedRoomData.nome}
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
                          roomState.status === 'open' && roomState.roomId === room.id
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
                  onClick={() => setRoomState({ status: 'idle' })}
                  className="absolute top-8 right-8 z-40 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg transition-colors"
                  aria-label="Fechar modal de ambiente"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Hotspots */}
                <div className="absolute inset-0">
                  {selectedRoomData.moveis.map((item) => (
                    <Hotspot key={item.id} item={item} onHotspotClick={handleHotspotClick} />
                  ))}
                </div>

                {/* Room Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
                  <div className="max-w-4xl">
                    <p id={`room-${selectedRoomData.id}-description`} className="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed">
                      {selectedRoomData.descricao}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Product Gallery Section */}
      <section data-section="product-gallery" className="px-4 sm:px-6 lg:px-10 py-20 lg:py-28 min-h-screen">
        <div className="max-w-6xl mx-auto w-full">
          <ProductGallery onAddToCart={handleAddToCart} />
        </div>
      </section>

      {/* Certified Suppliers Section */}
      <section data-section="certified-suppliers" className="px-4 sm:px-6 lg:px-10 py-20 lg:py-28 min-h-screen">
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
            </div>
          </div>
        </div>
      </footer>

      {/* Product Modal */}
      {selectedItem && <ProductModal item={selectedItem} onClose={() => setSelectedItem(null)} onAddToCart={handleAddToCart} />}

      {/* Cart Sidebar */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}
