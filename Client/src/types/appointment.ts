import type {
  AppointmentStatus,
  AppointmentType,
} from "../Data/enums/Appointment";
import type { DoctorResponseDTO } from "./doctor";

export interface AppointmentRequestDto {
  doctorId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  type?: AppointmentType;
  reason: string;
  symptoms?: string[];
  priority: number;
  isVirtual?: boolean;
}

export interface EmergencyAppointmentDto {
  symptoms: string[];
  emergencyDescription: string;
  preferredSpecialization?: string;
  priority?: number;
}

export interface PatientResponseDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  imageUrl: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface PatientResponseDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  phone: string;
  address: string;
  imageUrl: string;
  emergencyContact: string;
  emergencyPhone: string;
  createdAt: string;
}

export interface AppointmentResponseDto {
  id: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  type: AppointmentType;
  paymentId: string;
  reason: string;
  symptoms: string[];
  notes: string;
  doctorNotes: string;
  priority: number;
  meetingLink: string;
  isVirtual: boolean;
  cancellationReason: string;
  createdAt: string;
  updatedAt: string;
  patientDetails: PatientResponseDTO;
  doctor: DoctorResponseDTO;
}

export interface ApiResponse<T> {
  data: T;
  error: string | null;
  success: boolean;
  timeStamp: string;
}

export interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface UpdateAppointmentStatusDto {
  status: string;
  notes?: string;
  doctorNotes?: string;
  cancellationReason?: string;
}
