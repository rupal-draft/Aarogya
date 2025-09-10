import type {
  ApiResponse,
  DiseaseHistoryResponse,
  CreateDiseaseHistoryRequest,
  UpdateDiseaseHistoryRequest,
} from "../../types/patientDashboard";
import { api } from "../../utils/dashboardApi";

export class DiseaseHistoryService {
  private readonly basePath = "/disease-history";

  async createDiseaseHistory(
    request: CreateDiseaseHistoryRequest
  ): Promise<DiseaseHistoryResponse> {
    try {
      const response = await api.post<ApiResponse<DiseaseHistoryResponse>>(
        this.basePath,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error("Error creating disease history:", error);
      throw error;
    }
  }

  async updateDiseaseHistory(
    diseaseId: string,
    request: UpdateDiseaseHistoryRequest
  ): Promise<DiseaseHistoryResponse> {
    try {
      const response = await api.put<ApiResponse<DiseaseHistoryResponse>>(
        `${this.basePath}/${diseaseId}`,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error updating disease ${diseaseId}:`, error);
      throw error;
    }
  }

  async deleteDiseaseHistory(diseaseId: string): Promise<string> {
    try {
      const response = await api.delete<ApiResponse<string>>(
        `${this.basePath}/${diseaseId}`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error deleting disease ${diseaseId}:`, error);
      throw error;
    }
  }
}

export const diseaseHistoryService = new DiseaseHistoryService();
