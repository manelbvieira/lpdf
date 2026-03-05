"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, X, Phone, Mail } from "lucide-react"

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
}

const suppliers: Supplier[] = [
  {
    id: "jysk",
    name: "JYSK",
    logo: "/logo-jysk.png",
    description: "MOBILIÁRIO E DECORAÇÃO ESCANDINAVA",
    website: "HTTPS://WWW.JYSK.PT",
    certifications: ["FSC", "GRS", "OEKO-TEX", "DOWNPASS", "IDFL"]
  },
  {
    id: "ikea",
    name: "IKEA",
    logo: "/logo-ikea.png",
    description: "MOBILIÁRIO E DECORAÇÃO SUECA",
    website: "HTTPS://WWW.IKEA.PT",
    certifications: ["FSC", "GRS", "OEKO-TEX", "ASC", "MSC"]
  },
  {
    id: "leroy-merlin",
    name: "LEROY MERLIN",
    logo: "/logo-leroy.png",
    description: "MATERIAIS DE CONSTRUÇÃO E BRICOLAGE",
    website: "HTTPS://WWW.LEROYMERLIN.PT",
    certifications: ["FSC", "PEFC", "BREEAM IN-USE"]
  },
  {
    id: "homa",
    name: "HOMA",
    logo: "/logo-homa.png",
    description: "MOBILIÁRIO CONTEMPORÂNEO COM DESIGN INOVADOR",
    website: "HTTPS://WWW.HOMA.PT",
    certifications: ["FSC","GRS", "OEKO-TEX"]
  },
  {
    id: "beliani",
    name: "BELIANI",
    logo: "/logo-beliani.png",
    description: "MOBILIÁRIO CONTEMPORÂNEO COM DESIGN INOVADOR",
    website: "HTTPS://WWW.BELIANI.PT",
    certifications: []
  },
  {
    id: "sklum",
    name: "SKLUM",
    logo: "/logo-sklum.png",
    description: "MOBILIÁRIO CONTEMPORÂNEO COM DESIGN INOVADOR",
    website: "HTTPS://WWW.SKLUM.PT",
    certifications: ["FSC"]
  },
  {
    id: "paumarc",
    name: "PAUMARC",
    logo: "/logo-paumarc.png",
    description: "PAVIMENTOS E MADEIRAS",
    phone: "+351 917 871 746",
    email: "comercial@paumarc.pt",
    website: "HTTPS://WWW.PAUMARC.PT",
    certifications: ["FSC", "PEFC", "DAP"]
  },
  {
    id: "ecart",
    name: "EÇART",
    logo: "/logo-ecart.png",
    description: "DESIGN",
    website: "HTTPS://WWW.ECARTDESIGN.PT",
    certifications: []
  },
  {
    id: "decorestudio",
    name: "DECORESTUDIO",
    logo: "/logo-decorestudio.png",
    description: "PUBLICIDADE E COMUNICAÇÃO",
    phone: "+351 919 108 122",
    email: "decorestudio.publi@gmail.com",
    certifications: []
  },
  {
    id: "r2",
    name: "R2",
    logo: "/logo-r2.png",
    description: "PUBLICIDADE E COMUNICAÇÃO",
    phone: "+351 964 769 567",
    email: "comercial@reclamo2000.pt",
    website: "HTTPS://WWW.RECLAMO2000.PT",
    certifications: ["ISO 9001", "IPAC"]
  },
  {
    id: "webclinic",
    name: "WEBCLINIC",
    logo: "/logo-webclinic.png",
    description: "PUBLICIDADE E COMUNICAÇÃO",
    website: "HTTPS://WWW.WEBCLINIC.PT",
    certifications: []
  },
  {
    id: "decotirso",
    name: "DECOTIRSO",
    logo: "/logo-decotirso.png",
    description: "MOBILIÁRIO CONTEMPORÂNEO COM DESIGN INOVADOR",
    phone: "+351 915 214 508",
    email: "comercial@decotirso.com",
    website: "HTTPS://WWW.DECOTIRSO.COM",
    certifications: ["ISO 9001"]
  },
  {
    id: "citymover",
    name: "CITYMOVER",
    logo: "/logo-citymover.png",
    description: "ARMAZENAMENTO E LOGÍSTICA",
    website: "HTTPS://WWW.CITYMOVER.PT",
    certifications: ["EURO 6"]
  },
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
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)

  // Duplicate suppliers for infinite loop
  const duplicatedSuppliers = [...suppliers, ...suppliers]

  return (
    <>
      <section className="px-6 lg:px-10 py-20 lg:py-28 border-b border-border/20">
        <div className="mb-12">
          <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-4">
            PARCEIROS
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl tracking-[0.05em] uppercase text-foreground">
            FORNECEDORES CERTIFICADOS
          </h2>
          <p className="mt-4 text-sm tracking-[0.2em] uppercase text-muted-foreground max-w-2xl leading-relaxed">
            GARANTEM QUALIDADE, FIABILIDADE E SUSTENTABILIDADE
          </p>
        </div>

        {/* CARROSSEL HORIZONTAL CONTÍNUO COM SCROLL MANUAL */}
        <div className="relative overflow-hidden">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide animate-scroll-x">
            {duplicatedSuppliers.map((supplier, index) => (
              <Button
                key={`${supplier.id}-${index}`}
                variant="outline"
                onClick={() => setSelectedSupplier(supplier)}
                className="h-auto w-48 flex-shrink-0 p-6 flex flex-col items-center gap-4 bg-background border-border/40 hover:border-[#0099CC] hover:bg-[#0099CC]/5 transition-all duration-300 group aspect-video"
              >
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center group-hover:bg-[#0099CC]/10 transition-colors">
                  <img src={supplier.logo} alt={supplier.name} className="w-12 h-12 object-contain" />
                </div>
                <div className="text-center w-full">
                  <h3 className="text-sm tracking-[0.2em] uppercase text-foreground group-hover:text-[#0099CC] transition-colors">
                    {supplier.name}
                  </h3>
                  <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground mt-1 line-clamp-3 w-full">
                    {supplier.description}
                  </p>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </section>

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
