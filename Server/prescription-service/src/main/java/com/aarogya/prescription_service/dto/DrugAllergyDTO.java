package com.aarogya.prescription_service.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DrugAllergyDTO {

    private String id;

    @NotBlank(message = "Patient ID is required")
    private String patientId;

    @NotBlank(message = "Allergen is required")
    private String allergen;

    private String allergenType;
    private String severity;
    private String reaction;
    private String symptoms;

    private String onsetDate;
    private String diagnosedBy;
    private String verificationStatus;

    private String notes;
    private boolean isActive;
    private String inactivatedBy;
    private LocalDateTime inactivatedAt;
    private String inactivationReason;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
