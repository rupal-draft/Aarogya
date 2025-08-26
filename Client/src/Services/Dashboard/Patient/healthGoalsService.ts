import type {
  ApiResponse,
  CreateHealthGoalRequest,
  HealthGoalResponse,
  HealthGoalStatsResponse,
  PageResponse,
  UpdateHealthGoalRequest,
} from "../../../types/dashboard";
import { api } from "../../../utils/dashboardApi";

export class HealthGoalsService {
  private readonly basePath = "/health-goals";

  async getPatientHealthGoals(
    page = 0,
    size = 10
  ): Promise<PageResponse<HealthGoalResponse>> {
    try {
      const response = await api.get<
        ApiResponse<PageResponse<HealthGoalResponse>>
      >(this.basePath, {
        params: { page, size },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching health goals:", error);
      throw error;
    }
  }

  async getHealthGoal(goalId: string): Promise<HealthGoalResponse> {
    try {
      const response = await api.get<ApiResponse<HealthGoalResponse>>(
        `${this.basePath}/${goalId}`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching health goal ${goalId}:`, error);
      throw error;
    }
  }

  async getActiveGoals(
    page = 0,
    size = 10
  ): Promise<PageResponse<HealthGoalResponse>> {
    try {
      const response = await api.get<
        ApiResponse<PageResponse<HealthGoalResponse>>
      >(`${this.basePath}/active`, {
        params: { page, size },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching active goals:", error);
      throw error;
    }
  }

  async getGoalsByType(
    goalType: string,
    page = 0,
    size = 10
  ): Promise<PageResponse<HealthGoalResponse>> {
    try {
      const response = await api.get<
        ApiResponse<PageResponse<HealthGoalResponse>>
      >(`${this.basePath}/type/${goalType}`, { params: { page, size } });
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching ${goalType} goals:`, error);
      throw error;
    }
  }

  async getGoalsByPriority(
    priority: string,
    page = 0,
    size = 10
  ): Promise<PageResponse<HealthGoalResponse>> {
    try {
      const response = await api.get<
        ApiResponse<PageResponse<HealthGoalResponse>>
      >(`${this.basePath}/priority/${priority}`, { params: { page, size } });
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching ${priority} priority goals:`, error);
      throw error;
    }
  }

  async getOverdueGoals(
    page = 0,
    size = 10
  ): Promise<PageResponse<HealthGoalResponse>> {
    try {
      const response = await api.get<
        ApiResponse<PageResponse<HealthGoalResponse>>
      >(`${this.basePath}/overdue`, {
        params: { page, size },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching overdue goals:", error);
      throw error;
    }
  }

  async getGoalsByStatus(
    status: string,
    page = 0,
    size = 10
  ): Promise<PageResponse<HealthGoalResponse>> {
    try {
      const response = await api.get<
        ApiResponse<PageResponse<HealthGoalResponse>>
      >(`${this.basePath}/status/${status}`, { params: { page, size } });
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching ${status} goals:`, error);
      throw error;
    }
  }

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

  async getHealthGoalStats(): Promise<HealthGoalStatsResponse> {
    try {
      const response = await api.get<ApiResponse<HealthGoalStatsResponse>>(
        `${this.basePath}/stats`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching health goal stats:", error);
      throw error;
    }
  }
}

export const healthGoalsService = new HealthGoalsService();
