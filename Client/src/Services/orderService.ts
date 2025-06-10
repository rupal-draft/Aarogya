import axios from "axios"
import type { Order } from "../types/order"



// Base URL for API
const API_URL = "http://localhost:8080/api/v1/pharmacy/order"

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
  if (response.data?.data !== undefined) {
    return response.data.data
  }
  // Fallback to direct response data if structure is different
  return response.data
}

// Get all orders for current user
export const getOrders = async (): Promise<Order[]> => {
  try {
    const response = await api.get('/me')
    return extractData<Order[]>(response)
  } catch (error: any) {
    console.error('Error fetching orders:', error)
    throw error
  }
}

// Get order by ID
export const getOrderById = async (orderId: string): Promise<Order> => {
  try {
    const response = await api.get(`/${orderId}`)
    return extractData<Order>(response)
  } catch (error: any) {
    console.error(`Error fetching order ${orderId}:`, error)
    throw error
  }
}

// Create a new order
export const createOrder = async (
  shippingAddress: string,
  paymentMethod: string,
  items: { medicineId: string, quantity: number }[]
): Promise<Order> => {
  try {
    const orderData = {
      shippingAddress,
      paymentMethod,
      items
    }

    const response = await api.post('', orderData)
    return extractData<Order>(response)
  } catch (error: any) {
    console.error('Error creating order:', error)
    throw error
  }
}

// Create order from cart
export const createOrderFromCart = async (
  shippingAddress: string,
  paymentMethod: string,
  cartItems: { medicineId: string, quantity: number }[]
): Promise<Order> => {
  try {
    const orderData = {
      shippingAddress,
      paymentMethod,
      items: cartItems
    }

    const response = await api.post('/from-cart', orderData)
    return extractData<Order>(response)
  } catch (error: any) {
    console.error('Error creating order from cart:', error)
    throw error
  }
}
