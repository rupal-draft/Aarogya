import type { DoctorDashboardData } from "../types/doctorDashboard";
import type {
  ApiResponse,
  PatientDashboardResponse,
} from "../types/patientDashboard";
import { api, ENDPOINTS } from "../utils/dashboardApi";

export class DashboardService {
  async getDoctorDashboard(): Promise<DoctorDashboardData> {
    try {
      const response = await api.get<DoctorDashboardData>(
        `${ENDPOINTS.DOCTOR}/dashboard`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching doctor dashboard:", error);
      throw error;
    }
  }

  async getPatientDashboard(): Promise<PatientDashboardResponse> {
    try {
      const response = await api.get<ApiResponse<PatientDashboardResponse>>(
        `${ENDPOINTS.PATIENT}/dashboard/complete-profile`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching patient dashboard:", error);
      throw error;
    }
  }
}
