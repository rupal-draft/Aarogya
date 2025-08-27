import type {
  ApiResponse,
  PageResponse,
  PatientAllergyResponse,
  CreateAllergyRequest,
  UpdateAllergyRequest,
} from "../../../types/dashboard";
import { api } from "../../../utils/dashboardApi";

export class AllergiesService {
  private readonly basePath = "/allergies";

  async addAllergy(
    request: CreateAllergyRequest
  ): Promise<PatientAllergyResponse> {
    try {
      const response = await api.post<ApiResponse<PatientAllergyResponse>>(
        this.basePath,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error("Error adding allergy:", error);
      throw error;
    }
  }

  async updateAllergy(
    allergyId: string,
    request: UpdateAllergyRequest
  ): Promise<PatientAllergyResponse> {
    try {
      const response = await api.put<ApiResponse<PatientAllergyResponse>>(
        `${this.basePath}/${allergyId}`,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error updating allergy ${allergyId}:`, error);
      throw error;
    }
  }

  async partialUpdateAllergy(
    allergyId: string,
    request: UpdateAllergyRequest
  ): Promise<PatientAllergyResponse> {
    try {
      const response = await api.patch<ApiResponse<PatientAllergyResponse>>(
        `${this.basePath}/${allergyId}`,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error partially updating allergy ${allergyId}:`, error);
      throw error;
    }
  }

  async updateAllergySeverity(
    allergyId: string,
    severity: string
  ): Promise<PatientAllergyResponse> {
    try {
      const response = await api.put<ApiResponse<PatientAllergyResponse>>(
        `${this.basePath}/${allergyId}/severity`,
        null,
        { params: { severity } }
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error updating severity for allergy ${allergyId}:`, error);
      throw error;
    }
  }

  async deleteAllergy(allergyId: string): Promise<string> {
    try {
      const response = await api.delete<ApiResponse<string>>(
        `${this.basePath}/${allergyId}`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error deleting allergy ${allergyId}:`, error);
      throw error;
    }
  }
}

export const allergiesService = new AllergiesService();
