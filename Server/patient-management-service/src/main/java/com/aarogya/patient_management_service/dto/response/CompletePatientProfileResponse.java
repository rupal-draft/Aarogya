package com.aarogya.patient_management_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompletePatientProfileResponse {

    // Basic Dashboard Data
    private PatientDashboardResponse dashboard;

    // Health Overview with Analytics
    private HealthOverviewResponse healthOverview;

    // Complete Medical Records
    private List<DiseaseHistoryResponse> diseaseHistory;
    private List<MedicalHistoryResponse> medicalHistory;
    private List<PatientAllergyResponse> allergies;
    private List<PatientMedicationResponse> medications;

    // Vitals and Tracking
    private List<PatientVitalsResponse> recentVitals;
    private List<SymptomTrackerResponse> recentSymptoms;

    // Goals and Progress
    private List<HealthGoalResponse> healthGoals;

    // Emergency and Support
    private List<EmergencyContactResponse> emergencyContacts;

    // Doctor Communications
    private List<DoctorNoteResponse> doctorNotes;

    // Health Analytics
    private HealthAnalyticsResponse analytics;

    // Profile Statistics
    private ProfileStatistics statistics;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProfileStatistics {
        private long totalDiseases;
        private long activeDiseases;
        private long chronicDiseases;
        private long totalAllergies;
        private long criticalAllergies;
        private long totalMedications;
        private long activeMedications;
        private long totalVitalsRecords;
        private long totalSymptomRecords;
        private long activeGoals;
        private long completedGoals;
        private long emergencyContacts;
        private String profileCompleteness;
        private String lastUpdated;
    }
}
