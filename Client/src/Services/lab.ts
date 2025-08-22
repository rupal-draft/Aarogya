import axios from "axios";
import type {
  LabTestResponse,
  CreateLabOrderRequest,
  LabOrderResponse,
  LabResultResponse,
  ApiResponse,
  Page,
} from "../types/lab";

const API_BASE_URL = "http://localhost:8080/api/v1/lab";

const labApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

labApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const labTestService = {
  getAllTests: async (page = 0, size = 20): Promise<Page<LabTestResponse>> => {
    const response = await labApi.get<ApiResponse<Page<LabTestResponse>>>(
      "/tests",
      {
        params: { page, size },
      }
    );
    return response.data.data;
  },

  getAllTestsList: async (): Promise<LabTestResponse[]> => {
    const response = await labApi.get<ApiResponse<LabTestResponse[]>>(
      "/tests/all"
    );
    return response.data.data;
  },

  searchTests: async (
    query: string,
    page = 0,
    size = 20
  ): Promise<Page<LabTestResponse>> => {
    const response = await labApi.get<ApiResponse<Page<LabTestResponse>>>(
      "/tests/search",
      {
        params: { query, page, size },
      }
    );
    return response.data.data;
  },

  getCategories: async (): Promise<string[]> => {
    const response = await labApi.get<ApiResponse<string[]>>(
      "/tests/categories"
    );
    return response.data.data;
  },

  getTestsByCategory: async (category: string): Promise<LabTestResponse[]> => {
    const response = await labApi.get<ApiResponse<LabTestResponse[]>>(
      `/tests/category/${category}`
    );
    return response.data.data;
  },

  getTestById: async (testId: string): Promise<LabTestResponse> => {
    const response = await labApi.get<ApiResponse<LabTestResponse>>(
      `/tests/${testId}`
    );
    return response.data.data;
  },

  getTestByCode: async (testCode: string): Promise<LabTestResponse> => {
    const response = await labApi.get<ApiResponse<LabTestResponse>>(
      `/tests/code/${testCode}`
    );
    return response.data.data;
  },
};

export const labOrderService = {
  createOrder: async (
    request: CreateLabOrderRequest
  ): Promise<LabOrderResponse> => {
    const response = await labApi.post<ApiResponse<LabOrderResponse>>(
      "/orders",
      request
    );
    return response.data.data;
  },

  getMyOrders: async (page = 0, size = 10): Promise<Page<LabOrderResponse>> => {
    const response = await labApi.get<ApiResponse<Page<LabOrderResponse>>>(
      "/orders/my-orders",
      {
        params: { page, size },
      }
    );
    return response.data.data;
  },

  getOrderById: async (orderId: string): Promise<LabOrderResponse> => {
    const response = await labApi.get<ApiResponse<LabOrderResponse>>(
      `/orders/${orderId}`
    );
    return response.data.data;
  },

  getOrderByNumber: async (orderNumber: string): Promise<LabOrderResponse> => {
    const response = await labApi.get<ApiResponse<LabOrderResponse>>(
      `/orders/number/${orderNumber}`
    );
    return response.data.data;
  },

  cancelOrder: async (
    orderId: string,
    reason: string
  ): Promise<LabOrderResponse> => {
    const response = await labApi.put<ApiResponse<LabOrderResponse>>(
      `/orders/${orderId}/cancel`,
      null,
      {
        params: { reason },
      }
    );
    return response.data.data;
  },

  rescheduleOrder: async (
    orderId: string,
    newDateTime: string
  ): Promise<LabOrderResponse> => {
    const response = await labApi.put<ApiResponse<LabOrderResponse>>(
      `/orders/${orderId}/reschedule`,
      null,
      {
        params: { newDateTime },
      }
    );
    return response.data.data;
  },
};

export const labResultService = {
  getMyResults: async (
    page = 0,
    size = 10
  ): Promise<Page<LabResultResponse>> => {
    const response = await labApi.get<ApiResponse<Page<LabResultResponse>>>(
      "/results/my-results",
      {
        params: { page, size },
      }
    );
    return response.data.data;
  },

  getOrderResults: async (orderId: string): Promise<LabResultResponse[]> => {
    const response = await labApi.get<ApiResponse<LabResultResponse[]>>(
      `/results/order/${orderId}`
    );
    return response.data.data;
  },

  getResultById: async (resultId: string): Promise<LabResultResponse> => {
    const response = await labApi.get<ApiResponse<LabResultResponse>>(
      `/results/${resultId}`
    );
    return response.data.data;
  },

  getResultsByDateRange: async (
    startDate: string,
    endDate: string
  ): Promise<LabResultResponse[]> => {
    const response = await labApi.get<ApiResponse<LabResultResponse[]>>(
      "/results/date-range",
      {
        params: { startDate, endDate },
      }
    );
    return response.data.data;
  },

  getAbnormalResults: async (): Promise<LabResultResponse[]> => {
    const response = await labApi.get<ApiResponse<LabResultResponse[]>>(
      "/results/abnormal"
    );
    return response.data.data;
  },
};
