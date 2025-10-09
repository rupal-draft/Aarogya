import axios from "axios";
import type {
  AvailabilityResponse,
  AvailabilityRequest,
  AvailabilityRangeRequest,
  AvailabilityRangeResponse,
  ScheduleResponse,
  ScheduleRequest,
  RecurringUnavailabilityResponse,
  RecurringUnavailabilityRequest,
  SpecialAvailabilityResponse,
  SpecialAvailabilityRequest,
  AvailabilityOverrideResponse,
  AvailabilityOverrideRequest,
  SlotAvailabilityResponse,
  SlotAvailabilityRequest,
} from "../types/availability";

const API_BASE_URL = "http://localhost:8080/api/v1/doctors/availability";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const availabilityService = {
  // Basic availability management
  setAvailability: async (
    request: AvailabilityRequest
  ): Promise<AvailabilityResponse> => {
    const response = await api.post("", request);
    return response.data;
  },

  getAvailability: async (date: string): Promise<AvailabilityResponse> => {
    const response = await api.get(`/${date}`);
    return response.data;
  },

  getAvailabilityRange: async (
    request: AvailabilityRangeRequest
  ): Promise<AvailabilityRangeResponse> => {
    const params = new URLSearchParams();
    params.append("startDate", request.startDate);
    params.append("endDate", request.endDate);
    if (request.includeSlots !== undefined) {
      params.append("includeSlots", request.includeSlots.toString());
    }

    const response = await api.get(`/range?${params.toString()}`);
    return response.data;
  },

  // Schedule management
  getSchedule: async (): Promise<ScheduleResponse> => {
    const response = await api.get("/schedule");
    return response.data;
  },

  updateSchedule: async (
    request: ScheduleRequest
  ): Promise<ScheduleResponse> => {
    const response = await api.put("/schedule", request);
    return response.data;
  },

  // Recurring unavailability
  createRecurringUnavailability: async (
    request: RecurringUnavailabilityRequest
  ): Promise<RecurringUnavailabilityResponse> => {
    const response = await api.post("/recurring-unavailability", request);
    return response.data;
  },

  getRecurringUnavailabilities: async (): Promise<
    RecurringUnavailabilityResponse[]
  > => {
    const response = await api.get("/recurring-unavailability");
    return response.data;
  },

  deleteRecurringUnavailability: async (id: string): Promise<void> => {
    await api.delete(`/recurring-unavailability/${id}`);
  },

  // Special availability
  createSpecialAvailability: async (
    request: SpecialAvailabilityRequest
  ): Promise<SpecialAvailabilityResponse> => {
    const response = await api.post("/special", request);
    return response.data;
  },

  getSpecialAvailabilities: async (): Promise<
    SpecialAvailabilityResponse[]
  > => {
    const response = await api.get("/special");
    return response.data;
  },

  // Availability overrides
  createOverride: async (
    request: AvailabilityOverrideRequest
  ): Promise<AvailabilityOverrideResponse> => {
    const response = await api.post("/override", request);
    return response.data;
  },

  // Slot availability checking
  checkSlotAvailability: async (
    request: SlotAvailabilityRequest
  ): Promise<SlotAvailabilityResponse> => {
    const response = await api.post("/check-slot", request);
    return response.data;
  },

  // Generate availabilities
  generateAvailabilities: async (
    startDate: string,
    endDate: string
  ): Promise<void> => {
    const params = new URLSearchParams();
    params.append("startDate", startDate);
    params.append("endDate", endDate);

    await api.post(`/generate?${params.toString()}`);
  },

  // Update slot booking
  updateSlotBooking: async (
    appointmentId: string,
    date: string,
    startTime: string,
    delta: number = 1
  ): Promise<void> => {
    const params = new URLSearchParams();
    params.append("appointmentId", appointmentId);
    params.append("date", date);
    params.append("startTime", startTime);
    params.append("delta", delta.toString());

    await api.put(`/slot-booking?${params.toString()}`);
  },
};
