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
  CreateTemplateRequest,
  TemplateResponse,
  TemplateFilterRequest,
  TemplatePageResponse,
  UpdateTemplateRequest,
  ApplyTemplateRequest,
  DuplicateTemplateRequest,
  CreateCategoryRequest,
  CategoryResponse,
  TemplateStatsResponse,
  TemplateSearchSuggestion,
} from "../types/prescription";

const API_BASE_URL = "http://localhost:8080/api/v1/prescription/core";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const TEMPLATE_BASE_URL = "http://localhost:8080/api/v1/prescription/template";

const templateApi = axios.create({
  baseURL: TEMPLATE_BASE_URL,
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
    return response.data.data;
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
    return response.data.data;
  },

  // Create prescription
  createPrescription: async (
    request: PrescriptionRequest
  ): Promise<Prescription> => {
    const response = await api.post("", request);
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

  // Get prescription
  getPrescription: async (id: string): Promise<Prescription> => {
    const response = await api.get(`/${id}`);
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

export const prescriptionTemplateService = {
  // Create template
  createTemplate: async (
    request: CreateTemplateRequest
  ): Promise<TemplateResponse> => {
    const response = await templateApi.post("", request);
    return response.data.data;
  },

  // Get template
  getTemplate: async (templateId: string): Promise<TemplateResponse> => {
    const response = await templateApi.get(`/${templateId}`);
    return response.data.data;
  },

  // Get templates with filtering
  getTemplates: async (
    filter: TemplateFilterRequest,
    page: number = 0,
    size: number = 20,
    sortBy: string = "name",
    sortOrder: string = "ASC"
  ): Promise<TemplatePageResponse> => {
    const params = {
      ...filter,
      page,
      size,
      sortBy,
      sortOrder,
    };
    const response = await templateApi.get("", { params });
    return response.data.data;
  },

  // Update template
  updateTemplate: async (
    templateId: string,
    request: UpdateTemplateRequest
  ): Promise<TemplateResponse> => {
    const response = await templateApi.put(`/${templateId}`, request);
    return response.data.data;
  },

  // Delete template
  deleteTemplate: async (templateId: string): Promise<void> => {
    await templateApi.delete(`/${templateId}`);
  },

  // Apply template
  applyTemplate: async (request: ApplyTemplateRequest): Promise<any> => {
    const response = await templateApi.post("/apply", request);
    return response.data.data;
  },

  // Duplicate template
  duplicateTemplate: async (
    templateId: string,
    request: DuplicateTemplateRequest
  ): Promise<TemplateResponse> => {
    const response = await templateApi.post(
      `/${templateId}/duplicate`,
      request
    );
    return response.data.data;
  },

  // Toggle favorite
  toggleFavorite: async (templateId: string): Promise<TemplateResponse> => {
    const response = await templateApi.post(`/${templateId}/favorite`);
    return response.data.data;
  },

  // Create category
  createCategory: async (
    request: CreateCategoryRequest
  ): Promise<CategoryResponse> => {
    const response = await templateApi.post("/categories", request);
    return response.data.data;
  },

  // Get categories
  getCategories: async (): Promise<CategoryResponse[]> => {
    const response = await templateApi.get("/categories");
    return response.data.data;
  },

  // Delete category
  deleteCategory: async (categoryId: string): Promise<void> => {
    await templateApi.delete(`/categories/${categoryId}`);
  },

  // Get template stats
  getTemplateStats: async (): Promise<TemplateStatsResponse> => {
    const response = await templateApi.get("/stats");
    return response.data.data;
  },

  // Get template suggestions
  getTemplateSuggestions: async (): Promise<TemplateSearchSuggestion> => {
    const response = await templateApi.get("/suggestions");
    return response.data.data;
  },
};
