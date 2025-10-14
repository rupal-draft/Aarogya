package com.aarogya.patient_management_service.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
@JsonIgnoreProperties(ignoreUnknown = true)
public class SymptomTrackerResponse {

    private String id;
    private String patientId;
    private String symptomName;
    private String category;
    private int severityLevel;
    private String description;
    private List<String> triggers;
    private String duration;
    private String frequency;
    private List<String> associatedSymptoms;
    private String notes;
    private LocalDateTime recordedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String formattedRecordedAt;
    private String severityText;
    private String severityBadgeColor;
    private String categoryBadgeColor;
    private boolean isSevere;
    private boolean isRecent;
    private String timeAgo;

    public String getSymptomName() {
        return symptomName != null ? symptomName : "Unknown Symptom";
    }

    public String getCategory() {
        return category != null ? category : "General";
    }

    public String getDescription() {
        return description != null ? description : "";
    }

    public String getDuration() {
        return duration != null ? duration : "";
    }

    public String getFrequency() {
        return frequency != null ? frequency : "";
    }

    public String getNotes() {
        return notes != null ? notes : "";
    }

    public List<String> getTriggers() {
        return triggers != null ? triggers : List.of();
    }

    public List<String> getAssociatedSymptoms() {
        return associatedSymptoms != null ? associatedSymptoms : List.of();
    }

    public String getFormattedRecordedAt() {
        return recordedAt != null ? recordedAt.toString() : "";
    }

    public String getSeverityText() {
        return switch (severityLevel) {
            case 1 -> "Mild";
            case 2 -> "Mild-Moderate";
            case 3 -> "Moderate";
            case 4 -> "Moderate-Severe";
            case 5 -> "Severe";
            default -> "Unknown";
        };
    }

    public String getSeverityBadgeColor() {
        return switch (severityLevel) {
            case 1 -> "green";
            case 2 -> "yellow";
            case 3 -> "orange";
            case 4 -> "red";
            case 5 -> "darkred";
            default -> "gray";
        };
    }

    public String getCategoryBadgeColor() {
        if (category == null) return "gray";
        return switch (category.toLowerCase()) {
            case "pain" -> "red";
            case "respiratory" -> "blue";
            case "digestive" -> "green";
            case "neurological" -> "purple";
            case "cardiovascular" -> "pink";
            case "mental health" -> "teal";
            default -> "gray";
        };
    }

    public boolean isSevere() {
        return severityLevel >= 4;
    }

    public boolean isRecent() {
        if (recordedAt == null) return false;
        return recordedAt.isAfter(LocalDateTime.now().minusHours(24));
    }

    public String getTimeAgo() {
        if (recordedAt == null) return "";

        long hours = java.time.temporal.ChronoUnit.HOURS.between(recordedAt, LocalDateTime.now());
        if (hours < 1) return "Just now";
        if (hours < 24) return hours + " hours ago";

        long days = java.time.temporal.ChronoUnit.DAYS.between(recordedAt.toLocalDate(), LocalDateTime.now().toLocalDate());
        if (days == 1) return "Yesterday";
        if (days < 7) return days + " days ago";
        if (days < 30) return (days / 7) + " weeks ago";
        return (days / 30) + " months ago";
    }
}

