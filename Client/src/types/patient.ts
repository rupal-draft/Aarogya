// Patient Dashboard API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// Latest Vitals
export interface LatestVitals {
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
  recordedById: string | null;
  recordedAt: string;
  createdAt: string;
  updatedAt: string;
  abnormal: boolean;
  temperatureDisplay: string;
  bloodPressureDisplay: string;
  heightDisplay: string;
  bmiCategory: string;
  weightDisplay: string;
  bmiDisplay: string;
}

// Medical Conditions
export interface MedicalCondition {
  id: string;
  conditionName: string;
  diagnosisDate: string;
  status: string;
  notes: string;
  severity: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  formattedDiagnosisDate: string;
  statusBadgeColor: string;
  severityBadgeColor: string;
  categoryBadgeColor: string;
  daysSinceDiagnosis: number;
  timeAgo: string;
  active: boolean;
  critical: boolean;
}

// Allergies
export interface Allergy {
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
  formattedSymptoms: string;
  severityColor: string;
  severityIcon: string;
  critical: boolean;
}

// Medications
export interface Medication {
  id: string;
  patientId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  route: string;
  startDate: string;
  endDate: string | null;
  status: "ACTIVE" | "INACTIVE" | "COMPLETED";
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
  daysRemaining: number;
  durationText: string;
  active: boolean;
  expired: boolean;
}

// Health Goals
export interface HealthGoal {
  id: string;
  patientId: string;
  goalType: string;
  title: string;
  description: string;
  targetValue: string;
  currentValue: string;
  unit: string;
  targetDate: string;
  status: "ACTIVE" | "COMPLETED" | "PAUSED";
  priority: "Low" | "Medium" | "High";
  createdAt: string;
  updatedAt: string;
  formattedTargetDate: string;
  statusBadgeColor: string;
  priorityBadgeColor: string;
  progressPercentage: number;
  daysRemaining: number;
  progressText: string;
  overdue: boolean;
  completed: boolean;
}

// Doctor Notes
export interface DoctorNote {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  noteType: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  formattedCreatedAt: string;
  categoryBadgeColor: string;
  noteTypeBadgeColor: string;
  timeAgo: string;
  recent: boolean;
  private: boolean;
  urgent: boolean;
}

// Health Summary
export interface HealthSummary {
  totalMedicalConditions: number;
  totalAllergies: number;
  activeMedications: number;
  activeGoals: number;
  completedGoals: number;
  overallHealthStatus: string;
}

// Health Overview
export interface HealthOverview {
  overallHealthStatus: string;
  healthScore: number;
  healthTrend: string;
  activeMedications: number;
  criticalAllergies: number;
  activeConditions: number;
  lastVitalsCheck: string;
  latestVitals: {
    current: number;
    average: number;
    minimum: number;
    maximum: number;
    trend: string;
    status: string;
    changeFromPrevious: number;
    changePercentage: string;
  };
  healthAlerts: HealthAlert[];
  medicationSummary: MedicationSummary;
  upcomingReminders: Reminder[];
  goalProgress: GoalProgress[];
}

export interface HealthAlert {
  type: string;
  title: string;
  message: string;
  createdAt: string;
  actionRequired: string;
}

export interface MedicationSummary {
  totalMedications: number;
  activeMedications: number;
  missedDoses: number;
  adherenceRate: number;
  adherenceStatus: string;
}

