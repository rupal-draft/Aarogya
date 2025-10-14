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
public class HealthGoalResponse {

    private String id;
    private String patientId;
    private String goalType;
    private String title;
    private String description;
    private String targetValue;
    private String currentValue;
    private String unit;
    private LocalDate targetDate;
    private String status;
    private String priority;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String formattedTargetDate;
    private String statusBadgeColor;
    private String priorityBadgeColor;
    private double progressPercentage;
    private long daysRemaining;
    private boolean isOverdue;
    private boolean isCompleted;
    private String progressText;

    public String getGoalType() {
        return goalType != null ? goalType : "General";
    }

    public String getTitle() {
        return title != null ? title : "Health Goal";
    }

    public String getDescription() {
        return description != null ? description : "";
    }

    public String getTargetValue() {
        return targetValue != null ? targetValue : "0";
    }

    public String getCurrentValue() {
        return currentValue != null ? currentValue : "0";
    }

    public String getUnit() {
        return unit != null ? unit : "";
    }

    public String getStatus() {
        return status != null ? status : "ACTIVE";
    }

    public String getPriority() {
        return priority != null ? priority : "Medium";
    }

    // Computed getters
    public String getFormattedTargetDate() {
        return targetDate != null ? targetDate.toString() : "";
    }

    public String getStatusBadgeColor() {
        if (status == null) return "gray";
        switch (status.toUpperCase()) {
            case "ACTIVE": return "blue";
            case "COMPLETED": return "green";
            case "PAUSED": return "yellow";
            case "CANCELLED": return "red";
            default: return "gray";
        }
    }

    public String getPriorityBadgeColor() {
        if (priority == null) return "gray";
        switch (priority.toLowerCase()) {
            case "high": return "red";
            case "medium": return "yellow";
            case "low": return "green";
            default: return "gray";
        }
    }

    public double getProgressPercentage() {
        try {
            double target = Double.parseDouble(getTargetValue());
            double current = Double.parseDouble(getCurrentValue());
            if (target == 0) return 0;
            return Math.min(100, (current / target) * 100);
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    public long getDaysRemaining() {
        if (targetDate == null) return 0;
        return java.time.temporal.ChronoUnit.DAYS.between(LocalDate.now(), targetDate);
    }

    public boolean isOverdue() {
        return targetDate != null && targetDate.isBefore(LocalDate.now()) && !"COMPLETED".equalsIgnoreCase(status);
    }

    public boolean isCompleted() {
        return "COMPLETED".equalsIgnoreCase(status);
    }

    public String getProgressText() {
        double progress = getProgressPercentage();
        if (progress >= 100) return "Goal Achieved!";
        if (progress >= 75) return "Almost There!";
        if (progress >= 50) return "Good Progress";
        if (progress >= 25) return "Getting Started";
        return "Just Started";
    }
}
