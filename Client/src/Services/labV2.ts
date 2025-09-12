import axios from "axios";
import type {
  ApiResponse,
  Page,
  LabTestResponse,
  LabResultResponse,
} from "../types/labV2";

const TESTS_BASE_URL = "http://localhost:8080/api/v1/lab/tests";
const RESULTS_BASE_URL = "http://localhost:8080/api/v1/lab/results";

const testApi = axios.create({
  baseURL: TESTS_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const resultApi = axios.create({
  baseURL: RESULTS_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const labTestsApi = {
  getAllTests: async (
    page: number = 0,
    size: number = 20
  ): Promise<ApiResponse<Page<LabTestResponse>>> => {
    const response = await testApi.get(
      `${TESTS_BASE_URL}?page=${page}&size=${size}`
    );
    return response.data;
  },

  searchTests: async (
    query: string,
    page: number = 0,
    size: number = 20
  ): Promise<ApiResponse<Page<LabTestResponse>>> => {
    const response = await testApi.get(
      `${TESTS_BASE_URL}/search?query=${encodeURIComponent(
        query
      )}&page=${page}&size=${size}`
    );
    return response.data;
  },

  getCategories: async (): Promise<ApiResponse<string[]>> => {
    const response = await testApi.get(`${TESTS_BASE_URL}/categories`);
    return response.data;
  },

  getTestsByCategory: async (
    category: string
  ): Promise<ApiResponse<LabTestResponse[]>> => {
    const response = await testApi.get(
      `${TESTS_BASE_URL}/category/${encodeURIComponent(category)}`
    );
    return response.data;
  },

  getTestById: async (
    testId: string
  ): Promise<ApiResponse<LabTestResponse>> => {
    const response = await testApi.get(`${TESTS_BASE_URL}/${testId}`);
    return response.data;
  },

  getTestByCode: async (
    testCode: string
  ): Promise<ApiResponse<LabTestResponse>> => {
    const response = await testApi.get(`${TESTS_BASE_URL}/code/${testCode}`);
    return response.data;
  },
};

export const labResultsApi = {
  getPatientResults: async (
    patientId: string,
    page: number = 0,
    size: number = 10
  ): Promise<ApiResponse<Page<LabResultResponse>>> => {
    const response = await resultApi.get(
      `${RESULTS_BASE_URL}/patient-results/${patientId}?page=${page}&size=${size}`
    );
    return response.data;
  },
};
