import axios from "axios";
import type {
  ApiResponse,
  AppointmentRequestDto,
  AppointmentResponseDto,
  EmergencyAppointmentDto,
  PageResponse,
} from "../types/appointment";

const API_BASE_URL = "http://localhost:8080/api/v1/appointment/core";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request regular appointment
export const requestAppointment = async (
  requestDto: AppointmentRequestDto
): Promise<AppointmentResponseDto> => {
  try {
    const response = await api.post<ApiResponse<AppointmentResponseDto>>(
      `${API_BASE_URL}`,
      requestDto
    );
    return response.data.data;
  } catch (error) {
    console.error("Error requesting appointment:", error);
    throw error;
  }
};

// Request emergency appointment
export const requestEmergencyAppointment = async (
  emergencyDto: EmergencyAppointmentDto
): Promise<AppointmentResponseDto> => {
  try {
    const response = await api.post<ApiResponse<AppointmentResponseDto>>(
      `${API_BASE_URL}/appointments/emergency`,
      emergencyDto
    );
    return response.data.data;
  } catch (error) {
    console.error("Error requesting emergency appointment:", error);
    throw error;
  }
};

// Get appointment details
export const getAppointmentDetails = async (
  id: string
): Promise<AppointmentResponseDto> => {
  try {
    const response = await api.get<ApiResponse<AppointmentResponseDto>>(
      `${API_BASE_URL}/appointments/${id}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching appointment details:", error);
    throw error;
  }
};

// Get patient appointments with filters
export const getPatientAppointments = async (
  status?: string,
  date?: string,
  page = 0,
  size = 10
): Promise<PageResponse<AppointmentResponseDto>> => {
  try {
    const params: any = { page, size };
    if (status) params.status = status;
    if (date) params.date = date;

    const response = await api.get<
      ApiResponse<PageResponse<AppointmentResponseDto>>
    >(`${API_BASE_URL}/patient`, { params });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching patient appointments:", error);
    throw error;
  }
};

// Get patient appointments between dates
export const getPatientAppointmentsBetweenDates = async (
  patientId: string,
  startDate: string,
  endDate: string
): Promise<AppointmentResponseDto[]> => {
  try {
    const response = await api.get<ApiResponse<AppointmentResponseDto[]>>(
      `${API_BASE_URL}/appointments/patient/range`,
      {
        params: { patientId, startDate, endDate },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching patient appointments by date range:", error);
    throw error;
  }
};

export const getDoctorAppointments = async (
  status?: string,
  date?: string,
  page = 0,
  size = 10
): Promise<PageResponse<AppointmentResponseDto>> => {
  try {
    const params: any = { page, size };
    if (status) params.status = status;
    if (date) params.date = date;

    const response = await api.get<
      ApiResponse<PageResponse<AppointmentResponseDto>>
    >(`${API_BASE_URL}/doctor`, { params });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    throw error;
  }
};
