package com.aarogya.lab_service.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SymptomAnalysisRequestDto {

    @NotBlank(message = "Patient ID is required")
    private String patientId;

    @NotEmpty(message = "At least one symptom must be provided")
    private List<@NotBlank String> symptoms;

    @Min(value = 1, message = "Duration must be at least 1 day")
    @Max(value = 365, message = "Duration cannot exceed 365 days")
    private Integer durationInDays;

    @Pattern(regexp = "MILD|MODERATE|SEVERE", message = "Severity must be MILD, MODERATE, or SEVERE")
    private String severity = "MODERATE";

    private String additionalNotes;

    private List<String> currentMedications;

    private List<String> allergies;
}
