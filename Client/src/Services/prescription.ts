import axios from "axios";
import type {
  Prescription,
  PrescriptionResponse,
  MedicineDto,
  MedicineSearchRequest,
  MedicineSearchResponse,
  MedicineInteractionCheck,
  PrescriptionRequest,
  AddMedicineRequest,
  RemoveMedicineRequest,
} from "../types/prescription";

const API_BASE_URL = "http://localhost:8080/api/v1/prescription/core";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const prescriptionService = {
  // Get patient prescriptions
  getPatientPrescriptions: async (
    patientId: string
  ): Promise<PrescriptionResponse> => {
    const response = await api.get(`/patient/${patientId}`);
    return response.data;
  },

  // Search medicines
  searchMedicines: async (
    request: MedicineSearchRequest
  ): Promise<MedicineSearchResponse> => {
    const params = new URLSearchParams();
    if (request.name) params.append("name", request.name);
    if (request.chemicalClass)
      params.append("chemicalClass", request.chemicalClass);
    if (request.therapeuticClass)
      params.append("therapeuticClass", request.therapeuticClass);
    if (request.actionClass) params.append("actionClass", request.actionClass);
    params.append("page", (request.page || 0).toString());
    params.append("size", (request.size || 10).toString());

    const response = await api.get(`/medicines/search?${params.toString()}`);
    return response.data;
  },

  // Get medicine details
  getMedicineDetails: async (medicineId: string): Promise<MedicineDto> => {
    const response = await api.get(`/medicines/${medicineId}`);
    return response.data;
  },

  // Check medicine interactions
  checkInteractions: async (
    medicineIds: string[]
  ): Promise<MedicineInteractionCheck[]> => {
    const response = await api.post("/check-interactions", medicineIds);
    return response.data;
  },

  // Create prescription
  createPrescription: async (
    request: PrescriptionRequest
  ): Promise<Prescription> => {
    const response = await api.post("/", request);
    return response.data;
  },

  // Get prescription
  getPrescription: async (id: string): Promise<Prescription> => {
    const response = await api.get(`/${id}`);
    return response.data;
  },

  // Update prescription
  updatePrescription: async (
    id: string,
    request: PrescriptionRequest
  ): Promise<Prescription> => {
    const response = await api.put(`/${id}`, request);
    return response.data;
  },

  // Delete prescription
  deletePrescription: async (id: string): Promise<void> => {
    await api.delete(`/${id}`);
  },

  // Add medicine to prescription
  addMedicineToPrescription: async (
    prescriptionId: string,
    request: AddMedicineRequest
  ): Promise<Prescription> => {
    const response = await api.post(`/${prescriptionId}/medicines`, request);
    return response.data;
  },

  // Remove medicine from prescription
  removeMedicineFromPrescription: async (
    prescriptionId: string,
    request: RemoveMedicineRequest
  ): Promise<Prescription> => {
    const response = await api.delete(`/${prescriptionId}/medicines`, {
      data: request,
    });
    return response.data;
  },

  // Partial update prescription
  partialUpdatePrescription: async (
    id: string,
    updates: Record<string, any>
  ): Promise<Prescription> => {
    const response = await api.patch(`/${id}`, updates);
    return response.data;
  },
};
