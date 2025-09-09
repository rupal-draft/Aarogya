export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: ApiError;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Patient Profile Types
export interface CompletePatientProfileResponse {
  dashboard: PatientDashboardResponse;
  healthOverview: HealthOverviewResponse;
  diseaseHistory: DiseaseHistoryResponse[];
  medicalHistory: MedicalHistoryResponse[];
  allergies: PatientAllergyResponse[];
  medications: PatientMedicationResponse[];
  recentVitals: PatientVitalsResponse[];
  recentSymptoms: SymptomTrackerResponse[];
  healthGoals: HealthGoalResponse[];
  emergencyContacts: EmergencyContactResponse[];
  doctorNotes: DoctorNoteResponse[];
  analytics: HealthAnalyticsResponse;
  statistics: ProfileStatistics;
  symptomStatsResponse: SymptomStatsResponse;
  vitalsStats: VitalsStatsResponse;
  goalStats: HealthGoalStatsResponse;
}

export interface ProfileStatistics {
  totalDiseases: number;
  activeDiseases: number;
  chronicDiseases: number;
  totalAllergies: number;
  criticalAllergies: number;
  totalMedications: number;
  activeMedications: number;
  totalVitalsRecords: number;
  totalSymptomRecords: number;
  activeGoals: number;
  completedGoals: number;
  emergencyContacts: number;
  profileCompleteness: string;
  lastUpdated: string;
}

export interface PatientDashboardResponse {
  latestVitals: PatientVitalsResponse;
  activeMedicalConditions: MedicalHistoryResponse[];
  criticalAllergies: PatientAllergyResponse[];
  activeMedications: PatientMedicationResponse[];
  activeGoals: HealthGoalResponse[];
  recentDoctorNotes: DoctorNoteResponse[];
  healthSummary: PatientHealthSummary;
}

export interface PatientHealthSummary {
  totalMedicalConditions: number;
  totalAllergies: number;
  activeMedications: number;
  activeGoals: number;
  completedGoals: number;
  overallHealthStatus: string;
}

// Disease History Types
export interface DiseaseHistoryResponse {
  id: string;
  patientId: string;
  diseaseName: string;
  diseaseCode: string;
  diagnosisDate: string;
  diagnosedBy: string;
  severity: "Mild" | "Moderate" | "Severe" | "Critical";
  status: "Active" | "Resolved" | "Chronic" | "Under Treatment";
  isChronic: boolean;
  description: string;
  treatment: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  formattedDiagnosisDate: string;
  severityBadgeColor: string;
  statusBadgeColor: string;
  isActive: boolean;
  isCritical: boolean;
  daysSinceDiagnosis: number;
}

export interface CreateDiseaseHistoryRequest {
  diseaseName: string;
  diseaseCode?: string;
  diagnosisDate: string;
  diagnosedBy: string;
  severity: "Mild" | "Moderate" | "Severe" | "Critical";
  status: "Active" | "Resolved" | "Chronic" | "Under Treatment";
  isChronic?: boolean;
  description?: string;
  treatment?: string;
  notes?: string;
}

export interface UpdateDiseaseHistoryRequest {
  diseaseName?: string;
  diseaseCode?: string;
  diagnosisDate?: string;
  diagnosedBy?: string;
  severity?: "Mild" | "Moderate" | "Severe" | "Critical";
  status?: "Active" | "Resolved" | "Chronic" | "Under Treatment";
  isChronic?: boolean;
  description?: string;
  treatment?: string;
  notes?: string;
}

// Doctor Notes Types
export interface DoctorNoteResponse {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  noteType: string;
  title: string;
  content: string;
  category: string;
  isPrivate: boolean;
  isUrgent: boolean;
  priority: string;
  createdAt: string;
  updatedAt: string;
  formattedCreatedAt: string;
  categoryBadgeColor: string;
  noteTypeBadgeColor: string;
  isRecent: boolean;
  timeAgo: string;
}

export interface CreateDoctorNoteRequest {
  patientId: string;
  doctorId: string;
  doctorName?: string;
  appointmentId?: string;
  noteType: string;
  title: string;
  content: string;
  category?: string;
  priority?: string;
  isPrivate?: boolean;
  isUrgent?: boolean;
}

export interface UpdateDoctorNoteRequest {
  noteType?: string;
  title?: string;
  content?: string;
  category?: string;
  priority?: string;
  isPrivate?: boolean;
  isUrgent?: boolean;
}

