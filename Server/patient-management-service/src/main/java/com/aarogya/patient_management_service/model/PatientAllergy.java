package com.aarogya.patient_management_service.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "patient_allergies")
public class PatientAllergy {

    @Id
    private String id;

    @Indexed
    @NotBlank(message = "Patient ID is required")
    private String patientId;

    @NotBlank(message = "Allergen is required")
    private String allergen;

    @Indexed
    @NotBlank(message = "Allergy type is required")
    private String allergyType;

    @Indexed
    @NotBlank(message = "Severity is required")
    @Pattern(regexp = "MILD|MODERATE|SEVERE|CRITICAL", message = "Severity must be MILD, MODERATE, SEVERE, or CRITICAL")
    private String severity;

    private List<String> symptoms;

    private String reaction;

    private String notes;

    private String emergencyAction;

    @NotNull(message = "Diagnosed date is required")
    private LocalDate diagnosedDate;

    private String diagnosedBy;

    @Builder.Default
    private Boolean isActive = true;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}

