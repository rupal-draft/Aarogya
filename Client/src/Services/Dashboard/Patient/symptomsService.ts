import type {
  ApiResponse,
  CreateSymptomTrackerRequest,
  PageResponse,
  SymptomStatsResponse,
  SymptomTrackerResponse,
  UpdateSymptomTrackerRequest,
} from "../../../types/dashboard";
import { api } from "../../../utils/dashboardApi";

export class SymptomsService {
  private readonly basePath = "/symptoms";

  async getPatientSymptoms(
    page = 0,
    size = 10
  ): Promise<PageResponse<SymptomTrackerResponse>> {
    try {
      const response = await api.get<
        ApiResponse<PageResponse<SymptomTrackerResponse>>
      >(this.basePath, {
        params: { page, size },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching patient symptoms:", error);
      throw error;
    }
  }

  async getSymptom(symptomId: string): Promise<SymptomTrackerResponse> {
    try {
      const response = await api.get<ApiResponse<SymptomTrackerResponse>>(
        `${this.basePath}/${symptomId}`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching symptom ${symptomId}:`, error);
      throw error;
    }
  }

  async getSymptomsByName(
    symptomName: string,
    page = 0,
    size = 10
  ): Promise<PageResponse<SymptomTrackerResponse>> {
    try {
      const response = await api.get<
        ApiResponse<PageResponse<SymptomTrackerResponse>>
      >(`${this.basePath}/name/${symptomName}`, { params: { page, size } });
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching symptoms by name ${symptomName}:`, error);
      throw error;
    }
  }

  async getSymptomsBySeverityRange(
    minSeverity?: number,
    maxSeverity?: number,
    page = 0,
    size = 10
  ): Promise<PageResponse<SymptomTrackerResponse>> {
    try {
      const params: any = { page, size };
      if (minSeverity !== undefined) params.minSeverity = minSeverity;
      if (maxSeverity !== undefined) params.maxSeverity = maxSeverity;

      const response = await api.get<
        ApiResponse<PageResponse<SymptomTrackerResponse>>
      >(`${this.basePath}/severity-range`, { params });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching symptoms by severity range:", error);
      throw error;
    }
  }

  async getRecentSymptoms(
    since: string,
    page = 0,
    size = 10
  ): Promise<PageResponse<SymptomTrackerResponse>> {
    try {
      const response = await api.get<
        ApiResponse<PageResponse<SymptomTrackerResponse>>
      >(`${this.basePath}/recent`, {
        params: { since, page, size },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching recent symptoms:", error);
      throw error;
    }
  }

  async recordSymptom(
    request: CreateSymptomTrackerRequest
  ): Promise<SymptomTrackerResponse> {
    try {
      const response = await api.post<ApiResponse<SymptomTrackerResponse>>(
        this.basePath,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error("Error recording symptom:", error);
      throw error;
    }
  }

  async updateSymptom(
    symptomId: string,
    request: UpdateSymptomTrackerRequest
  ): Promise<SymptomTrackerResponse> {
    try {
      const response = await api.put<ApiResponse<SymptomTrackerResponse>>(
        `${this.basePath}/${symptomId}`,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error updating symptom ${symptomId}:`, error);
      throw error;
    }
  }

  async partialUpdateSymptom(
    symptomId: string,
    request: UpdateSymptomTrackerRequest
  ): Promise<SymptomTrackerResponse> {
    try {
      const response = await api.patch<ApiResponse<SymptomTrackerResponse>>(
        `${this.basePath}/${symptomId}`,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error partially updating symptom ${symptomId}:`, error);
      throw error;
    }
  }

  async deleteSymptom(symptomId: string): Promise<string> {
    try {
      const response = await api.delete<ApiResponse<string>>(
        `${this.basePath}/${symptomId}`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error deleting symptom ${symptomId}:`, error);
      throw error;
    }
  }

  async getSymptomsByCategory(
    category: string,
    page = 0,
    size = 10
  ): Promise<PageResponse<SymptomTrackerResponse>> {
    try {
      const response = await api.get<
        ApiResponse<PageResponse<SymptomTrackerResponse>>
      >(`${this.basePath}/category/${category}`, { params: { page, size } });
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching symptoms by category ${category}:`, error);
      throw error;
    }
  }

  async getSevereSymptoms(
    page = 0,
    size = 10
  ): Promise<PageResponse<SymptomTrackerResponse>> {
    try {
      const response = await api.get<
        ApiResponse<PageResponse<SymptomTrackerResponse>>
      >(`${this.basePath}/severe`, {
        params: { page, size },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching severe symptoms:", error);
      throw error;
    }
  }

  async getSymptomsByDateRange(
    start: string,
    end: string
  ): Promise<SymptomTrackerResponse[]> {
    try {
      const response = await api.get<ApiResponse<SymptomTrackerResponse[]>>(
        `${this.basePath}/date-range`,
        {
          params: { start, end },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching symptoms by date range:", error);
      throw error;
    }
  }

  async getSymptomStats(): Promise<SymptomStatsResponse> {
    try {
      const response = await api.get<ApiResponse<SymptomStatsResponse>>(
        `${this.basePath}/stats`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching symptom stats:", error);
      throw error;
    }
  }
}

export const symptomsService = new SymptomsService();
