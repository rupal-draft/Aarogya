import type {
  ApiResponse,
  CreateVitalsRequest,
  PatientVitalsResponse,
  UpdateVitalsRequest,
} from "../../../types/patientDashboard";
import { api } from "../../../utils/dashboardApi";

export class VitalsService {
  private readonly basePath = "/vitals";

  async recordVitals(
    request: CreateVitalsRequest
  ): Promise<PatientVitalsResponse> {
    try {
      const response = await api.post<ApiResponse<PatientVitalsResponse>>(
        this.basePath,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error("Error recording vitals:", error);
      throw error;
    }
  }
  async updateVitals(
    vitalsId: string,
    request: UpdateVitalsRequest
  ): Promise<PatientVitalsResponse> {
    try {
      const response = await api.put<ApiResponse<PatientVitalsResponse>>(
        `${this.basePath}/${vitalsId}`,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error updating vitals ${vitalsId}:`, error);
      throw error;
    }
  }

  async partialUpdateVitals(
    vitalsId: string,
    request: UpdateVitalsRequest
  ): Promise<PatientVitalsResponse> {
    try {
      const response = await api.patch<ApiResponse<PatientVitalsResponse>>(
        `${this.basePath}/${vitalsId}`,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error partially updating vitals ${vitalsId}:`, error);
      throw error;
    }
  }

  async deleteVitals(vitalsId: string): Promise<string> {
    try {
      const response = await api.delete<ApiResponse<string>>(
        `${this.basePath}/${vitalsId}`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error deleting vitals ${vitalsId}:`, error);
      throw error;
    }
  }
}

export const vitalsService = new VitalsService();
