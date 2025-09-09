import type {
  ApiResponse,
  CreateSymptomTrackerRequest,
  SymptomTrackerResponse,
  UpdateSymptomTrackerRequest,
} from "../../../types/patientDashboard";
import { api } from "../../../utils/dashboardApi";

export class SymptomsService {
  private readonly basePath = "/symptoms";

  async recordSymptom(
    request: CreateSymptomTrackerRequest
  ): Promise<SymptomTrackerResponse> {
    try {
      const response = await api.post<ApiResponse<SymptomTrackerResponse>>(
        this.basePath,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error("Error recording symptom:", error);
      throw error;
    }
  }

  async updateSymptom(
    symptomId: string,
    request: UpdateSymptomTrackerRequest
  ): Promise<SymptomTrackerResponse> {
    try {
      const response = await api.put<ApiResponse<SymptomTrackerResponse>>(
        `${this.basePath}/${symptomId}`,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error updating symptom ${symptomId}:`, error);
      throw error;
    }
  }

  async partialUpdateSymptom(
    symptomId: string,
    request: UpdateSymptomTrackerRequest
  ): Promise<SymptomTrackerResponse> {
    try {
      const response = await api.patch<ApiResponse<SymptomTrackerResponse>>(
        `${this.basePath}/${symptomId}`,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error partially updating symptom ${symptomId}:`, error);
      throw error;
    }
  }

  async deleteSymptom(symptomId: string): Promise<string> {
    try {
      const response = await api.delete<ApiResponse<string>>(
        `${this.basePath}/${symptomId}`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error deleting symptom ${symptomId}:`, error);
      throw error;
    }
  }
}

export const symptomsService = new SymptomsService();
