package com.aarogya.patient_management_service.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class DoctorNoteResponse {

    private String id;
    private String patientId;
    private String doctorId;
    private String doctorName;
    private String noteType;
    private String title;
    private String content;
    private String category;
    private boolean isPrivate;
    private boolean isUrgent;
    private String priority;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String formattedCreatedAt;
    private String categoryBadgeColor;
    private String noteTypeBadgeColor;
    private boolean isRecent;
    private String timeAgo;

    public String getDoctorName() {
        return doctorName != null ? doctorName : "Unknown Doctor";
    }

    public String getNoteType() {
        return noteType != null ? noteType : "General";
    }

    public String getTitle() {
        return title != null ? title : "Doctor Note";
    }

    public String getContent() {
        return content != null ? content : "";
    }

    public String getCategory() {
        return category != null ? category : "General";
    }

    public String getFormattedCreatedAt() {
        return createdAt != null ? createdAt.toString() : "";
    }

    public String getCategoryBadgeColor() {
        if (category == null) return "gray";
        return switch (category.toLowerCase()) {
            case "diagnosis" -> "blue";
            case "treatment" -> "green";
            case "prescription" -> "purple";
            case "follow-up" -> "orange";
            case "urgent" -> "red";
            default -> "gray";
        };
    }

    public String getNoteTypeBadgeColor() {
        if (noteType == null) return "gray";
        return switch (noteType.toLowerCase()) {
            case "consultation" -> "blue";
            case "examination" -> "green";
            case "lab-review" -> "purple";
            case "follow-up" -> "orange";
            default -> "gray";
        };
    }

    public boolean isRecent() {
        if (createdAt == null) return false;
        return createdAt.isAfter(LocalDateTime.now().minusDays(7));
    }

    public String getTimeAgo() {
        if (createdAt == null) return "";

        long days = java.time.temporal.ChronoUnit.DAYS.between(createdAt.toLocalDate(), LocalDateTime.now().toLocalDate());
        if (days == 0) return "Today";
        if (days == 1) return "Yesterday";
        if (days < 7) return days + " days ago";
        if (days < 30) return (days / 7) + " weeks ago";
        if (days < 365) return (days / 30) + " months ago";
        return (days / 365) + " years ago";
    }
}
