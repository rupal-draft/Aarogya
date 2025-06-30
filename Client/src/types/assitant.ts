export interface Message {
    role: "user" | "assistant"
    content: string
    timestamp: string
  }

  export interface ChatSession {
    session_id: string
    messages: Message[]
    status: "active" | "completed"
  }

  export interface Disease {
    disease: string
    confidence: number
    risk_level: "low" | "moderate" | "high"
  }

  export interface AIRecommendations {
    disease: string
    risk_level: string
    precautions: string[]
    diet_recommendations: string[]
    lifestyle_modifications: string[]
    symptom_monitoring: string[]
    when_to_seek_care: string[]
    recommended_specialist: string
    treatment_approach: string
    recovery_timeline: string
    urgent_message: string
    doctor_urgency: string
  }

  export interface Consultation {
    consultation_id: string
    user_id: string
    session_id: string
    symptoms: string[]
    predicted_diseases: Disease[]
    ai_recommendations: AIRecommendations
    risk_assessment: string
    doctor_recommendation: string
    created_at: string
  }

  export interface ChatResponse {
    message: string
    next_step?: string
    suggestions?: string[]
    action?: string
    prediction_triggered?: boolean
    consultation_id?: string
    predictions?: Disease[]
    ai_recommendations?: AIRecommendations
  }

  export interface ApiResponse<T> {
    data?: T
    error?: string
    status: number
  }

  export interface HealthStatus {
    status: string
    database: string
    ml_model: string
    ollama_service: string
    timestamp: string
  }
