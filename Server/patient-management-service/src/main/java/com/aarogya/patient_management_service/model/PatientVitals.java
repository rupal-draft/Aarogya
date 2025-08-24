package com.aarogya.patient_management_service.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "patient_vitals")
public class PatientVitals {

    @Id
    private String id;

    @Indexed
    @NotBlank(message = "Patient ID is required")
    private String patientId;

    private String appointmentId;

    private String bloodPressure;

    private Integer heartRate;

    private BigDecimal temperature;

    private Integer respiratoryRate;

    private Integer oxygenSaturation;

    private BigDecimal weight;

    private BigDecimal height;

    private BigDecimal bmi;

    private String notes;

    private String recordedBy;

    @Indexed
    @Builder.Default
    private String recordedByType = "SELF";

    @NotNull(message = "Recorded date is required")
    @CreatedDate
    private LocalDateTime recordedAt;
}
