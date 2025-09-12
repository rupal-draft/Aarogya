// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

// Lab Test Types
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

// Lab Result Types
export interface LabResultParameter {
  parameterName: string;
  value: string;
  unit: string;
  normalRange: string;
  status: "NORMAL" | "HIGH" | "LOW" | "CRITICAL";
  notes: string;
}

export interface LabResultResponse {
  id: string;
  orderId: string;
  orderNumber: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  testId: string;
  testCode: string;
  testName: string;
  parameters: LabResultParameter[];
  overallResult: string;
  interpretation: string;
  technicalNotes: string;
  reportUrl: string;
  sampleCollectedAt: string;
  resultGeneratedAt: string;
  labTechnicianId: string;
  pathologistId: string;
  createdAt: string;
  updatedAt: string;
  verified: boolean;
  patientNotified: boolean;
  doctorNotified: boolean;
  critical: boolean;
}
