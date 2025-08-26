import type {
  ApiResponse,
  CreateMedicalHistoryRequest,
  MedicalHistoryResponse,
  PageResponse,
} from "../../../types/dashboard";
import { api } from "../../../utils/dashboardApi";

export class MedicalHistoryService {
  private readonly basePath = "/medical-history";

  async getPatientMedicalHistory(
    page = 0,
    size = 10
  ): Promise<PageResponse<MedicalHistoryResponse>> {
    try {
      const response = await api.get<
        ApiResponse<PageResponse<MedicalHistoryResponse>>
      >(this.basePath, {
        params: { page, size },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching medical history:", error);
      throw error;
    }
  }

  async getActiveMedicalHistory(): Promise<MedicalHistoryResponse[]> {
    try {
      const response = await api.get<ApiResponse<MedicalHistoryResponse[]>>(
        `${this.basePath}/active`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching active medical history:", error);
      throw error;
    }
  }

  async addMedicalHistory(
    request: CreateMedicalHistoryRequest
  ): Promise<MedicalHistoryResponse> {
    try {
      const response = await api.post<ApiResponse<MedicalHistoryResponse>>(
        this.basePath,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error("Error adding medical history:", error);
      throw error;
    }
  }

  async updateMedicalHistory(
    historyId: string,
    request: CreateMedicalHistoryRequest
  ): Promise<MedicalHistoryResponse> {
    try {
      const response = await api.put<ApiResponse<MedicalHistoryResponse>>(
        `${this.basePath}/${historyId}`,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error updating medical history ${historyId}:`, error);
      throw error;
    }
  }

  async deleteMedicalHistory(historyId: string): Promise<string> {
    try {
      const response = await api.delete<ApiResponse<string>>(
        `${this.basePath}/${historyId}`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error deleting medical history ${historyId}:`, error);
      throw error;
    }
  }

  async searchMedicalHistory(query: string): Promise<MedicalHistoryResponse[]> {
    try {
      const response = await api.get<ApiResponse<MedicalHistoryResponse[]>>(
        `${this.basePath}/search`,
        {
          params: { query },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error(
        `Error searching medical history with query ${query}:`,
        error
      );
      throw error;
    }
  }

  async getMedicalHistoryById(
    historyId: string
  ): Promise<MedicalHistoryResponse> {
    try {
      const response = await api.get<ApiResponse<MedicalHistoryResponse>>(
        `${this.basePath}/${historyId}`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching medical history ${historyId}:`, error);
      throw error;
    }
  }
}

export const medicalHistoryService = new MedicalHistoryService();
