import axios from "axios";
import type {
  AppointmentPaymentDetailsResponse,
  AppointmentPaymentResponse,
  InitiateAppointmentPaymentRequest,
  InitiateLabPaymentRequest,
  InitiatePharmacyPaymentRequest,
  LabPaymentDetailsResponse,
  LabPaymentResponse,
  PharmacyPaymentDetailsResponse,
  PharmacyPaymentResponse,
  VerifyPaymentRequest,
} from "../types/payment";

const API_BASE_URL = "http://localhost:8080/api/v1/payment";

const paymentApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const paymentService = {
  initiateAppointmentPayment: async (
    request: InitiateAppointmentPaymentRequest
  ): Promise<AppointmentPaymentResponse> => {
    const response = await paymentApi.post(
      "/core/appointment/initiate",
      request
    );
    return response.data.data;
  },

  verifyPayment: async (
    request: VerifyPaymentRequest
  ): Promise<{ valid: boolean }> => {
    const response = await paymentApi.post("/core/verify", request);
    return response.data.data;
  },

  confirmPaymentWithoutWebhook: async (
    request: VerifyPaymentRequest
  ): Promise<void> => {
    await paymentApi.post("/core/confirm/appointment", request);
  },

  getPaymentDetails: async (
    paymentId: string
  ): Promise<AppointmentPaymentDetailsResponse> => {
    const response = await paymentApi.get(`/core/appointment/${paymentId}`);
    return response.data.data;
  },

  getPaymentByOrderId: async (
    razorpayOrderId: string
  ): Promise<AppointmentPaymentDetailsResponse> => {
    const response = await paymentApi.get(
      `/core/appointment/order/${razorpayOrderId}`
    );
    return response.data.data;
  },

  initiatePharmacyPayment: async (
    request: InitiatePharmacyPaymentRequest
  ): Promise<PharmacyPaymentResponse> => {
    const response = await paymentApi.post("/core/pharmacy/initiate", request);
    return response.data.data;
  },

  confirmPharmacyPaymentWithoutWebhook: async (
    request: VerifyPaymentRequest
  ): Promise<void> => {
    await paymentApi.post("/core/confirm/pharmacy", request);
  },

  getPharmacyPaymentDetails: async (
    paymentId: string
  ): Promise<PharmacyPaymentDetailsResponse> => {
    const response = await paymentApi.get(`/core/pharmacy/${paymentId}`);
    return response.data.data;
  },

  getPharmacyPaymentByOrderId: async (
    razorpayOrderId: string
  ): Promise<PharmacyPaymentDetailsResponse> => {
    const response = await paymentApi.get(
      `/core/pharmacy/order/${razorpayOrderId}`
    );
    return response.data.data;
  },

  initiateLabPayment: async (
    request: InitiateLabPaymentRequest
  ): Promise<LabPaymentResponse> => {
    const response = await paymentApi.post("/core/lab/initiate", request);
    return response.data.data;
  },

  confirmLabPaymentWithoutWebhook: async (
    request: VerifyPaymentRequest
  ): Promise<void> => {
    await paymentApi.post("/core/confirm/lab", request);
  },

  getLabPaymentDetails: async (
    paymentId: string
  ): Promise<LabPaymentDetailsResponse> => {
    const response = await paymentApi.get(`/core/lab/${paymentId}`);
    return response.data.data;
  },

  getLabPaymentByOrderId: async (
    razorpayOrderId: string
  ): Promise<LabPaymentDetailsResponse> => {
    const response = await paymentApi.get(`/core/lab/order/${razorpayOrderId}`);
    return response.data.data;
  },
};
