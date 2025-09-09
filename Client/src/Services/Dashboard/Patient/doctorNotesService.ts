import type {
  ApiResponse,
  DoctorNoteResponse,
  PageResponse,
} from "../../../types/patientDashboard";
import { api } from "../../../utils/dashboardApi";

export class DoctorNotesService {
  private readonly basePath = "/doctor-notes";

  async getMyNotes(
    page = 0,
    size = 10
  ): Promise<PageResponse<DoctorNoteResponse>> {
    try {
      const response = await api.get<
        ApiResponse<PageResponse<DoctorNoteResponse>>
      >(this.basePath, {
        params: { page, size },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching doctor notes:", error);
      throw error;
    }
  }

  async getPatientNote(
    patientId: string,
    noteId: string
  ): Promise<DoctorNoteResponse> {
    try {
      const response = await api.get<ApiResponse<DoctorNoteResponse>>(
        `${this.basePath}/${patientId}/${noteId}`
      );
      return response.data.data;
    } catch (error) {
      console.error(
        `Error fetching note ${noteId} for patient ${patientId}:`,
        error
      );
      throw error;
    }
  }

  async getPatientNotesByType(
    patientId: string,
    noteType: string,
    page = 0,
    size = 10
  ): Promise<PageResponse<DoctorNoteResponse>> {
    try {
      const response = await api.get<
        ApiResponse<PageResponse<DoctorNoteResponse>>
      >(`${this.basePath}/${patientId}/type/${noteType}`, {
        params: { page, size },
      });
      return response.data.data;
    } catch (error) {
      console.error(
        `Error fetching ${noteType} notes for patient ${patientId}:`,
        error
      );
      throw error;
    }
  }

  async getPatientNotesByPriority(
    patientId: string,
    priority: string,
    page = 0,
    size = 10
  ): Promise<PageResponse<DoctorNoteResponse>> {
    try {
      const response = await api.get<
        ApiResponse<PageResponse<DoctorNoteResponse>>
      >(`${this.basePath}/${patientId}/priority/${priority}`, {
        params: { page, size },
      });
      return response.data.data;
    } catch (error) {
      console.error(
        `Error fetching ${priority} priority notes for patient ${patientId}:`,
        error
      );
      throw error;
    }
  }

  async getPatientNotesByCategory(
    patientId: string,
    category: string,
    page = 0,
    size = 10
  ): Promise<PageResponse<DoctorNoteResponse>> {
    try {
      const response = await api.get<
        ApiResponse<PageResponse<DoctorNoteResponse>>
      >(`${this.basePath}/${patientId}/category/${category}`, {
        params: { page, size },
      });
      return response.data.data;
    } catch (error) {
      console.error(
        `Error fetching ${category} category notes for patient ${patientId}:`,
        error
      );
      throw error;
    }
  }

  async getNonPrivateNotes(
    page = 0,
    size = 10
  ): Promise<PageResponse<DoctorNoteResponse>> {
    try {
      const response = await api.get<
        ApiResponse<PageResponse<DoctorNoteResponse>>
      >(`${this.basePath}/non-private`, { params: { page, size } });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching non-private notes:", error);
      throw error;
    }
  }

  async getUrgentNotes(
    page = 0,
    size = 10
  ): Promise<PageResponse<DoctorNoteResponse>> {
    try {
      const response = await api.get<
        ApiResponse<PageResponse<DoctorNoteResponse>>
      >(`${this.basePath}/urgent`, {
        params: { page, size },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching urgent notes:", error);
      throw error;
    }
  }

  async getRecentNotes(
    days: number,
    page = 0,
    size = 10
  ): Promise<PageResponse<DoctorNoteResponse>> {
    try {
      const response = await api.get<
        ApiResponse<PageResponse<DoctorNoteResponse>>
      >(`${this.basePath}/recent/${days}`, { params: { page, size } });
      return response.data.data;
    } catch (error) {
      console.error(
        `Error fetching recent notes from last ${days} days:`,
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
