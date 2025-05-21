import axios from "axios"
import type { MedicineResponseDTO, ApiResponse } from "../types/pharmacy"

// Base URL for API
const API_URL = "http://localhost:8080/api/v1/pharmacy/medicine"

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

export const getAllMedicines = async (): Promise<MedicineResponseDTO[]> => {
  try {
    const response = await api.get<ApiResponse<MedicineResponseDTO[]>>("")
    return response.data.data
  } catch (error) {
    console.error("Error fetching all medicines:", error)
    throw error
  }
}

// Fetch medicine by ID
export const getMedicineById = async (id: string): Promise<MedicineResponseDTO> => {
  try {
    const response = await api.get<ApiResponse<MedicineResponseDTO>>(`/${id}`)
    return response.data.data
  } catch (error) {
    console.error(`Error fetching medicine with ID ${id}:`, error)
    throw error
  }
}

// Search medicines
export const searchMedicines = async (query: string): Promise<MedicineResponseDTO[]> => {
  try {
    const response = await api.get<ApiResponse<MedicineResponseDTO[]>>(`/search?query=${query}`)
    return response.data.data
  } catch (error) {
    console.error(`Error searching medicines with query ${query}:`, error)
    throw error
  }
}

export const fetchMedicinesByCategory = async (
  category: string,
): Promise<MedicineResponseDTO[]> => {
  try {
    const response = await api.get(`/filter?category=${category}`)
    return response.data.data
  } catch (error) {
    console.error(`Error fetching medicines for category ${category}:`, error)
    throw error
  }
}


