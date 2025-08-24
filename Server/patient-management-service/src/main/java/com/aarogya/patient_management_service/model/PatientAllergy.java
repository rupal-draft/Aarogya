package com.aarogya.patient_management_service.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
    @NotBlank(message = "Severity is required")
    private String severity;

    private String reaction;

    @NotNull(message = "Diagnosed date is required")
    private LocalDate diagnosedDate;

    @Indexed
    private String allergyType;

    private boolean isActive;

    private String emergencyAction;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}

