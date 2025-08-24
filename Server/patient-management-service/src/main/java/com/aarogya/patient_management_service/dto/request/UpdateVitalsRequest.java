package com.aarogya.patient_management_service.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateVitalsRequest {

    @DecimalMin(value = "50.0", message = "Systolic pressure must be at least 50")
    @DecimalMax(value = "300.0", message = "Systolic pressure must not exceed 300")
    private BigDecimal systolicPressure;

    @DecimalMin(value = "30.0", message = "Diastolic pressure must be at least 30")
    @DecimalMax(value = "200.0", message = "Diastolic pressure must not exceed 200")
    private BigDecimal diastolicPressure;

    @DecimalMin(value = "30.0", message = "Heart rate must be at least 30")
    @DecimalMax(value = "250.0", message = "Heart rate must not exceed 250")
    private BigDecimal heartRate;

    @DecimalMin(value = "90.0", message = "Temperature must be at least 90°F")
    @DecimalMax(value = "115.0", message = "Temperature must not exceed 115°F")
    private BigDecimal temperature;

    @DecimalMin(value = "80.0", message = "Oxygen saturation must be at least 80%")
    @DecimalMax(value = "100.0", message = "Oxygen saturation must not exceed 100%")
    private BigDecimal oxygenSaturation;

    @DecimalMin(value = "8.0", message = "Respiratory rate must be at least 8")
    @DecimalMax(value = "60.0", message = "Respiratory rate must not exceed 60")
    private BigDecimal respiratoryRate;

    @DecimalMin(value = "50.0", message = "Weight must be at least 50 lbs")
    @DecimalMax(value = "1000.0", message = "Weight must not exceed 1000 lbs")
    private BigDecimal weight;

    @DecimalMin(value = "36.0", message = "Height must be at least 36 inches")
    @DecimalMax(value = "96.0", message = "Height must not exceed 96 inches")
    private BigDecimal height;

    private LocalDateTime recordedAt;

    private String recordedBy;

    private String notes;

    public void setRecordedAt(LocalDateTime recordedAt) {
        this.recordedAt = recordedAt != null ? recordedAt : this.recordedAt;
    }

    public void setRecordedBy(String recordedBy) {
        this.recordedBy = recordedBy != null ? recordedBy.trim() : this.recordedBy;
    }

    public void setNotes(String notes) {
        this.notes = notes != null ? notes.trim() : this.notes;
    }
}
