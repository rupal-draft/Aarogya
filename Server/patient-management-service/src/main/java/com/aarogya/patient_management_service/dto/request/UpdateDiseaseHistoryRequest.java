package com.aarogya.patient_management_service.dto.request;

import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateDiseaseHistoryRequest {

    private String diseaseName;
    private String diseaseCode;
    private LocalDate diagnosisDate;
    private String diagnosedBy;

    @Pattern(regexp = "^(Mild|Moderate|Severe|Critical)$", message = "Severity must be Mild, Moderate, Severe, or Critical")
    private String severity;

    @Pattern(regexp = "^(Active|Resolved|Chronic|Under Treatment)$", message = "Status must be Active, Resolved, Chronic, or Under Treatment")
    private String status;

    private Boolean isChronic;
    private String description;
    private String treatment;
    private String notes;

    public void setDiseaseName(String diseaseName) {
        this.diseaseName = diseaseName != null ? diseaseName.trim() : null;
    }

    public void setDiseaseCode(String diseaseCode) {
        this.diseaseCode = diseaseCode != null ? diseaseCode.trim() : null;
    }

    public void setDiagnosedBy(String diagnosedBy) {
        this.diagnosedBy = diagnosedBy != null ? diagnosedBy.trim() : null;
    }

    public void setDescription(String description) {
        this.description = description != null ? description.trim() : null;
    }

    public void setTreatment(String treatment) {
        this.treatment = treatment != null ? treatment.trim() : null;
    }

    public void setNotes(String notes) {
        this.notes = notes != null ? notes.trim() : null;
    }
}
