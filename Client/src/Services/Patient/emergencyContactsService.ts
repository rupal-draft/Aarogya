import type {
  ApiResponse,
  CreateEmergencyContactRequest,
  EmergencyContactResponse,
  UpdateEmergencyContactRequest,
} from "../../types/patientDashboard";
import { api } from "../../utils/dashboardApi";

export class EmergencyContactsService {
  private readonly basePath = "/emergency-contacts";

  /**
   * Create emergency contact
   * - If doctor → must pass patientId
   * - If patient → backend will auto-detect from context
   */
  async createEmergencyContact(
    request: CreateEmergencyContactRequest,
    patientId?: string
  ): Promise<EmergencyContactResponse> {
    try {
      const url = patientId ? `${this.basePath}/${patientId}` : this.basePath;
      const response = await api.post<ApiResponse<EmergencyContactResponse>>(
        url,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error("Error creating emergency contact:", error);
      throw error;
    }
  }

  /**
   * Update full emergency contact
   */
  async updateEmergencyContact(
    contactId: string,
    request: UpdateEmergencyContactRequest,
    patientId?: string
  ): Promise<EmergencyContactResponse> {
    try {
      const url = patientId
        ? `${this.basePath}/${patientId}/${contactId}`
        : `${this.basePath}/${contactId}`;
      const response = await api.put<ApiResponse<EmergencyContactResponse>>(
        url,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error updating emergency contact ${contactId}:`, error);
      throw error;
    }
  }

  /**
   * Partial update (PATCH)
   */
  async partialUpdateEmergencyContact(
    contactId: string,
    request: UpdateEmergencyContactRequest,
    patientId?: string
  ): Promise<EmergencyContactResponse> {
    try {
      const url = patientId
        ? `${this.basePath}/${patientId}/${contactId}`
        : `${this.basePath}/${contactId}`;
      const response = await api.patch<ApiResponse<EmergencyContactResponse>>(
        url,
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

  /**
   * Set as primary contact
   */
  async setPrimaryContact(
    contactId: string,
    patientId?: string
  ): Promise<EmergencyContactResponse> {
    try {
      const url = patientId
        ? `${this.basePath}/${patientId}/${contactId}/primary`
        : `${this.basePath}/${contactId}/primary`;
      const response = await api.put<ApiResponse<EmergencyContactResponse>>(
        url
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error setting primary contact ${contactId}:`, error);
      throw error;
    }
  }

  /**
   * Delete contact
   */
  async deleteEmergencyContact(
    contactId: string,
    patientId?: string
  ): Promise<string> {
    try {
      const url = patientId
        ? `${this.basePath}/${patientId}/${contactId}`
        : `${this.basePath}/${contactId}`;
      const response = await api.delete<ApiResponse<string>>(url);
      return response.data.data;
    } catch (error) {
      console.error(`Error deleting emergency contact ${contactId}:`, error);
      throw error;
    }
  }

  /**
   * Get all contacts of a patient
   */
  async getPatientEmergencyContacts(
    patientId?: string
  ): Promise<EmergencyContactResponse[]> {
    try {
      const url = patientId ? `${this.basePath}/${patientId}` : this.basePath; // for patient dashboard
      const response = await api.get<ApiResponse<EmergencyContactResponse[]>>(
        url
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching emergency contacts:", error);
      throw error;
    }
  }

  /**
   * Get single contact
   */
  async getEmergencyContact(
    contactId: string,
    patientId?: string
  ): Promise<EmergencyContactResponse> {
    try {
      const url = patientId
        ? `${this.basePath}/${patientId}/${contactId}`
        : `${this.basePath}/${contactId}`;
      const response = await api.get<ApiResponse<EmergencyContactResponse>>(
        url
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching emergency contact ${contactId}:`, error);
      throw error;
    }
  }
}

export const emergencyContactsService = new EmergencyContactsService();
