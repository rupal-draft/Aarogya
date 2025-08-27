import type {
  ApiResponse,
  CreateHealthGoalRequest,
  HealthGoalResponse,
  UpdateHealthGoalRequest,
} from "../../../types/dashboard";
import { api } from "../../../utils/dashboardApi";

export class HealthGoalsService {
  private readonly basePath = "/health-goals";
  async createHealthGoal(
    request: CreateHealthGoalRequest
  ): Promise<HealthGoalResponse> {
    try {
      const response = await api.post<ApiResponse<HealthGoalResponse>>(
        this.basePath,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error("Error creating health goal:", error);
      throw error;
    }
  }

  async updateHealthGoal(
    goalId: string,
    request: UpdateHealthGoalRequest
  ): Promise<HealthGoalResponse> {
    try {
      const response = await api.put<ApiResponse<HealthGoalResponse>>(
        `${this.basePath}/${goalId}`,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error updating health goal ${goalId}:`, error);
      throw error;
    }
  }

  async partialUpdateHealthGoal(
    goalId: string,
    request: UpdateHealthGoalRequest
  ): Promise<HealthGoalResponse> {
    try {
      const response = await api.patch<ApiResponse<HealthGoalResponse>>(
        `${this.basePath}/${goalId}`,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error partially updating health goal ${goalId}:`, error);
      throw error;
    }
  }

  async updateProgress(
    goalId: string,
    currentValue: number
  ): Promise<HealthGoalResponse> {
    try {
      const response = await api.put<ApiResponse<HealthGoalResponse>>(
        `${this.basePath}/${goalId}/progress`,
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
    goalId: string,
    increment: number
  ): Promise<HealthGoalResponse> {
    try {
      const response = await api.patch<ApiResponse<HealthGoalResponse>>(
        `${this.basePath}/${goalId}/progress/add`,
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
    goalId: string,
    status: string
  ): Promise<HealthGoalResponse> {
    try {
      const response = await api.put<ApiResponse<HealthGoalResponse>>(
        `${this.basePath}/${goalId}/status`,
        null,
        { params: { status } }
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error updating status for goal ${goalId}:`, error);
      throw error;
    }
  }

  async deleteHealthGoal(goalId: string): Promise<string> {
    try {
      const response = await api.delete<ApiResponse<string>>(
        `${this.basePath}/${goalId}`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error deleting health goal ${goalId}:`, error);
      throw error;
    }
  }
}

export const healthGoalsService = new HealthGoalsService();
