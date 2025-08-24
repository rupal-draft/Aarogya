package com.aarogya.patient_management_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class CreateDiseaseHistoryRequest {

    @NotBlank(message = "Disease name is required")
    private String diseaseName;

    private String diseaseCode;

    @NotNull(message = "Diagnosis date is required")
    private LocalDate diagnosisDate;

    @NotBlank(message = "Diagnosed by is required")
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
        this.diseaseName = diseaseName != null ? diseaseName.trim() : "";
    }

    public void setDiseaseCode(String diseaseCode) {
        this.diseaseCode = diseaseCode != null ? diseaseCode.trim() : "";
    }

    public void setDiagnosedBy(String diagnosedBy) {
        this.diagnosedBy = diagnosedBy != null ? diagnosedBy.trim() : "";
    }

    public void setSeverity(String severity) {
        this.severity = severity != null ? severity : "Mild";
    }

    public void setStatus(String status) {
        this.status = status != null ? status : "Active";
    }

    public void setIsChronic(Boolean isChronic) {
        this.isChronic = isChronic != null ? isChronic : false;
    }

    public void setDescription(String description) {
        this.description = description != null ? description.trim() : "";
    }

    public void setTreatment(String treatment) {
        this.treatment = treatment != null ? treatment.trim() : "";
    }

    public void setNotes(String notes) {
        this.notes = notes != null ? notes.trim() : "";
    }
}
