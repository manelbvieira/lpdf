"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, X, Phone, Mail, ChevronUp, Sofa, Package, Palette, Megaphone } from "lucide-react"

interface Supplier {
  id: string
  name: string
  logo: string
  description: string
  address?: string
  phone?: string
  email?: string
  website?: string
  certifications: string[]
  category: string
}

const suppliers: Supplier[] = [
  {
    id: "jysk",
    name: "JYSK",
    logo: "/logo-jysk.png",
    description: "MOBILIÁRIO E DECORAÇÃO ESCANDINAVA",
    website: "HTTPS://WWW.JYSK.PT",
    certifications: ["FSC", "GRS", "OEKO-TEX", "DOWNPASS", "IDFL"],
    category: "mobiliario"
  },
  {
    id: "ikea",
    name: "IKEA",
    logo: "/logo-ikea.png",
    description: "MOBILIÁRIO E DECORAÇÃO SUECA",
    website: "HTTPS://WWW.IKEA.PT",
    certifications: ["FSC", "GRS", "OEKO-TEX", "ASC", "MSC"],
    category: "mobiliario"
  },
  {
    id: "leroy-merlin",
    name: "LEROY MERLIN",
    logo: "/logo-leroy.png",
    description: "MATERIAIS DE CONSTRUÇÃO E BRICOLAGE",
    website: "HTTPS://WWW.LEROYMERLIN.PT",
    certifications: ["FSC", "PEFC", "BREEAM IN-USE"],
    category: "materiais"
  },
  {
    id: "homa",
    name: "HOMA",
    logo: "/logo-homa.png",
    description: "MOBILIÁRIO CONTEMPORÂNEO COM DESIGN INOVADOR",
    website: "HTTPS://WWW.HOMA.PT",
    certifications: ["FSC","GRS", "OEKO-TEX"],
    category: "mobiliario"
  },
  {
    id: "beliani",
    name: "BELIANI",
    logo: "/logo-beliani.png",
    description: "MOBILIÁRIO CONTEMPORÂNEO COM DESIGN INOVADOR",
    website: "HTTPS://WWW.BELIANI.PT",
    certifications: [],
    category: "mobiliario"
  },
  {
    id: "sklum",
    name: "SKLUM",
    logo: "/logo-sklum.png",
    description: "MOBILIÁRIO CONTEMPORÂNEO COM DESIGN INOVADOR",
    website: "HTTPS://WWW.SKLUM.PT",
    certifications: ["FSC"],
    category: "mobiliario"
  },
  {
    id: "paumarc",
    name: "PAUMARC",
    logo: "/logo-paumarc.png",
    description: "PAVIMENTOS E MADEIRAS",
    phone: "+351 917 871 746",
    email: "comercial@paumarc.pt",
    website: "HTTPS://WWW.PAUMARC.PT",
    certifications: ["FSC", "PEFC", "DAP"],
    category: "materiais"
  },
  {
    id: "ecart",
    name: "EÇART",
    logo: "/logo-ecart.png",
    description: "DESIGN",
    website: "HTTPS://WWW.ECARTDESIGN.PT",
    certifications: [],
    category: "comunicacao"
  },
  {
    id: "decorestudio",
    name: "DECORESTUDIO",
    logo: "/logo-decorestudio.png",
    description: "PUBLICIDADE E COMUNICAÇÃO",
    phone: "+351 919 108 122",
    email: "decorestudio.publi@gmail.com",
    certifications: [],
    category: "comunicacao"
  },
  {
    id: "r2",
    name: "R2",
    logo: "/logo-r2.png",
    description: "PUBLICIDADE E COMUNICAÇÃO",
    phone: "+351 964 769 567",
    email: "comercial@reclamo2000.pt",
    website: "HTTPS://WWW.RECLAMO2000.PT",
    certifications: ["ISO 9001", "IPAC"],
    category: "comunicacao"
  },
  {
    id: "webclinic",
    name: "WEBCLINIC",
    logo: "/logo-webclinic.png",
    description: "PUBLICIDADE E COMUNICAÇÃO",
    website: "HTTPS://WWW.WEBCLINIC.PT",
    certifications: [],
    category: "comunicacao"
  },
  {
    id: "decotirso",
    name: "DECOTIRSO",
    logo: "/logo-decotirso.png",
    description: "MOBILIÁRIO CONTEMPORÂNEO COM DESIGN INOVADOR",
    phone: "+351 915 214 508",
    email: "comercial@decotirso.com",
    website: "HTTPS://WWW.DECOTIRSO.COM",
    certifications: ["ISO 9001"],
    category: "mobiliario"
  },
  {
    id: "virtualfloat",
    name: "Virtualfloat",
    logo: "/logo-virtualfloat.png",
    description: "TRANSFORMAÇÂO E COMÉRCIO DE VIDROS",
    phone: "+351 910 126570",
    email: "geral@virtualfloat.pt",
    website: "HTTPS://WWW.VIRTUALFLOAT.PT",
    certifications: [],
    category: "materiais"
  },
  {
    id: "citymover",
    name: "CITYMOVER",
    logo: "/logo-citymover.png",
    description: "ARMAZENAMENTO E LOGÍSTICA",
    website: "HTTPS://WWW.CITYMOVER.PT",
    certifications: ["EURO 6"],
    category: "materiais"
  }
]

