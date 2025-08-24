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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "patient_medications")
public class PatientMedication {

    @Id
    private String id;

    @Indexed
    @NotBlank(message = "Patient ID is required")
    private String patientId;

    @NotBlank(message = "Medication name is required")
    private String medicationName;

    @NotNull(message = "Dosage is required")
    private BigDecimal dosage;

    private String dosageUnit;

    @NotBlank(message = "Frequency is required")
    private String frequency;

    private String route;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    private LocalDate endDate;

    private String prescribedBy;

    @Indexed
    @Builder.Default
    private String status = "ACTIVE";

    private String reason;
    private String instructions;
    private String sideEffects;
    private String notes;
    private String medicationType;
    private String purpose;

    @Builder.Default
    private Boolean reminderEnabled = false;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}

