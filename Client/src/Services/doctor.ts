import axios from "axios";
import type { DoctorResponseDTO } from "../types/doctor";
import type { AvailabilityResponse } from "../types/availability";

const API_BASE_URL = "http://localhost:8080/api/v1/doctors";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Get doctors by specialization
export const getDoctorsBySpecialization = async (
  specialization?: string
): Promise<DoctorResponseDTO[]> => {
  try {
    const params = specialization ? { specialization } : {};
    const response = await api.get("/doctors", {
      baseURL: "http://localhost:8080/api/v1/auth/core",
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};

// Get doctor availability for a specific date
export const getDoctorAvailability = async (
  doctorId: string,
  date: string
): Promise<AvailabilityResponse> => {
  try {
    const response = await api.get(
      `${API_BASE_URL}/availability/${doctorId}/${date}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching doctor availability:", error);
    throw error;
  }
};