// Emergency Contacts Types
export interface EmergencyContactResponse {
  id: string;
  patientId: string;
  fullName: string;
  relationship: string;
  primaryPhone: string;
  secondaryPhone?: string;
  email?: string;
  address?: string;
  isPrimary: boolean;
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  relationshipBadgeColor: string;
  contactInfo: string;
  hasCompleteInfo: boolean;
}

export interface CreateEmergencyContactRequest {
  contactName: string;
  relationship: string;
  phoneNumber: string;
  secondaryPhone?: string;
  notes?: string;
  email?: string;
  address?: string;
  isPrimary?: boolean;
}

export interface UpdateEmergencyContactRequest {
  contactName?: string;
  relationship?: string;
  phoneNumber?: string;
  secondaryPhone?: string;
  notes?: string;
  email?: string;
  address?: string;
  isPrimary?: boolean;
  isActive?: boolean;
}

// Health Goals Types
export interface HealthGoalResponse {
  id: string;
  patientId: string;
  goalType: string;
  title: string;
  description: string;
  targetValue: string;
  currentValue: string;
  unit: string;
  targetDate: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  formattedTargetDate: string;
  statusBadgeColor: string;
  priorityBadgeColor: string;
  progressPercentage: number;
  daysRemaining: number;
  isOverdue: boolean;
  isCompleted: boolean;
  progressText: string;
}

export interface CreateHealthGoalRequest {
  goalType: string;
  title?: string;
  description: string;
  targetValue: number;
  currentValue?: number;
  unit?: string;
  targetDate: string;
  priority?: "HIGH" | "MEDIUM" | "LOW";
  notes?: string;
}

export interface UpdateHealthGoalRequest {
  goalType?: string;
  title?: string;
  description?: string;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  targetDate?: string;
  status?: string;
  priority?: string;
  notes?: string;
}

export interface HealthGoalStatsResponse {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  overdueGoals: number;
  completionRate: number;
}

// Medical History Types
export interface MedicalHistoryResponse {
  id: string;
  conditionName: string;
  diagnosisDate: string;
  status: string;
  notes: string;
  severity: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  formattedDiagnosisDate: string;
  statusBadgeColor: string;
  severityBadgeColor: string;
  categoryBadgeColor: string;
  isCritical: boolean;
  daysSinceDiagnosis: number;
  timeAgo: string;
}

export interface CreateMedicalHistoryRequest {
  conditionName: string;
  diagnosisDate: string;
  status?: string;
  notes?: string;
  severity?: string;
  category?: string;
  isActive?: boolean;
}

// Allergies Types
export interface PatientAllergyResponse {
  id: string;
  patientId: string;
  allergen: string;
  allergyType: string;
  severity: "MILD" | "MODERATE" | "SEVERE" | "CRITICAL";
  symptoms: string[];
  emergencyAction: string;
  notes: string;
  isActive: boolean;
  diagnosedDate: string;
  createdAt: string;
  updatedAt: string;
  isCritical: boolean;
  severityColor: string;
  severityIcon: string;
  formattedSymptoms: string;
  hasEmergencyAction: boolean;
}

export interface CreateAllergyRequest {
  allergen: string;
  severity: string;
  reaction?: string;
  diagnosedDate: string;
  allergyType?: string;
  isActive?: boolean;
  emergencyAction?: string;
}

export interface UpdateAllergyRequest {
  allergen?: string;
  severity?: "MILD" | "MODERATE" | "SEVERE" | "CRITICAL";
  reaction?: string;
  notes?: string;
  allergyType?: string;
  symptoms?: string[];
  diagnosedDate?: string;
  diagnosedBy?: string;
  isActive?: boolean;
  emergencyAction?: string;
}

// Medications Types
export interface PatientMedicationResponse {
  id: string;
  patientId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  route: string;
  startDate: string;
  endDate?: string;
  status: string;
  prescribedBy: string;
  reason: string;
  instructions: string;
  sideEffects: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  formattedStartDate: string;
  formattedEndDate: string;
  statusBadgeColor: string;
  isActive: boolean;
  isExpired: boolean;
  daysRemaining: number;
  durationText: string;
}

export interface CreateMedicationRequest {
  medicationName: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy?: string;
  status?: string;
  notes?: string;
  medicationType?: string;
  purpose?: string;
  reminderEnabled?: boolean;
}

