import type { OrderStatus, PaymentStatus, TestStatus } from "../Data/enums/lab";

export interface LabTestResponse {
  id: string;
  testCode: string;
  testName: string;
  description: string;
  category: string;
  price: number;
  sampleType: string;
  preparationTimeHours: number;
  preparationInstructions: string;
  resultTimeHours: number;
  normalRanges: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateLabOrderRequest {
  testIds: string[];
  doctorId?: string;
  scheduledDateTime: string;
  location: string;
  specialInstructions?: string;
}

export interface LabOrderResponse {
  id: string;
  orderNumber: string;
  patientId: string;
  patientName: string;
  doctorId?: string;
  doctorName?: string;
  orderedTests: OrderedTestResponse[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  scheduledDateTime: string;
  location: string;
  specialInstructions?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderedTestResponse {
  testId: string;
  testCode: string;
  testName: string;
  price: number;
  status: TestStatus;
  sampleCollectedAt?: string;
  resultExpectedAt?: string;
}

export interface LabResultResponse {
  id: string;
  orderId: string;
  orderNumber: string;
  patientId: string;
  patientName: string;
  doctorId?: string;
  doctorName?: string;
  testId: string;
  testCode: string;
  testName: string;
  parameters: ResultParameter[];
  overallResult: string;
  interpretation?: string;
  technicalNotes?: string;
  reportUrl?: string;
  sampleCollectedAt?: string;
  resultGeneratedAt?: string;
  labTechnicianId?: string;
  pathologistId?: string;
  isVerified: boolean;
  isCritical: boolean;
  isPatientNotified: boolean;
  isDoctorNotified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResultParameter {
  name: string;
  value: string;
  unit: string;
  normalRange: string;
  isAbnormal: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
