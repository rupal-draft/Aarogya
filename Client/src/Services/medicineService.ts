import axios from "axios"
import type { MedicineResponseDTO, ApiResponse } from "../types/medicine"

const API_URL = "http://localhost:8080/api/v1/pharmacy/medicine"

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

export const getMedicineById = async (id: string): Promise<MedicineResponseDTO> => {
  try {
    const response = await api.get<ApiResponse<MedicineResponseDTO>>(`/${id}`)
    return response.data.data
  } catch (error) {
    console.error(`Error fetching medicine with ID ${id}:`, error)
    throw error
  }
}

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

export const searchMedicinesFromPrescription = async (file: File): Promise<MedicineResponseDTO[]> => {
  try {
    const formData = new FormData()
    formData.append("file", file)

    const response = await api.post("/upload-prescription", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    return response.data.data
  } catch (error) {
    console.error("Error uploading prescription:", error)
    throw error
  }
}
