// types/patientManagement.ts
export interface Patient {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  phone: string;
  address: string;
  imageUrl: string;
  emergencyContact: string;
  emergencyPhone: string;
  createdAt: string;
}

export interface LatestVitals {
  recordedAt: string;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  heartRate: number;
  temperature: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  weight: number;
  height: number;
  bmi: number;
  recordedBy: string;
  recordedByType: string;
  notes: string;
}

export interface ActiveMedication {
  id: string;
  medicationName: string;
  dosage: number;
  dosageUnit: string;
  frequency: string;
  route: string;
  startDate: string;
  prescribedBy: string;
  status: string;
  reminderEnabled: boolean;
  instructions: string;
}

export interface DoctorNote {
  id: string;
  doctorId: string;
  doctorName: string;
  noteType: string;
  title: string;
  content: string;
  priority: string;
  isPrivate: boolean;
  isUrgent: boolean;
  createdAt: string;
}

export interface Disease {
  diseaseName: string;
  diseaseCode: string;
  diagnosisDate: string;
  recoveryDate?: string;
  status: string;
  severity: string;
  isChronic: boolean;
}

export interface Allergy {
  id: string;
  allergen: string;
  allergyType: string;
  severity: string;
  diagnosedDate: string;
  reaction: string;
  emergencyAction: string;
  isActive: boolean;
}

export interface HealthGoal {
  id: string;
  goalType: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  targetDate: string;
  status: string;
  priority: string;
}

export interface EmergencyContact {
  contactName: string;
  relationship: string;
  phoneNumber: string;
  secondaryPhone: string;
  email: string;
  address: string;
  isPrimary: boolean;
}

export interface RecentSymptom {
  symptomName: string;
  severity: number;
  description: string;
  duration: string;
  frequency: string;
  recordedAt: string;
}

export interface MedicalHistory {
  conditionName: string;
  diagnosisDate: string;
  status: string;
  severity: string;
  notes: string;
  category: string;
}

export interface PatientData {
  patient: Patient;
  latestVitals: LatestVitals;
  activeMedications: ActiveMedication[];
  recentDoctorNotes: DoctorNote[];
  diseases: Disease[];
  allergies: Allergy[];
  healthGoals: HealthGoal[];
  primaryEmergencyContact: EmergencyContact;
  recentSymptoms: RecentSymptom[];
  medicalHistory: MedicalHistory[];
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: PatientData;
  timestamp: string;
}
