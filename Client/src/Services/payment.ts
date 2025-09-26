import axios from "axios";
import type {
  AppointmentPaymentDetailsResponse,
  AppointmentPaymentResponse,
  InitiateAppointmentPaymentRequest,
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
  // Initiate appointment payment
  initiateAppointmentPayment: async (
    request: InitiateAppointmentPaymentRequest
  ): Promise<AppointmentPaymentResponse> => {
    const response = await paymentApi.post(
      "/core/appointment/initiate",
      request
    );
    return response.data.data;
  },

  // Verify payment signature
  verifyPayment: async (
    request: VerifyPaymentRequest
  ): Promise<{ valid: boolean }> => {
    const response = await paymentApi.post("/core/verify", request);
    return response.data.data;
  },

  // Confirm payment without webhook
  confirmPaymentWithoutWebhook: async (
    request: VerifyPaymentRequest
  ): Promise<void> => {
    await paymentApi.post("/core/confirm/appointment", request);
  },

  // Get payment details by payment ID
  getPaymentDetails: async (
    paymentId: string
  ): Promise<AppointmentPaymentDetailsResponse> => {
    const response = await paymentApi.get(`/core/appointment/${paymentId}`);
    return response.data.data;
  },

  // Get payment details by order ID
  getPaymentByOrderId: async (
    razorpayOrderId: string
  ): Promise<AppointmentPaymentDetailsResponse> => {
    const response = await paymentApi.get(
      `/core/appointment/order/${razorpayOrderId}`
    );
    return response.data.data;
  },
};