export interface UpdateMedicationRequest {
  medicationName?: string;
  dosage?: number;
  dosageUnit?: string;
  frequency?: string;
  route?: string;
  startDate?: string;
  endDate?: string;
  status?: "ACTIVE" | "COMPLETED" | "DISCONTINUED" | "PAUSED";
  prescribedBy?: string;
  notes?: string;
  sideEffects?: string;
  instructions?: string;
  reason?: string;
  reminderEnabled?: boolean;
}

// Vitals Types
export interface PatientVitalsResponse {
  id: string;
  patientId: string;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  heartRate: number;
  temperature: number;
  weight: number;
  height: number;
  bmi: number;
  healthStatus: string;
  notes: string;
  recordedByType: string;
  recordedById: string;
  recordedAt: string;
  createdAt: string;
  updatedAt: string;
  bloodPressureDisplay: string;
  temperatureDisplay: string;
  weightDisplay: string;
  heightDisplay: string;
  bmiDisplay: string;
  bmiCategory: string;
  isAbnormal: boolean;
}

export interface CreateVitalsRequest {
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  heartRate: number;
  temperature: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight: number;
  height: number;
  notes?: string;
}

export interface UpdateVitalsRequest {
  systolicPressure?: number;
  diastolicPressure?: number;
  heartRate?: number;
  temperature?: number;
  oxygenSaturation?: number;
  respiratoryRate?: number;
  weight?: number;
  height?: number;
  recordedAt?: string;
  recordedBy?: string;
  notes?: string;
}

export interface VitalsStatsResponse {
  bloodPressure: VitalStats;
  heartRate: VitalStats;
  temperature: VitalStats;
  oxygenSaturation: VitalStats;
  weight: VitalStats;
  overallHealthStatus: string;
  healthTrend: string;
  lastRecorded: string;
  totalRecords: number;
  daysAnalyzed: number;
}

export interface VitalStats {
  current: number;
  average: number;
  minimum: number;
  maximum: number;
  trend: string;
  status: string;
  changeFromPrevious: number;
  changePercentage: string;
}

// Symptoms Types
export interface SymptomTrackerResponse {
  id: string;
  patientId: string;
  symptomName: string;
  category: string;
  severityLevel: number;
  description: string;
  triggers: string[];
  duration: string;
  frequency: string;
  associatedSymptoms: string[];
  notes: string;
  recordedAt: string;
  createdAt: string;
  updatedAt: string;
  formattedRecordedAt: string;
  severityText: string;
  severityBadgeColor: string;
  categoryBadgeColor: string;
  isSevere: boolean;
  isRecent: boolean;
  timeAgo: string;
}

export interface CreateSymptomTrackerRequest {
  symptomName: string;
  category?: string;
  severity: number;
  description?: string;
  triggers?: string[];
  duration?: string;
  frequency?: string;
  associatedSymptoms?: string[];
  notes?: string;
  recordedAt?: string;
}

export interface UpdateSymptomTrackerRequest {
  symptomName?: string;
  severity?: number;
  description?: string;
  category?: string;
  triggers?: string[];
  duration?: string;
  frequency?: string;
  associatedSymptoms?: string[];
  notes?: string;
  recordedAt?: string;
}

export interface SymptomStatsResponse {
  symptomSummaries: SymptomSummary[];
  recentSymptoms: SymptomTrackerResponse[];
  totalSymptoms: number;
  generatedAt: string;
}

export interface SymptomSummary {
  symptomName: string;
  count: number;
  averageSeverity: number;
  lastRecorded: string;
}

// Health Analytics Types
export interface HealthAnalyticsResponse {
  patientId: string;
  analysisPeriodDays: number;
  overallHealthScore: number;
  healthTrend: string;
  vitalsAnalytics: VitalsAnalytics;
  medicationAnalytics: MedicationAnalytics;
  symptomAnalytics: SymptomAnalytics;
  goalAnalytics: GoalAnalytics;
  healthAlerts: HealthAlert[];
  recommendations: HealthRecommendation[];
  healthScoreText: string;
  healthScoreColor: string;
}

export interface VitalsAnalytics {
  averageVitals: Record<string, number>;
  vitalsTrends: Record<string, string>;
  abnormalVitals: string[];
  totalVitalsRecords: number;
  lastRecordedDate: string;
}

