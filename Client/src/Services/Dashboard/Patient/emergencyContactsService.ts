import type {
  ApiResponse,
  CreateEmergencyContactRequest,
  EmergencyContactResponse,
  UpdateEmergencyContactRequest,
} from "../../../types/patientDashboard";
import { api } from "../../../utils/dashboardApi";

export class EmergencyContactsService {
  private readonly basePath = "/emergency-contacts";

  async createEmergencyContact(
    request: CreateEmergencyContactRequest
  ): Promise<EmergencyContactResponse> {
    try {
      const response = await api.post<ApiResponse<EmergencyContactResponse>>(
        this.basePath,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error("Error creating emergency contact:", error);
      throw error;
    }
  }

  async updateEmergencyContact(
    contactId: string,
    request: UpdateEmergencyContactRequest
  ): Promise<EmergencyContactResponse> {
    try {
      const response = await api.put<ApiResponse<EmergencyContactResponse>>(
        `${this.basePath}/${contactId}`,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error updating emergency contact ${contactId}:`, error);
      throw error;
    }
  }

  async partialUpdateEmergencyContact(
    contactId: string,
    request: UpdateEmergencyContactRequest
  ): Promise<EmergencyContactResponse> {
    try {
      const response = await api.patch<ApiResponse<EmergencyContactResponse>>(
        `${this.basePath}/${contactId}`,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error(
        `Error partially updating emergency contact ${contactId}:`,
        error
      );
      throw error;
    }
  }

  async setPrimaryContact(
    contactId: string
  ): Promise<EmergencyContactResponse> {
    try {
      const response = await api.put<ApiResponse<EmergencyContactResponse>>(
        `${this.basePath}/${contactId}/primary`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error setting primary contact ${contactId}:`, error);
      throw error;
    }
  }

  async deleteEmergencyContact(contactId: string): Promise<string> {
    try {
      const response = await api.delete<ApiResponse<string>>(
        `${this.basePath}/${contactId}`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error deleting emergency contact ${contactId}:`, error);
      throw error;
    }
  }
}

export const emergencyContactsService = new EmergencyContactsService();
