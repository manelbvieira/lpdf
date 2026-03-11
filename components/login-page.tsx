"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, ArrowRight } from "lucide-react"

interface LoginPageProps {
  onLogin: (password: string) => boolean
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    setTimeout(() => {
      const success = onLogin(password)
      if (!success) {
        setError("Password incorreta. Tente novamente.")
        setPassword("")
      }
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/space-street.png"
          alt="Doutor Finanças - Loja modelo"
          className="absolute inset-0 w-full h-full object-cover ken-burns"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Minimal top bar */}
        <div>
          <div className="mx-auto max-w-7xl px-6 lg:px-8 h-16 flex items-center justify-between">
            <img 
              src="/logo-df.png" 
              alt="Doutor Finanças" 
              className="h-8 w-auto"
            />
            <span className="text-sm font-bold tracking-[0.2em] uppercase text-white">
              REDE DOUTOR FINANÇAS
            </span>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-sm bg-white/10 backdrop-blur-[25px] border border-white/20 rounded-xl p-8">
            <div className="mb-12">
              <p className="text-[10px] tracking-widest uppercase text-white mb-4">
                ACESSO RESTRITO
              </p>
              <div className="relative">
                <h1 className="text-3xl sm:text-4xl leading-tight tracking-tight text-white font-serif font-light">
                  Catálogo interativo
                </h1>
                <p className="mt-4 text-sm text-white leading-relaxed">
                  Introduza a password para aceder ao catálogo de materiais e mobiliário
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="password" className="text-[10px] tracking-widest uppercase text-white">
                  PASSWORD
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Introduza a password"
                    className={`h-12 bg-transparent border-0 border-b border-gray-300/50 focus:border-[#0099CC] focus:ring-0 rounded-none text-white placeholder:text-white/50 transition-all duration-300 ${error ? "border-red-400" : ""}`}
                    disabled={isLoading}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {error && <p className="text-xs text-destructive mt-1">{error}</p>}
              </div>

              <Button
                type="submit"
                disabled={isLoading || !password}
                className="w-full h-12 rounded-none bg-[#0099CC] hover:bg-[#007aa3] hover:scale-[1.03] text-white text-xs tracking-widest uppercase transition-all duration-300"
              >
                {isLoading ? "A verificar..." : (
                  <span className="flex items-center justify-center gap-2">
                    ENTRAR
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            <p className="text-[10px] text-white mt-8 tracking-wide">
              Este conteúdo é privado e requer autenticação
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer>
          <div className="px-6 lg:px-10 py-16 lg:py-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-white mb-4">
                  Contacto
                </p>
                <p className="text-sm text-white leading-relaxed">
                  facilities.experience@doutorfinancas.pt</p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-white mb-4">
                  Informação
                </p>
                <p className="text-sm text-white leading-relaxed">
                  Os preços apresentados não incluem IVA e podem estar desatualizados</p>
              </div>
              <div className="md:text-right">
                <p className="text-[10px] tracking-[0.3em] uppercase text-white mb-4">
                  Rede Doutor Finanças
                </p>
                <p className="text-sm text-white leading-relaxed">
                  Catálogo de mobiliário e materiais</p>
                <p className="text-xs text-white mt-1"> </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
