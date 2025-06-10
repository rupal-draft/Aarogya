import axios from "axios"
import type { Cart } from "../types/cart"

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

// Base URL for API
const API_URL = "http://localhost:8080/api/v1/pharmacy/cart"

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})


// Helper function to extract data from API response
const extractData = <T>(response: any): T => {
  // Check if the response has the expected structure
  if (response.data && response.data.data !== undefined) {
    return response.data.data;
  }
  return response.data
}

// Get current user's cart
export const getCart = async (): Promise<Cart> => {
  try {
    const response = await api.get('')
    return extractData<Cart>(response)
  } catch (error: any) {
    console.error('Error fetching cart:', error)
    throw error
  }
}

// Add item to cart
export const addToCart = async (medicineId: string, quantity: number = 1): Promise<Cart> => {
  try {
    const response = await api.post('/add', { medicineId, quantity })
    return extractData<Cart>(response)
  } catch (error: any) {
    console.error('Error adding item to cart:', error)
    throw error
  }
}

// Update cart item quantity
export const updateCartItem = async (medicineId: string, quantity: number): Promise<Cart> => {
  try {
    const response = await api.put('/update', { medicineId, quantity })
    return extractData<Cart>(response)
  } catch (error: any) {
    console.error(`Error updating cart item ${medicineId}:`, error)
    throw error
  }
}

// Remove item from cart
export const removeFromCart = async (medicineId: string): Promise<ApiResponse<string>> => {
  try {
    const response = await api.delete(`/remove/${medicineId}`)
    return extractData<ApiResponse<string>>(response)
  } catch (error: any) {
    console.error(`Error removing item ${medicineId} from cart:`, error)
    throw error
  }
}

// Clear cart
export const clearCart = async (): Promise<ApiResponse<null>> => {
  try {
    const cart = await getCart()
    const promises = cart.items.map(item => removeFromCart(item.medicineId))
    await Promise.all(promises)

    return { success: true, message: "Cart cleared successfully", data: null }
  } catch (error: any) {
    console.error('Error clearing cart:', error)
    throw error
  }
}
