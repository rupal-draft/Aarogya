import type {
  ApiResponse,
  CreateVitalsRequest,
  PageResponse,
  PatientVitalsResponse,
  UpdateVitalsRequest,
  VitalsStatsResponse,
} from "../../../types/dashboard";
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

  async getPatientVitals(
    page = 0,
    size = 10
  ): Promise<PageResponse<PatientVitalsResponse>> {
    try {
      const response = await api.get<
        ApiResponse<PageResponse<PatientVitalsResponse>>
      >(this.basePath, {
        params: { page, size },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching patient vitals:", error);
      throw error;
    }
  }

  async getLatestVitals(): Promise<PatientVitalsResponse> {
    try {
      const response = await api.get<ApiResponse<PatientVitalsResponse>>(
        `${this.basePath}/latest`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching latest vitals:", error);
      throw error;
    }
  }

  async getVitalsStats(days: number): Promise<VitalsStatsResponse> {
    try {
      const response = await api.get<ApiResponse<VitalsStatsResponse>>(
        `${this.basePath}/stats`,
        {
          params: { days },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching vitals stats:", error);
      throw error;
    }
  }

  async getVitalsTrends(
    startDate: string,
    endDate: string
  ): Promise<PatientVitalsResponse[]> {
    try {
      const response = await api.get<ApiResponse<PatientVitalsResponse[]>>(
        `${this.basePath}/trends`,
        {
          params: { startDate, endDate },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching vitals trends:", error);
      throw error;
    }
  }

  async getVitalsById(vitalsId: string): Promise<PatientVitalsResponse> {
    try {
      const response = await api.get<ApiResponse<PatientVitalsResponse>>(
        `${this.basePath}/${vitalsId}`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching vitals ${vitalsId}:`, error);
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
