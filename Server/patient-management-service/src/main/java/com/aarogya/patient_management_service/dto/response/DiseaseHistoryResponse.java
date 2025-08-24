package com.aarogya.patient_management_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiseaseHistoryResponse {

    private String id;
    private String patientId;
    private String diseaseName;
    private String diseaseCode;
    private LocalDate diagnosisDate;
    private String diagnosedBy;
    private String severity;
    private String status;
    private boolean isChronic;
    private String description;
    private String treatment;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String formattedDiagnosisDate;
    private String severityBadgeColor;
    private String statusBadgeColor;
    private boolean isActive;
    private boolean isCritical;
    private long daysSinceDiagnosis;

    public String getDiseaseName() {
        return diseaseName != null ? diseaseName : "Unknown Disease";
    }

    public String getDiseaseCode() {
        return diseaseCode != null ? diseaseCode : "";
    }

    public String getDiagnosedBy() {
        return diagnosedBy != null ? diagnosedBy : "Unknown Doctor";
    }

    public String getSeverity() {
        return severity != null ? severity : "Mild";
    }

    public String getStatus() {
        return status != null ? status : "Active";
    }

    public String getDescription() {
        return description != null ? description : "";
    }

    public String getTreatment() {
        return treatment != null ? treatment : "";
    }

    public String getNotes() {
        return notes != null ? notes : "";
    }

    public String getFormattedDiagnosisDate() {
        return diagnosisDate != null ? diagnosisDate.toString() : "";
    }

    public String getSeverityBadgeColor() {
        if (severity == null) return "gray";
        return switch (severity.toLowerCase()) {
            case "mild" -> "green";
            case "moderate" -> "yellow";
            case "severe" -> "orange";
            case "critical" -> "red";
            default -> "gray";
        };
    }

    public String getStatusBadgeColor() {
        if (status == null) return "gray";
        return switch (status.toLowerCase()) {
            case "active" -> "red";
            case "resolved" -> "green";
            case "chronic" -> "orange";
            case "under treatment" -> "blue";
            default -> "gray";
        };
    }

    public boolean isActive() {
        return "Active".equalsIgnoreCase(status) || "Under Treatment".equalsIgnoreCase(status);
    }

    public boolean isCritical() {
        return "Critical".equalsIgnoreCase(severity) || "Severe".equalsIgnoreCase(severity);
    }

    public long getDaysSinceDiagnosis() {
        if (diagnosisDate == null) return 0;
        return java.time.temporal.ChronoUnit.DAYS.between(diagnosisDate, LocalDate.now());
    }
}