const categories = [
  {
    id: "mobiliario",
    name: "Mobiliário",
    icon: Sofa,
    description: "Móveis e decoração para todos os ambientes"
  },
  {
    id: "materiais",
    name: "Materiais",
    icon: Package,
    description: "Materiais de construção e acabamento"
  },
  {
    id: "comunicacao",
    name: "Comunicação",
    icon: Megaphone,
    description: "Publicidade e comunicação visual"
  }
]

interface SupplierModalProps {
  supplier: Supplier
  isOpen: boolean
  onClose: () => void
}

function SupplierModal({ supplier, isOpen, onClose }: SupplierModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-none border-border/40">
        <div className="sticky top-0 bg-background border-b border-border/40 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
              <img src={supplier.logo} alt={supplier.name} className="w-8 h-8 object-contain" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">{supplier.name}</h3>
              <p className="text-sm text-muted-foreground">{supplier.description}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="bg-transparent">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Certifications */}
          {supplier.certifications && supplier.certifications.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Certificações</h4>
              <div className="flex flex-wrap gap-2">
                {supplier.certifications.map((cert) => (
                  <Badge key={cert} variant="secondary" className="text-xs">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Informações de Contacto</h4>
            <div className="space-y-3">
              {supplier.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <a href={`tel:${supplier.phone}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {supplier.phone}
                  </a>
                </div>
              )}
              
              {supplier.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <a href={`mailto:${supplier.email}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {supplier.email}
                  </a>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <a 
                  href={supplier.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {supplier.website}
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function CertifiedSuppliers() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)

  // Group suppliers by category
  const suppliersByCategory = suppliers.reduce((acc, supplier) => {
    if (!acc[supplier.category]) {
      acc[supplier.category] = []
    }
    acc[supplier.category].push(supplier)
    return acc
  }, {} as Record<string, Supplier[]>)

  return (
    <>
      <section className="px-6 lg:px-10 py-20 lg:py-28 border-b border-border/20 overflow-visible text-center" style={{ overflow: 'visible' }}>
        <div className="max-w-6xl mx-auto w-full text-center">
          <div className="mb-12 text-center">
            <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-4">
              PARCEIROS
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl tracking-[0.05em] uppercase text-foreground">
              FORNECEDORES CERTIFICADOS
            </h2>
            <p className="mt-4 text-sm text-muted-foreground max-w-2xl leading-relaxed mx-auto">
              Garantem qualidade, fiabilidade e sustentabilidade
            </p>
          </div>

        {/* Category Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="group relative h-64 w-full overflow-hidden rounded-xl bg-background border border-border/20 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#0099CC]/20 to-[#007aa3]/40" />
                <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-white">
                  <IconComponent className="w-12 h-12 mb-4 text-white transition-transform group-hover:scale-110" />
                  <span className="text-lg tracking-[0.2em] uppercase font-medium">
                    {category.name}
                  </span>
                  <p className="text-sm text-white/80 mt-2 text-center">
                    {suppliersByCategory[category.id]?.length || 0} fornecedores
                  </p>
                </div>
              </button>
            )
          })}
        </div>
        </div>
      </section>

      {/* Category Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-background border-b border-border/20 p-6 flex items-center justify-between z-10">
              <div className="text-left">
                <h3 className="text-xl font-semibold text-foreground uppercase tracking-[0.2em]">
                  {categories.find(c => c.id === selectedCategory)?.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {categories.find(c => c.id === selectedCategory)?.description}
                </p>
              </div>
              <button
                onClick={() => setSelectedCategory(null)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suppliersByCategory[selectedCategory]?.map((supplier) => (
                  <Card key={supplier.id} className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg" onClick={() => setSelectedSupplier(supplier)}>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center group-hover:bg-[#0099CC]/10 transition-colors">
                          <img src={supplier.logo} alt={supplier.name} className="w-16 h-16 object-contain" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium tracking-[0.15em] uppercase text-foreground line-clamp-2 group-hover:text-[#0099CC] transition-colors">
                            {supplier.name}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-3">
                            {supplier.description}
                          </p>
                          {supplier.certifications.length > 0 && (
                            <div className="flex flex-wrap gap-1 justify-center">
                              {supplier.certifications.map((cert) => (
                                <Badge key={cert} variant="secondary" className="text-xs">
                                  {cert}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Supplier Modal */}
      {selectedSupplier && (
        <SupplierModal
          supplier={selectedSupplier}
          isOpen={!!selectedSupplier}
          onClose={() => setSelectedSupplier(null)}
        />
      )}

      {/* Back to Top CTA */}
      <div className="mt-20 text-center">
        <button
          type="button"
          onClick={() => window.parent?.postMessage({ action: 'scrollToTop' }, '*')}
          className="group inline-flex items-center justify-center gap-3 px-6 py-3 bg-[#0099CC] hover:bg-[#007aa3] text-white rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-[#0099CC]/30"
        >
          <ChevronUp className="w-5 h-5 text-white group-hover:animate-bounce transition-all duration-300 group-hover:-translate-y-1" />
          <span className="text-sm font-medium tracking-[0.2em] uppercase">Voltar ao topo</span>
        </button>
      </div>

      {/* Supplier Modal */}
      {selectedSupplier && (
        <SupplierModal
          supplier={selectedSupplier}
          isOpen={!!selectedSupplier}
          onClose={() => setSelectedSupplier(null)}
        />
      )}
    </>
  )
}
