package com.aarogya.patient_management_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateAllergyRequest {

    @NotBlank(message = "Allergen is required")
    private String allergen;

    @NotBlank(message = "Severity is required")
    private String severity;

    private String reaction = "";

    @NotNull(message = "Diagnosed date is required")
    private LocalDate diagnosedDate;

    private String allergyType = "General";

    private boolean isActive = true;

    private String emergencyAction = "";
}
