package com.aarogya.patient_management_service.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
@JsonIgnoreProperties(ignoreUnknown = true)
public class MedicalHistoryResponse {
    private String id;
    private String conditionName;
    private LocalDate diagnosisDate;
    private String status;
    private String notes;
    private String severity;
    private String category;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String formattedDiagnosisDate;
    private String statusBadgeColor;
    private String severityBadgeColor;
    private String categoryBadgeColor;
    private boolean isCritical;
    private long daysSinceDiagnosis;
    private String timeAgo;

    public String getConditionName() {
        return conditionName != null ? conditionName : "Unknown Condition";
    }

    public String getStatus() {
        return status != null ? status : "Active";
    }

    public String getNotes() {
        return notes != null ? notes : "";
    }

    public String getSeverity() {
        return severity != null ? severity : "Mild";
    }

    public String getCategory() {
        return category != null ? category : "General";
    }

    public String getFormattedDiagnosisDate() {
        return diagnosisDate != null ? diagnosisDate.toString() : "";
    }

    public String getStatusBadgeColor() {
        if (status == null) return "gray";
        return switch (status.toLowerCase()) {
            case "active" -> "red";
            case "resolved" -> "green";
            case "chronic" -> "orange";
            case "under treatment" -> "blue";
            case "monitoring" -> "yellow";
            default -> "gray";
        };
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

    public String getCategoryBadgeColor() {
        if (category == null) return "gray";
        return switch (category.toLowerCase()) {
            case "cardiovascular" -> "red";
            case "respiratory" -> "blue";
            case "neurological" -> "purple";
            case "digestive" -> "green";
            case "endocrine" -> "orange";
            case "mental health" -> "teal";
            case "musculoskeletal" -> "brown";
            default -> "gray";
        };
    }

    public boolean isCritical() {
        return "Critical".equalsIgnoreCase(severity) || "Severe".equalsIgnoreCase(severity);
    }

    public long getDaysSinceDiagnosis() {
        if (diagnosisDate == null) return 0;
        return java.time.temporal.ChronoUnit.DAYS.between(diagnosisDate, LocalDate.now());
    }

    public String getTimeAgo() {
        if (diagnosisDate == null) return "";

        long days = getDaysSinceDiagnosis();
        if (days == 0) return "Today";
        if (days == 1) return "Yesterday";
        if (days < 7) return days + " days ago";
        if (days < 30) return (days / 7) + " weeks ago";
        if (days < 365) return (days / 30) + " months ago";
        return (days / 365) + " years ago";
    }
}
