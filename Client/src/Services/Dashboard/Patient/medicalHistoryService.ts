import type {
  ApiResponse,
  CreateMedicalHistoryRequest,
  MedicalHistoryResponse,
} from "../../../types/patientDashboard";
import { api } from "../../../utils/dashboardApi";

export class MedicalHistoryService {
  private readonly basePath = "/medical-history";

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
}

export const medicalHistoryService = new MedicalHistoryService();
