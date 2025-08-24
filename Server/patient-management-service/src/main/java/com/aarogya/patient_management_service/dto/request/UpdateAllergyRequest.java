package com.aarogya.patient_management_service.dto.request;

import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAllergyRequest {

    private String allergen;

    @Pattern(regexp = "MILD|MODERATE|SEVERE|CRITICAL",
            message = "Severity must be MILD, MODERATE, SEVERE, or CRITICAL")
    private String severity;

    private String reaction;

    private String notes;

    private String allergyType;

    private List<String> symptoms;

    private LocalDate diagnosedDate;

    private String diagnosedBy;

    private Boolean isActive;

    private String emergencyAction;

    public void setAllergen(String allergen) {
        this.allergen = allergen != null ? allergen.trim() : this.allergen;
    }

    public void setSeverity(String severity) {
        this.severity = severity != null ? severity.toUpperCase().trim() : this.severity;
    }

    public void setReaction(String reaction) {
        this.reaction = reaction != null ? reaction.trim() : this.reaction;
    }

    public void setNotes(String notes) {
        this.notes = notes != null ? notes.trim() : this.notes;
    }

    public void setDiagnosedBy(String diagnosedBy) {
        this.diagnosedBy = diagnosedBy != null ? diagnosedBy.trim() : this.diagnosedBy;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive != null ? isActive : this.isActive;
    }

    public void setEmergencyAction(String emergencyAction) {
        this.emergencyAction = emergencyAction != null ? emergencyAction.trim() : this.emergencyAction;
    }
}
