import type {
  ApiResponse,
  CreateMedicationRequest,
  PatientMedicationResponse,
  UpdateMedicationRequest,
} from "../../../types/dashboard";
import { api } from "../../../utils/dashboardApi";

export class MedicationsService {
  private readonly basePath = "/medications";

  async addMedication(
    request: CreateMedicationRequest
  ): Promise<PatientMedicationResponse> {
    try {
      const response = await api.post<ApiResponse<PatientMedicationResponse>>(
        this.basePath,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error("Error adding medication:", error);
      throw error;
    }
  }

  async updateMedication(
    medicationId: string,
    request: UpdateMedicationRequest
  ): Promise<PatientMedicationResponse> {
    try {
      const response = await api.put<ApiResponse<PatientMedicationResponse>>(
        `${this.basePath}/${medicationId}`,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error updating medication ${medicationId}:`, error);
      throw error;
    }
  }

  async partialUpdateMedication(
    medicationId: string,
    request: UpdateMedicationRequest
  ): Promise<PatientMedicationResponse> {
    try {
      const response = await api.patch<ApiResponse<PatientMedicationResponse>>(
        `${this.basePath}/${medicationId}`,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error(
        `Error partially updating medication ${medicationId}:`,
        error
      );
      throw error;
    }
  }

  async updateMedicationStatus(
    medicationId: string,
    status: string
  ): Promise<PatientMedicationResponse> {
    try {
      const response = await api.put<ApiResponse<PatientMedicationResponse>>(
        `${this.basePath}/${medicationId}/status`,
        null,
        { params: { status } }
      );
      return response.data.data;
    } catch (error) {
      console.error(
        `Error updating status for medication ${medicationId}:`,
        error
      );
      throw error;
    }
  }

  async deleteMedication(medicationId: string): Promise<string> {
    try {
      const response = await api.delete<ApiResponse<string>>(
        `${this.basePath}/${medicationId}`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error deleting medication ${medicationId}:`, error);
      throw error;
    }
  }
}

export const medicationsService = new MedicationsService();
