import type {
  ApiResponse,
  CreateSymptomTrackerRequest,
  SymptomTrackerResponse,
  UpdateSymptomTrackerRequest,
} from "../../types/patientDashboard";
import { api, ENDPOINTS } from "../../utils/dashboardApi";

export class SymptomsService {
  private getBasePath(patientId: string) {
    return `${ENDPOINTS.PATIENT}/${patientId}/symptoms`;
  }

  async recordSymptom(
    patientId: string,
    request: CreateSymptomTrackerRequest
  ): Promise<SymptomTrackerResponse> {
    try {
      const response = await api.post<ApiResponse<SymptomTrackerResponse>>(
        this.getBasePath(patientId),
        request
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error recording symptom for patient ${patientId}:`, error);
      throw error;
    }
  }

  async updateSymptom(
    patientId: string,
    symptomId: string,
    request: UpdateSymptomTrackerRequest
  ): Promise<SymptomTrackerResponse> {
    try {
      const response = await api.put<ApiResponse<SymptomTrackerResponse>>(
        `${this.getBasePath(patientId)}/${symptomId}`,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error(
        `Error updating symptom ${symptomId} for patient ${patientId}:`,
        error
      );
      throw error;
    }
  }

  async partialUpdateSymptom(
    patientId: string,
    symptomId: string,
    request: UpdateSymptomTrackerRequest
  ): Promise<SymptomTrackerResponse> {
    try {
      const response = await api.patch<ApiResponse<SymptomTrackerResponse>>(
        `${this.getBasePath(patientId)}/${symptomId}`,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error(
        `Error partially updating symptom ${symptomId} for patient ${patientId}:`,
        error
      );
      throw error;
    }
  }

  async deleteSymptom(patientId: string, symptomId: string): Promise<string> {
    try {
      const response = await api.delete<ApiResponse<string>>(
        `${this.getBasePath(patientId)}/${symptomId}`
      );
      return response.data.data;
    } catch (error) {
      console.error(
        `Error deleting symptom ${symptomId} for patient ${patientId}:`,
        error
      );
      throw error;
    }
  }
}

export const symptomsService = new SymptomsService();
