import type { AppointmentStatus, AppointmentType } from "../Data/enums/Appointment"

  export interface AppointmentRequestDto {
    doctorId: string
    appointmentDate: string
    startTime: string
    endTime: string
    type?: AppointmentType
    reason: string
    symptoms?: string[]
    priority: number
    isVirtual?: boolean
  }

  export interface EmergencyAppointmentDto {
    symptoms: string[]
    emergencyDescription: string
    preferredSpecialization?: string
    priority?: number
  }

  export interface PatientResponseDTO {
    id: string
    email: string
    firstName: string
    lastName: string
    phone: string
    dateOfBirth: string
    gender: string
    address: string
    imageUrl: string
  }

  export interface AppointmentResponseDto {
    id: string
    appointmentDate: string
    startTime: string
    endTime: string
    status: AppointmentStatus
    type: AppointmentType
    reason?: string
    symptoms?: string[]
    notes?: string
    doctorNotes?: string
    priority: number
    meetingLink?: string
    isVirtual: boolean
    cancellationReason?: string
    createdAt: string
    updatedAt: string
    doctor: any
    patientDetails: PatientResponseDTO
  }

  export interface ApiResponse<T> {
    success: boolean
    data: T
    message?: string
  }

  export interface PageResponse<T> {
    content: T[]
    totalElements: number
    totalPages: number
    size: number
    number: number
  }
