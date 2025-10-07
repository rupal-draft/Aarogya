import type {
  ApiResponse,
  PatientAllergyResponse,
  CreateAllergyRequest,
  UpdateAllergyRequest,
} from "../../types/patientDashboard";
import { api, ENDPOINTS } from "../../utils/dashboardApi";

export class AllergiesService {
  private getBasePath(patientId: string) {
    return `${ENDPOINTS.PATIENT}/${patientId}/allergies`;
  }

  async addAllergy(
    patientId: string,
    request: CreateAllergyRequest
  ): Promise<PatientAllergyResponse> {
    try {
      const response = await api.post<ApiResponse<PatientAllergyResponse>>(
        this.getBasePath(patientId),
        request
      );
      return response.data.data;
    } catch (error) {
      console.error("Error adding allergy:", error);
      throw error;
    }
  }

  async updateAllergy(
    patientId: string,
    allergyId: string,
    request: UpdateAllergyRequest
  ): Promise<PatientAllergyResponse> {
    try {
      const response = await api.put<ApiResponse<PatientAllergyResponse>>(
        `${this.getBasePath(patientId)}/${allergyId}`,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error updating allergy ${allergyId}:`, error);
      throw error;
    }
  }

  async partialUpdateAllergy(
    patientId: string,
    allergyId: string,
    request: UpdateAllergyRequest
  ): Promise<PatientAllergyResponse> {
    try {
      const response = await api.patch<ApiResponse<PatientAllergyResponse>>(
        `${this.getBasePath(patientId)}/${allergyId}`,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error partially updating allergy ${allergyId}:`, error);
      throw error;
    }
  }

  async updateAllergySeverity(
    patientId: string,
    allergyId: string,
    severity: string
  ): Promise<PatientAllergyResponse> {
    try {
      const response = await api.put<ApiResponse<PatientAllergyResponse>>(
        `${this.getBasePath(patientId)}/${allergyId}/severity`,
        null,
        { params: { severity } }
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error updating severity for allergy ${allergyId}:`, error);
      throw error;
    }
  }

  async deleteAllergy(patientId: string, allergyId: string): Promise<string> {
    try {
      const response = await api.delete<ApiResponse<string>>(
        `${this.getBasePath(patientId)}/${allergyId}`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error deleting allergy ${allergyId}:`, error);
      throw error;
    }
  }
}

export const allergiesService = new AllergiesService();
