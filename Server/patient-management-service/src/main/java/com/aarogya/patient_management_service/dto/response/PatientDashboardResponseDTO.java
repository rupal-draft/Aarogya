package com.aarogya.patient_management_service.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PatientDashboardResponseDTO {
    private PatientResponseDTO patient;
    private LatestVitalsDTO latestVitals;
    private List<ActiveMedicationDTO> activeMedications;
    private List<RecentDoctorNoteDTO> recentDoctorNotes;
    private List<DiseaseSummaryDTO> diseases;
    private List<AllergyDTO> allergies;
    private List<HealthGoalDTO> healthGoals;
    private EmergencyContactDTO primaryEmergencyContact;
    private List<SymptomDTO> recentSymptoms;
    private List<MedicalHistoryDTO> medicalHistory;
}
