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
public class PatientDashboardResponse {
    private PatientVitalsResponse latestVitals;
    private List<MedicalHistoryResponse> activeMedicalConditions;
    private List<PatientAllergyResponse> criticalAllergies;
    private List<PatientMedicationResponse> activeMedications;
    private List<HealthGoalResponse> activeGoals;
    private List<DoctorNoteResponse> recentDoctorNotes;
    private PatientHealthSummary healthSummary;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PatientHealthSummary {
        private long totalMedicalConditions;
        private long totalAllergies;
        private long activeMedications;
        private long activeGoals;
        private long completedGoals;
        private String overallHealthStatus;
    }
}
