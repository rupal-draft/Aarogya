package com.aarogya.patient_management_service.dto.request;

import jakarta.validation.constraints.*;
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
public class CreateSymptomTrackerRequest {

    @NotBlank(message = "Symptom name is required")
    @Size(max = 100, message = "Symptom name cannot exceed 100 characters")
    private String symptomName;

    @Size(max = 50, message = "Category cannot exceed 50 characters")
    private String category;

    @NotNull(message = "Severity is required")
    @Min(value = 1, message = "Severity must be between 1 and 10")
    @Max(value = 10, message = "Severity must be between 1 and 10")
    private Integer severity;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    @Size(max = 20, message = "Cannot have more than 20 triggers")
    private List<@Size(max = 50, message = "Trigger cannot exceed 50 characters") String> triggers;

    @Size(max = 50, message = "Duration cannot exceed 50 characters")
    private String duration;

    @Size(max = 50, message = "Frequency cannot exceed 50 characters")
    private String frequency;

    @Size(max = 10, message = "Cannot have more than 10 associated symptoms")
    private List<@Size(max = 100, message = "Associated symptom cannot exceed 100 characters") String> associatedSymptoms;

    @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
    private String notes;

    private LocalDateTime recordedAt;
}
