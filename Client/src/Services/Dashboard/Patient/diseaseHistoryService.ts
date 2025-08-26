import type {
  ApiResponse,
  PageResponse,
  DiseaseHistoryResponse,
  CreateDiseaseHistoryRequest,
  UpdateDiseaseHistoryRequest,
} from "../../../types/dashboard";
import { api } from "../../../utils/dashboardApi";

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

  async getDiseaseHistory(
    page = 0,
    size = 10
  ): Promise<PageResponse<DiseaseHistoryResponse>> {
    try {
      const response = await api.get<
        ApiResponse<PageResponse<DiseaseHistoryResponse>>
      >(this.basePath, {
        params: { page, size },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching disease history:", error);
      throw error;
    }
  }

  async getActiveDiseases(): Promise<DiseaseHistoryResponse[]> {
    try {
      const response = await api.get<ApiResponse<DiseaseHistoryResponse[]>>(
        `${this.basePath}/active`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching active diseases:", error);
      throw error;
    }
  }

  async getChronicDiseases(): Promise<DiseaseHistoryResponse[]> {
    try {
      const response = await api.get<ApiResponse<DiseaseHistoryResponse[]>>(
        `${this.basePath}/chronic`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching chronic diseases:", error);
      throw error;
    }
  }

  async getDiseaseHistoryById(
    diseaseId: string
  ): Promise<DiseaseHistoryResponse> {
    try {
      const response = await api.get<ApiResponse<DiseaseHistoryResponse>>(
        `${this.basePath}/${diseaseId}`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching disease ${diseaseId}:`, error);
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
