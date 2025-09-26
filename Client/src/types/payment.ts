export interface InitiateAppointmentPaymentRequest {
  appointmentId: string;
  doctorId: string;
  patientId: string;
  amount: number;
  currency: string;
}

export interface AppointmentPaymentResponse {
  paymentId: string;
  appointmentId: string;
  razorpayOrderId: string;
  razorpayKey: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

export interface VerifyPaymentRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface AppointmentPaymentDetailsResponse {
  paymentId: string;
  appointmentId: string;
  doctorId: string;
  patientId: string;
  amount: number;
  currency: string;
  status: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  failureReason?: string;
  createdAt: string;
  paidAt?: string;
  updatedAt: string;
}