export interface MedicationAnalytics {
  totalMedications: number;
  activeMedications: number;
  adherenceRate: number;
  missedDoses: number;
  upcomingRefills: string[];
  expiringSoon: string[];
}

export interface SymptomAnalytics {
  totalSymptoms: number;
  symptomFrequency: Record<string, number>;
  mostCommonSymptoms: string[];
  symptomTrend: string;
  concerningPatterns: string[];
}

export interface GoalAnalytics {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  averageProgress: number;
  nearingDeadline: string[];
  overdue: string[];
}

export interface HealthAlert {
  id: string;
  type: string;
  severity: string;
  title: string;
  message: string;
  actionRequired: string;
  createdAt: string;
  isRead: boolean;
}

export interface HealthRecommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  priority: string;
  actionType: string;
  createdAt: string;
}

// Health Overview Types
export interface HealthOverviewResponse {
  overallHealthStatus: string;
  healthScore: number;
  healthTrend: string;
  activeMedications: number;
  criticalAllergies: number;
  activeConditions: number;
  lastVitalsCheck: string;
  latestVitals: VitalStats;
  healthAlerts: HealthAlert[];
  medicationSummary: MedicationSummary;
  upcomingReminders: HealthReminder[];
  goalProgress: GoalProgress[];
}

export interface MedicationSummary {
  totalMedications: number;
  activeMedications: number;
  missedDoses: number;
  adherenceRate: number;
  adherenceStatus: string;
}

export interface HealthReminder {
  type: string;
  title: string;
  description: string;
  dueAt: string;
  priority: string;
}

export interface GoalProgress {
  goalName: string;
  goalType: string;
  currentValue: number;
  targetValue: number;
  progressPercentage: number;
  status: string;
  targetDate: string;
}

export interface PatientDashboardData {
  success: boolean;
  message: string;
  data: {
    dashboard: {
      latestVitals: {
        bloodPressureSystolic: number;
        bloodPressureDiastolic: number;
        heartRate: number;
        temperature: number;
        oxygenSaturation: number;
        respiratoryRate: number;
        weight: number;
        height: number;
        bmi: number;
        recordedAt: string;
      };
      activeMedicalConditions: Array<{
        conditionName: string;
        severity: string;
        diagnosedDate: string;
        status: string;
        description: string;
      }>;
      criticalAllergies: Array<{
        allergen: string;
        severity: string;
        reaction: string;
        diagnosedDate: string;
      }>;
      activeMedications: Array<{
        medicationName: string;
        dosage: string;
        frequency: string;
        startDate: string;
        prescribedBy: string;
        instructions: string;
      }>;
      activeGoals: Array<{
        goalType: string;
        targetValue: number;
        currentValue: number;
        unit: string;
        targetDate: string;
        progress: number;
        status: string;
      }>;
      recentDoctorNotes: Array<{
        noteDate: string;
        doctorName: string;
        noteType: string;
        content: string;
        followUpRequired: boolean;
      }>;
      healthSummary: {
        overallStatus: string;
        riskFactors: string[];
        recommendations: string[];
      };
    };
    healthOverview: {
      overallHealthStatus: string;
      healthScore: number;
      lastUpdated: string;
    };
    emergencyContacts: Array<{
      name: string;
      relationship: string;
      phoneNumber: string;
      email: string;
      address: string;
      isPrimary: boolean;
    }>;
    recentVitals: Array<{
      bloodPressureSystolic: number;
      bloodPressureDiastolic: number;
      heartRate: number;
      bodyTemperature: number;
      oxygenSaturation: number;
      respiratoryRate: number;
      recordedAt: string;
    }>;
    allergies: Array<{
      allergen: string;
      severity: string;
      reaction: string;
      diagnosedDate: string;
    }>;
    medications: Array<{
      medicationName: string;
      dosage: string;
      frequency: string;
      startDate: string;
      prescribedBy: string;
      instructions: string;
    }>;
    healthGoals: Array<{
      goalType: string;
      targetValue: number;
      currentValue: number;
      unit: string;
      targetDate: string;
      progress: number;
      status: string;
    }>;
    doctorNotes: Array<{
      noteDate: string;
      doctorName: string;
      noteType: string;
      content: string;
      followUpRequired: boolean;
    }>;
  };
  timestamp: string;
}
