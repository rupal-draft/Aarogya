import type {
  ApiResponse,
  CompletePatientProfileResponse,
} from "../../../types/dashboard";
import { api } from "../../../utils/dashboardApi";

export class PatientProfileService {
  private readonly basePath = "/dashboard";

  async getCompletePatientProfile(): Promise<CompletePatientProfileResponse> {
    try {
      const response = await api.get<
        ApiResponse<CompletePatientProfileResponse>
      >(`${this.basePath}/complete-profile`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching complete profile for patient`, error);
      throw error;
    }
  }
}

export const patientProfileService = new PatientProfileService();
