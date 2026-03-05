"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { CartItem, FurnitureItem } from "@/lib/furniture-data"

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: FurnitureItem, quantidade?: number) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantidade: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
  getTotalWithoutVAT: () => number
  getVATAmount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const addToCart = useCallback((item: FurnitureItem, quantidade = 1) => {
    setCartItems((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.id === item.id)

      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantidade: cartItem.quantidade + quantidade } : cartItem,
        )
      }

      return [...prev, { ...item, quantidade }]
    })
  }, [])

  const removeFromCart = useCallback((itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId))
  }, [])

  const updateQuantity = useCallback(
    (itemId: string, quantidade: number) => {
      if (quantidade <= 0) {
        removeFromCart(itemId)
        return
      }

      setCartItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantidade } : item)))
    },
    [removeFromCart],
  )

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const getTotalWithoutVAT = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.preco * item.quantidade, 0)
  }, [cartItems])

  const getVATAmount = useCallback(() => {
    const subtotal = getTotalWithoutVAT()
    return subtotal * 0.23 // Add 23% VAT
  }, [getTotalWithoutVAT])

  const getTotalPrice = useCallback(() => {
    const subtotal = getTotalWithoutVAT()
    const vat = getVATAmount()
    return subtotal + vat
  }, [getTotalWithoutVAT, getVATAmount])

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantidade, 0)
  }, [cartItems])

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        getTotalWithoutVAT,
        getVATAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
