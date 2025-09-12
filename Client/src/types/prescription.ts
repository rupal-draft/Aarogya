export interface Medicine {
  medicineId: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: number;
  instructions: string;
  isSubstitute: boolean;
  originalMedicineId: string | null;
  potentialInteractions: Record<string, string> | null;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  diagnosis: string;
  notes: string;
  medicines: Medicine[];
  status: "ACTIVE" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

export interface PrescriptionResponse {
  data: Prescription[];
  error: string | null;
  success: boolean;
  timeStamp: string;
}

export interface MedicineDto {
  id?: string;
  name: string;
  substitutes: string[];
  sideEffects: string[];
  uses: string[];
  chemicalClass: string;
  habitForming: boolean;
  therapeuticClass: string;
  actionClass: string;
}

export interface MedicineSearchRequest {
  name?: string;
  chemicalClass?: string;
  therapeuticClass?: string;
  actionClass?: string;
  page?: number;
  size?: number;
}

export interface MedicineSearchResponse {
  content: MedicineDto[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface PrescriptionRequest {
  appointmentId: string;
  patientId: string;
  diagnosis: string;
  notes: string;
  medicines: PrescribedMedicineDto[];
}

export interface PrescribedMedicineDto {
  medicineId: string;
  dosage: string;
  frequency: string;
  duration: number;
  instructions?: string;
  isSubstitute?: boolean;
  originalMedicineId?: string;
}

export interface MedicineInteractionCheck {
  medicineId1: string;
  medicineId2: string;
  interactionDescription: string;
  severity: "LOW" | "MODERATE" | "HIGH" | "SEVERE";
}

export interface AddMedicineRequest {
  medicineId: string;
  dosage: string;
  frequency: string;
  duration: number;
  instructions?: string;
  isSubstitute?: boolean;
  originalMedicineId?: string;
}

export interface RemoveMedicineRequest {
  medicineId: string;
}
