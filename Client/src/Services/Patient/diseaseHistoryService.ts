import type {
  ApiResponse,
  DiseaseHistoryResponse,
  CreateDiseaseHistoryRequest,
  UpdateDiseaseHistoryRequest,
} from "../../types/patientDashboard";
import { api, ENDPOINTS } from "../../utils/dashboardApi";

export class DiseaseHistoryService {
  private getBasePath(patientId: string) {
    return `${ENDPOINTS.PATIENT}/${patientId}/disease-history`;
  }

  async createDiseaseHistory(
    patientId: string,
    request: CreateDiseaseHistoryRequest
  ): Promise<DiseaseHistoryResponse> {
    try {
      const response = await api.post<ApiResponse<DiseaseHistoryResponse>>(
        this.getBasePath(patientId),
        request
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error creating disease history for ${patientId}:`, error);
      throw error;
    }
  }

  async updateDiseaseHistory(
    patientId: string,
    diseaseId: string,
    request: UpdateDiseaseHistoryRequest
  ): Promise<DiseaseHistoryResponse> {
    try {
      const response = await api.put<ApiResponse<DiseaseHistoryResponse>>(
        `${this.getBasePath(patientId)}/${diseaseId}`,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error updating disease ${diseaseId}:`, error);
      throw error;
    }
  }

  async partialUpdateDiseaseHistory(
    patientId: string,
    diseaseId: string,
    request: UpdateDiseaseHistoryRequest
  ): Promise<DiseaseHistoryResponse> {
    try {
      const response = await api.patch<ApiResponse<DiseaseHistoryResponse>>(
        `${this.getBasePath(patientId)}/${diseaseId}`,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error partially updating disease ${diseaseId}:`, error);
      throw error;
    }
  }

  async deleteDiseaseHistory(
    patientId: string,
    diseaseId: string
  ): Promise<string> {
    try {
      const response = await api.delete<ApiResponse<string>>(
        `${this.getBasePath(patientId)}/${diseaseId}`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error deleting disease ${diseaseId}:`, error);
      throw error;
    }
  }
}

export const diseaseHistoryService = new DiseaseHistoryService();