export interface Reminder {
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

// Disease History
export interface DiseaseHistory {
  id: string;
  patientId: string;
  diseaseName: string;
  diseaseCode: string;
  diagnosisDate: string;
  diagnosedBy: string;
  severity: string;
  status: string;
  description: string;
  treatment: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  formattedDiagnosisDate: string;
  severityBadgeColor: string;
  statusBadgeColor: string;
  daysSinceDiagnosis: number;
  active: boolean;
  critical: boolean;
  chronic: boolean;
}

// Recent Symptoms
export interface RecentSymptom {
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
  timeAgo: string;
  recent: boolean;
  severe: boolean;
}

// Emergency Contacts
export interface EmergencyContact {
  id: string;
  patientId: string;
  fullName: string;
  relationship: string;
  primaryPhone: string;
  secondaryPhone: string;
  email: string;
  address: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  relationshipBadgeColor: string;
  contactInfo: string;
  hasCompleteInfo: boolean;
  active: boolean;
  primary: boolean;
}

// Analytics
export interface Analytics {
  patientId: string;
  analysisPeriodDays: number;
  overallHealthScore: number;
  healthTrend: string;
  vitalsAnalytics: VitalsAnalytics;
  medicationAnalytics: MedicationAnalytics;
  symptomAnalytics: SymptomAnalytics;
  goalAnalytics: GoalAnalytics;
  healthAlerts: AnalyticsAlert[];
  recommendations: Recommendation[];
  healthScoreColor: string;
  healthScoreText: string;
}

export interface VitalsAnalytics {
  averageVitals: {
    systolic: number;
    diastolic: number;
    heartRate: number;
    temperature: number;
  };
  vitalsTrends: {
    temperature: string;
    overall: string;
    heart_rate: string;
    blood_pressure: string;
  };
  abnormalVitals: string[];
  totalVitalsRecords: number;
  lastRecordedDate: string;
}

export interface MedicationAnalytics {
  totalMedications: number;
  activeMedications: number;
  adherenceRate: number;
  missedDoses: number;
  upcomingRefills: any[];
  expiringSoon: any[];
}

export interface SymptomAnalytics {
  totalSymptoms: number;
  symptomFrequency: Record<string, number>;
  mostCommonSymptoms: string[];
  symptomTrend: string;
  concerningPatterns: any[];
}

export interface GoalAnalytics {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  averageProgress: number;
  nearingDeadline: any[];
  overdue: any[];
}

export interface AnalyticsAlert {
  id: string;
  type: string;
  severity: string;
  title: string;
  message: string;
  actionRequired: string;
  createdAt: string;
  read: boolean;
}

export interface Recommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  priority: string;
  actionType: string;
  createdAt: string;
}

// Statistics
export interface Statistics {
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

// Vitals Stats
export interface VitalsStats {
  bloodPressure: VitalStat;
  heartRate: VitalStat;
  temperature: VitalStat;
  oxygenSaturation: VitalStat;
  weight: VitalStat;
  overallHealthStatus: string;
  healthTrend: string;
  lastRecorded: string;
  totalRecords: number;
  daysAnalyzed: number;
}

export interface VitalStat {
  current: number;
  average: number;
  minimum: number;
  maximum: number;
  trend: string;
  status: string;
  changeFromPrevious: number;
  changePercentage: string;
}

// Goal Stats
export interface GoalStats {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  overdueGoals: number;
  completionRate: number;
}

// Symptom Stats Response
export interface SymptomStatsResponse {
  symptomSummaries: any[];
  recentSymptoms: RecentSymptom[];
  totalSymptoms: number;
  generatedAt: string;
}

// Dashboard Data
export interface DashboardData {
  latestVitals: LatestVitals;
  activeMedicalConditions: MedicalCondition[];
  criticalAllergies: Allergy[];
  activeMedications: Medication[];
  activeGoals: HealthGoal[];
  recentDoctorNotes: DoctorNote[];
  healthSummary: HealthSummary;
}

// Complete Patient Profile
export interface PatientProfile {
  dashboard: DashboardData;
  healthOverview: HealthOverview;
  diseaseHistory: DiseaseHistory[];
  medicalHistory: MedicalCondition[];
  allergies: Allergy[];
  medications: Medication[];
  recentVitals: LatestVitals[];
  recentSymptoms: RecentSymptom[];
  healthGoals: HealthGoal[];
  emergencyContacts: EmergencyContact[];
  doctorNotes: DoctorNote[];
  analytics: Analytics;
  statistics: Statistics;
  symptomStatsResponse: SymptomStatsResponse;
  vitalsStats: VitalsStats;
  goalStats: GoalStats;
}
