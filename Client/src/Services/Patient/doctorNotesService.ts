import type {
  ApiResponse,
  CreateDoctorNoteRequest,
  DoctorNoteResponse,
  UpdateDoctorNoteRequest,
} from "../../types/patientDashboard";
import { api } from "../../utils/dashboardApi";

export class DoctorNotesService {
  private readonly basePath = "/doctor-notes";

  async createDoctorNote(
    request: CreateDoctorNoteRequest
  ): Promise<DoctorNoteResponse> {
    try {
      const response = await api.post<ApiResponse<DoctorNoteResponse>>(
        this.basePath,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error("Error creating doctor note:", error);
      throw error;
    }
  }

  async updateDoctorNote(
    patientId: string,
    noteId: string,
    request: UpdateDoctorNoteRequest
  ): Promise<DoctorNoteResponse> {
    try {
      const response = await api.put<ApiResponse<DoctorNoteResponse>>(
        `${this.basePath}/${patientId}/${noteId}`,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error(
        `Error updating note ${noteId} for patient ${patientId}:`,
        error
      );
      throw error;
    }
  }

  async deleteDoctorNote(patientId: string, noteId: string): Promise<string> {
    try {
      const response = await api.delete<ApiResponse<string>>(
        `${this.basePath}/${patientId}/${noteId}`
      );
      return response.data.data;
    } catch (error) {
      console.error(
        `Error deleting note ${noteId} for patient ${patientId}:`,
        error
      );
      throw error;
    }
  }
}

export const doctorNotesService = new DoctorNotesService();
