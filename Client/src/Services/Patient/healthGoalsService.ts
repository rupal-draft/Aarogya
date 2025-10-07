import type {
  ApiResponse,
  CreateHealthGoalRequest,
  HealthGoalResponse,
  UpdateHealthGoalRequest,
} from "../../types/patientDashboard";
import { api, ENDPOINTS } from "../../utils/dashboardApi";

export class HealthGoalsService {
  private getBasePath(patientId: string) {
    return `${ENDPOINTS.PATIENT}/${patientId}/health-goals`;
  }

  async createHealthGoal(
    patientId: string,
    request: CreateHealthGoalRequest
  ): Promise<HealthGoalResponse> {
    try {
      const response = await api.post<ApiResponse<HealthGoalResponse>>(
        this.getBasePath(patientId),
        request
      );
      return response.data.data;
    } catch (error) {
      console.error(
        `Error creating health goal for patient ${patientId}:`,
        error
      );
      throw error;
    }
  }

  async updateHealthGoal(
    patientId: string,
    goalId: string,
    request: UpdateHealthGoalRequest
  ): Promise<HealthGoalResponse> {
    try {
      const response = await api.put<ApiResponse<HealthGoalResponse>>(
        `${this.getBasePath(patientId)}/${goalId}`,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error updating health goal ${goalId}:`, error);
      throw error;
    }
  }

  async partialUpdateHealthGoal(
    patientId: string,
    goalId: string,
    request: UpdateHealthGoalRequest
  ): Promise<HealthGoalResponse> {
    try {
      const response = await api.patch<ApiResponse<HealthGoalResponse>>(
        `${this.getBasePath(patientId)}/${goalId}`,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error partially updating health goal ${goalId}:`, error);
      throw error;
    }
  }

  async updateProgress(
    patientId: string,
    goalId: string,
    currentValue: number
  ): Promise<HealthGoalResponse> {
    try {
      const response = await api.put<ApiResponse<HealthGoalResponse>>(
        `${this.getBasePath(patientId)}/${goalId}/progress`,
        null,
        { params: { currentValue } }
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error updating progress for goal ${goalId}:`, error);
      throw error;
    }
  }

  async addToProgress(
    patientId: string,
    goalId: string,
    increment: number
  ): Promise<HealthGoalResponse> {
    try {
      const response = await api.patch<ApiResponse<HealthGoalResponse>>(
        `${this.getBasePath(patientId)}/${goalId}/progress/add`,
        null,
        { params: { increment } }
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error adding to progress for goal ${goalId}:`, error);
      throw error;
    }
  }

  async updateStatus(
    patientId: string,
    goalId: string,
    status: string
  ): Promise<HealthGoalResponse> {
    try {
      const response = await api.put<ApiResponse<HealthGoalResponse>>(
        `${this.getBasePath(patientId)}/${goalId}/status`,
        null,
        { params: { status } }
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error updating status for goal ${goalId}:`, error);
      throw error;
    }
  }

  async deleteHealthGoal(patientId: string, goalId: string): Promise<string> {
    try {
      const response = await api.delete<ApiResponse<string>>(
        `${this.getBasePath(patientId)}/${goalId}`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error deleting health goal ${goalId}:`, error);
      throw error;
    }
  }
}

export const healthGoalsService = new HealthGoalsService();
