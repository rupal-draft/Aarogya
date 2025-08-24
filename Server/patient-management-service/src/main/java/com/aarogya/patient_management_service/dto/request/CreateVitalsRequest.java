package com.aarogya.patient_management_service.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateVitalsRequest {

    @NotNull(message = "Systolic pressure is required")
    @Min(value = 50, message = "Systolic pressure must be at least 50")
    @Max(value = 300, message = "Systolic pressure must not exceed 300")
    private Integer bloodPressureSystolic;

    @NotNull(message = "Diastolic pressure is required")
    @Min(value = 30, message = "Diastolic pressure must be at least 30")
    @Max(value = 200, message = "Diastolic pressure must not exceed 200")
    private Integer bloodPressureDiastolic;

    @NotNull(message = "Heart rate is required")
    @Min(value = 30, message = "Heart rate must be at least 30")
    @Max(value = 250, message = "Heart rate must not exceed 250")
    private Integer heartRate;

    @NotNull(message = "Temperature is required")
    @DecimalMin(value = "35.0", message = "Temperature must be at least 35°C")
    @DecimalMax(value = "42.0", message = "Temperature must not exceed 42°C")
    private Double temperature;

    @Min(value = 8, message = "Respiratory rate must be at least 8")
    @Max(value = 60, message = "Respiratory rate must not exceed 60")
    private Integer respiratoryRate;

    @Min(value = 80, message = "Oxygen saturation must be at least 80%")
    @Max(value = 100, message = "Oxygen saturation must not exceed 100%")
    private Integer oxygenSaturation;

    @NotNull(message = "Weight is required")
    @DecimalMin(value = "2.0", message = "Weight must be at least 2 kg")
    @DecimalMax(value = "500.0", message = "Weight must not exceed 500 kg")
    private Double weight;

    @NotNull(message = "Height is required")
    @DecimalMin(value = "30.0", message = "Height must be at least 30 cm")
    @DecimalMax(value = "250.0", message = "Height must not exceed 250 cm")
    private Double height;

    private String notes;
}
