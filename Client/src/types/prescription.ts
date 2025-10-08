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
  medicine1: string;
  medicine2: string;
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

export interface PrescribedMedicineDto {
  medicineId: string;
  dosage: string;
  frequency: string;
  duration: number;
  instructions?: string;
  isSubstitute?: boolean;
  originalMedicineId?: string;
}

export interface PrescribedMedicineResponse {
  medicineId: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: number;
  instructions?: string;
  isSubstitute?: boolean;
}

export interface CreateTemplateRequest {
  name: string;
  description?: string;
  diagnosis: string;
  notes?: string;
  medicines: PrescribedMedicineDto[];
  tags?: string[];
  applicableConditions?: string[];
  isFavorite?: boolean;
  isShared?: boolean;
  categoryId?: string;
}

export interface UpdateTemplateRequest {
  name?: string;
  description?: string;
  diagnosis?: string;
  notes?: string;
  medicines?: PrescribedMedicineDto[];
  tags?: string[];
  applicableConditions?: string[];
  isFavorite?: boolean;
  isShared?: boolean;
  categoryId?: string;
}

export interface TemplateResponse {
  id: string;
  doctorId: string;
  name: string;
  description?: string;
  diagnosis: string;
  notes?: string;
  medicines: PrescribedMedicineResponse[];
  tags: string[];
  applicableConditions: string[];
  usageCount: number;
  isFavorite: boolean;
  isActive: boolean;
  isShared: boolean;
  shareCount: number;
  categoryId?: string;
  categoryName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateSummaryResponse {
  id: string;
  name: string;
  description?: string;
  diagnosisPreview: string;
  tags: string[];
  usageCount: number;
  isFavorite: boolean;
  isShared: boolean;
  medicineCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateFilterRequest {
  searchQuery?: string;
  tags?: string[];
  categories?: string[];
  favoriteOnly?: boolean;
  sharedOnly?: boolean;
  activeOnly?: boolean;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  size?: number;
}

export interface ApplyTemplateRequest {
  templateId: string;
  patientId?: string;
  appointmentId?: string;
  diagnosis?: string;
  notes?: string;
  medicineOverrides?: PrescribedMedicineDto[];
  trackUsage?: boolean;
}

export interface DuplicateTemplateRequest {
  newName: string;
  newDescription?: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface CategoryResponse {
  id: string;
  name: string;
  description?: string;
  templateCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface TemplateStatsResponse {
  totalTemplates: number;
  favoriteTemplates: number;
  sharedTemplates: number;
  totalUsageCount: number;
  usageThisMonth: number;
  usageThisWeek: number;
  mostUsedTemplates: Record<string, number>;
  categoryUsage: Record<string, number>;
  lastUsedDate?: string;
}

export interface TemplateSearchSuggestion {
  tagSuggestions: string[];
  diagnosisSuggestions: string[];
  categorySuggestions: string[];
}

export interface TemplatePageResponse {
  content: TemplateResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
