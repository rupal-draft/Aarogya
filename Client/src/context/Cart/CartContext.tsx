"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Cart } from "../../types/cart"
import { addToCart, clearCart, getCart, removeFromCart, updateCartItem } from "../../Services/cartService"


interface CartContextType {
  cart: Cart | null
  loading: boolean
  error: string | null
  addItem: (medicineId: string, quantity: number) => Promise<void>
  updateItem: (medicineId: string, quantity: number) => Promise<void>
  removeItem: (medicineId: string) => Promise<void>
  clearItems: () => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

interface CartProviderProps {
  children: ReactNode
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch cart on component mount
  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      setLoading(true)
      setError(null)
      const cartData = await getCart()
      setCart(cartData)
    } catch (err) {
      console.error("Error fetching cart:", err)
      setError("Failed to load your cart. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const addItem = async (medicineId: string, quantity: number) => {
    try {
      setLoading(true)
      setError(null)
      const updatedCart = await addToCart(medicineId, quantity)
      setCart(updatedCart)
    } catch (err) {
      console.error("Error adding item to cart:", err)
      setError("Failed to add item to cart. Please try again.")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateItem = async (medicineId: string, quantity: number) => {
    try {
      setLoading(true)
      setError(null)
      const updatedCart = await updateCartItem(medicineId, quantity)
      setCart(updatedCart)
    } catch (err) {
      console.error("Error updating cart item:", err)
      setError("Failed to update cart item. Please try again.")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const removeItem = async (medicineId: string) => {
    try {
      setLoading(true)
      setError(null)
      await removeFromCart(medicineId)
      // Update local cart state by removing the item
      if (cart) {
        const updatedItems = cart.items.filter((item) => item.medicineId !== medicineId)
        const updatedTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        const updatedTotalAmount = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

        setCart({
          ...cart,
          items: updatedItems,
          totalItems: updatedTotalItems,
          totalAmount: updatedTotalAmount,
        })
      }
    } catch (err) {
      console.error("Error removing item from cart:", err)
      setError("Failed to remove item from cart. Please try again.")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const clearItems = async () => {
    try {
      setLoading(true)
      setError(null)
      await clearCart()
      // Reset cart to empty state
      if (cart) {
        setCart({
          ...cart,
          items: [],
          totalItems: 0,
          totalAmount: 0,
        })
      }
    } catch (err) {
      console.error("Error clearing cart:", err)
      setError("Failed to clear cart. Please try again.")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const refreshCart = async () => {
    await fetchCart()
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        addItem,
        updateItem,
        removeItem,
        clearItems,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
