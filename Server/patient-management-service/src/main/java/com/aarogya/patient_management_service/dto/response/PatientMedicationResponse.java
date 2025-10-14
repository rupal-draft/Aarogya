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
public class PatientMedicationResponse {

    private String id;
    private String patientId;
    private String medicationName;
    private String dosage;
    private String frequency;
    private String route;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private String prescribedBy;
    private String reason;
    private String instructions;
    private String sideEffects;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String formattedStartDate;
    private String formattedEndDate;
    private String statusBadgeColor;
    private boolean isActive;
    private boolean isExpired;
    private long daysRemaining;
    private String durationText;

    public String getMedicationName() {
        return medicationName != null ? medicationName : "Unknown Medication";
    }

    public String getDosage() {
        return dosage != null ? dosage : "";
    }

    public String getFrequency() {
        return frequency != null ? frequency : "";
    }

    public String getRoute() {
        return route != null ? route : "Oral";
    }

    public String getStatus() {
        return status != null ? status : "Active";
    }

    public String getPrescribedBy() {
        return prescribedBy != null ? prescribedBy : "Unknown Doctor";
    }

    public String getReason() {
        return reason != null ? reason : "";
    }

    public String getInstructions() {
        return instructions != null ? instructions : "";
    }

    public String getSideEffects() {
        return sideEffects != null ? sideEffects : "";
    }

    public String getNotes() {
        return notes != null ? notes : "";
    }

    // Computed getters
    public String getFormattedStartDate() {
        return startDate != null ? startDate.toString() : "";
    }

    public String getFormattedEndDate() {
        return endDate != null ? endDate.toString() : "Ongoing";
    }

    public String getStatusBadgeColor() {
        if (status == null) return "gray";
        return switch (status.toLowerCase()) {
            case "active" -> "green";
            case "completed" -> "blue";
            case "discontinued" -> "red";
            case "paused" -> "yellow";
            default -> "gray";
        };
    }

    public boolean isActive() {
        return "Active".equalsIgnoreCase(status);
    }

    public boolean isExpired() {
        return endDate != null && endDate.isBefore(LocalDate.now());
    }

    public long getDaysRemaining() {
        if (endDate == null || isExpired()) return 0;
        return java.time.temporal.ChronoUnit.DAYS.between(LocalDate.now(), endDate);
    }

    public String getDurationText() {
        if (startDate == null) return "";
        if (endDate == null) return "Ongoing since " + startDate.toString();

        long totalDays = java.time.temporal.ChronoUnit.DAYS.between(startDate, endDate);
        if (totalDays < 30) {
            return totalDays + " days";
        } else if (totalDays < 365) {
            return (totalDays / 30) + " months";
        } else {
            return (totalDays / 365) + " years";
        }
    }
}
