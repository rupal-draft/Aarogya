import type {
  ApiResponse,
  CreateMedicalHistoryRequest,
  MedicalHistoryResponse,
} from "../../types/patientDashboard";
import { api, ENDPOINTS } from "../../utils/dashboardApi";

export class MedicalHistoryService {
  private getBasePath(patientId: string) {
    return `${ENDPOINTS.PATIENT}/${patientId}/medical-history`;
  }

  async addMedicalHistory(
    patientId: string,
    request: CreateMedicalHistoryRequest
  ): Promise<MedicalHistoryResponse> {
    try {
      const response = await api.post<ApiResponse<MedicalHistoryResponse>>(
        this.getBasePath(patientId),
        request
      );
      return response.data.data;
    } catch (error) {
      console.error(
        `Error adding medical history for patient ${patientId}:`,
        error
      );
      throw error;
    }
  }

  async updateMedicalHistory(
    patientId: string,
    historyId: string,
    request: CreateMedicalHistoryRequest
  ): Promise<MedicalHistoryResponse> {
    try {
      const response = await api.put<ApiResponse<MedicalHistoryResponse>>(
        `${this.getBasePath(patientId)}/${historyId}`,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error(
        `Error updating medical history ${historyId} for patient ${patientId}:`,
        error
      );
      throw error;
    }
  }

  async deleteMedicalHistory(
    patientId: string,
    historyId: string
  ): Promise<string> {
    try {
      const response = await api.delete<ApiResponse<string>>(
        `${this.getBasePath(patientId)}/${historyId}`
      );
      return response.data.data;
    } catch (error) {
      console.error(
        `Error deleting medical history ${historyId} for patient ${patientId}:`,
        error
      );
      throw error;
    }
  }
}

export const medicalHistoryService = new MedicalHistoryService();
