import axios, { type AxiosResponse } from "axios"
import type { ApiResponse, ChatResponse, Consultation, HealthStatus } from "../types/assitant"

const API_BASE_URL = "http://localhost:5000"

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const token = getCookieValue("access_token") || getCookieValue("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Authentication required")
    }
    return Promise.reject(error)
  },
)

function getCookieValue(name: string): string | null {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null
  }
  return null
}

export const api = {
  async checkHealth(): Promise<ApiResponse<HealthStatus>> {
    try {
      const response: AxiosResponse<HealthStatus> = await apiClient.get("/health")
      return { data: response.data, status: response.status }
    } catch (error: any) {
      return { error: error.message, status: error.response?.status || 500 }
    }
  },

  // Chat endpoints
  async startChat(): Promise<ApiResponse<{ session_id: string; message: string; status: string }>> {
    try {
      const response = await apiClient.post("/chat/start")
      return { data: response.data, status: response.status }
    } catch (error: any) {
      return { error: error.response?.data?.error || error.message, status: error.response?.status || 500 }
    }
  },

  async sendMessage(sessionId: string, message: string): Promise<ApiResponse<ChatResponse>> {
    try {
      const response = await apiClient.post("/chat/message", {
        session_id: sessionId,
        message: message,
      })
      return { data: response.data, status: response.status }
    } catch (error: any) {
      return { error: error.response?.data?.error || error.message, status: error.response?.status || 500 }
    }
  },

  async getChatHistory(
    sessionId: string,
  ): Promise<ApiResponse<{ session_id: string; messages: any[]; status: string }>> {
    try {
      const response = await apiClient.get(`/chat/history/${sessionId}`)
      return { data: response.data, status: response.status }
    } catch (error: any) {
      return { error: error.response?.data?.error || error.message, status: error.response?.status || 500 }
    }
  },

  // Medical endpoints
  async predictDisease(
    symptoms: string[],
    sessionId?: string,
  ): Promise<
    ApiResponse<{
      consultation_id: string
      predictions: any[]
      ai_recommendations: any
      risk_assessment: string
      doctor_recommendation: string
    }>
  > {
    try {
      const response = await apiClient.post("/medical/predict", {
        symptoms,
        session_id: sessionId,
      })
      return { data: response.data, status: response.status }
    } catch (error: any) {
      return { error: error.response?.data?.error || error.message, status: error.response?.status || 500 }
    }
  },

  async getConsultation(consultationId: string): Promise<ApiResponse<{ consultation: Consultation }>> {
    try {
      const response = await apiClient.get(`/medical/consultation/${consultationId}`)
      return { data: response.data, status: response.status }
    } catch (error: any) {
      return { error: error.response?.data?.error || error.message, status: error.response?.status || 500 }
    }
  },

  async getMedicalHistory(limit = 10): Promise<ApiResponse<{ consultations: Consultation[]; total: number }>> {
    try {
      const response = await apiClient.get(`/medical/history?limit=${limit}`)
      return { data: response.data, status: response.status }
    } catch (error: any) {
      return { error: error.response?.data?.error || error.message, status: error.response?.status || 500 }
    }
  },
}

export default api
