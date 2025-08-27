package com.aarogya.patient_management_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyContactResponse {

    private String id;
    private String patientId;
    private String contactName;
    private String relationship;
    private String phoneNumber;
    private String secondaryPhone;
    private String email;
    private String address;
    private boolean isPrimary;
    private boolean isActive;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String relationshipBadgeColor;
    private String contactInfo;
    private boolean hasCompleteInfo;

    public String getFullName() {
        return contactName != null ? contactName : "Unknown Contact";
    }

    public String getRelationship() {
        return relationship != null ? relationship : "Emergency Contact";
    }

    public String getPrimaryPhone() {
        return phoneNumber != null ? phoneNumber : "";
    }
    public String getSecondaryPhone() {
        return secondaryPhone != null ? secondaryPhone : "";
    }

    public String getEmail() {
        return email != null ? email : "";
    }

    public String getAddress() {
        return address != null ? address : "";
    }

    public String getNotes() {
        return notes != null ? notes : "";
    }

    public String getRelationshipBadgeColor() {
        if (relationship == null) return "gray";
        return switch (relationship.toLowerCase()) {
            case "spouse" -> "pink";
            case "parent" -> "blue";
            case "child" -> "green";
            case "sibling" -> "purple";
            case "friend" -> "orange";
            case "guardian" -> "red";
            default -> "gray";
        };
    }

    public String getContactInfo() {
        StringBuilder info = new StringBuilder();
        if (getPrimaryPhone() != null && !getPrimaryPhone().isEmpty()) {
            info.append(getPrimaryPhone());
        }
        if (getEmail() != null && !getEmail().isEmpty()) {
            if (!info.isEmpty()) info.append(" • ");
            info.append(getEmail());
        }
        return info.toString();
    }

    public boolean hasCompleteInfo() {
        return getFullName() != null && !getFullName().isEmpty() &&
                getPrimaryPhone() != null && !getPrimaryPhone().isEmpty() &&
                getRelationship() != null && !getRelationship().isEmpty();
    }
}
