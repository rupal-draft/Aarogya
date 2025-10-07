package com.aarogya.patient_management_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientAllergyResponse {

    private String id;
    private String patientId;
    private String allergen;
    private String allergyType;
    private String severity;
    private List<String> symptoms;
    private String emergencyAction;
    private String notes;
    private String reaction;
    private Boolean isActive;
    private LocalDateTime diagnosedDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public boolean isCritical() {
        return "SEVERE".equalsIgnoreCase(severity) || "CRITICAL".equalsIgnoreCase(severity);
    }

    public String getSeverityColor() {
        if (severity == null) return "gray";

        return switch (severity.toUpperCase()) {
            case "MILD" -> "green";
            case "MODERATE" -> "yellow";
            case "SEVERE" -> "orange";
            case "CRITICAL" -> "red";
            default -> "gray";
        };
    }

    public String getSeverityIcon() {
        if (severity == null) return "info";

        return switch (severity.toUpperCase()) {
            case "MILD" -> "check-circle";
            case "MODERATE" -> "exclamation-circle";
            case "SEVERE" -> "exclamation-triangle";
            case "CRITICAL" -> "times-circle";
            default -> "info";
        };
    }

    public String getFormattedSymptoms() {
        if (symptoms == null || symptoms.isEmpty()) {
            return "No symptoms recorded";
        }
        return String.join(", ", symptoms);
    }

    public boolean hasEmergencyAction() {
        return emergencyAction != null && !emergencyAction.trim().isEmpty();
    }
}
