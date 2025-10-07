import type {
  ApiResponse,
  CreateMedicationRequest,
  PatientMedicationResponse,
  UpdateMedicationRequest,
} from "../../types/patientDashboard";
import { api, ENDPOINTS } from "../../utils/dashboardApi";

export class MedicationsService {
  private getBasePath(patientId: string) {
    return `${ENDPOINTS.PATIENT}/${patientId}/medications`;
  }

  async addMedication(
    patientId: string,
    request: CreateMedicationRequest
  ): Promise<PatientMedicationResponse> {
    try {
      const response = await api.post<ApiResponse<PatientMedicationResponse>>(
        this.getBasePath(patientId),
        request
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error adding medication for patient ${patientId}:`, error);
      throw error;
    }
  }

  async updateMedication(
    patientId: string,
    medicationId: string,
    request: UpdateMedicationRequest
  ): Promise<PatientMedicationResponse> {
    try {
      const response = await api.put<ApiResponse<PatientMedicationResponse>>(
        `${this.getBasePath(patientId)}/${medicationId}`,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error(
        `Error updating medication ${medicationId} for patient ${patientId}:`,
        error
      );
      throw error;
    }
  }

  async partialUpdateMedication(
    patientId: string,
    medicationId: string,
    request: UpdateMedicationRequest
  ): Promise<PatientMedicationResponse> {
    try {
      const response = await api.patch<ApiResponse<PatientMedicationResponse>>(
        `${this.getBasePath(patientId)}/${medicationId}`,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error(
        `Error partially updating medication ${medicationId} for patient ${patientId}:`,
        error
      );
      throw error;
    }
  }

  async updateMedicationStatus(
    patientId: string,
    medicationId: string,
    status: string
  ): Promise<PatientMedicationResponse> {
    try {
      const response = await api.put<ApiResponse<PatientMedicationResponse>>(
        `${this.getBasePath(patientId)}/${medicationId}/status`,
        null,
        { params: { status } }
      );
      return response.data.data;
    } catch (error) {
      console.error(
        `Error updating status for medication ${medicationId} for patient ${patientId}:`,
        error
      );
      throw error;
    }
  }

  async deleteMedication(
    patientId: string,
    medicationId: string
  ): Promise<string> {
    try {
      const response = await api.delete<ApiResponse<string>>(
        `${this.getBasePath(patientId)}/${medicationId}`
      );
      return response.data.data;
    } catch (error) {
      console.error(
        `Error deleting medication ${medicationId} for patient ${patientId}:`,
        error
      );
      throw error;
    }
  }
}

export const medicationsService = new MedicationsService();
