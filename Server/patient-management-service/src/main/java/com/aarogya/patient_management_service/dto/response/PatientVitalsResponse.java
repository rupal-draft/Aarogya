package com.aarogya.patient_management_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientVitalsResponse {

    private String id;
    private String patientId;
    private Integer bloodPressureSystolic;
    private Integer bloodPressureDiastolic;
    private Integer heartRate;
    private Double temperature;
    private Double weight;
    private Double height;
    private Double bmi;
    private String healthStatus;
    private String notes;
    private String recordedByType;
    private String recordedById;
    private LocalDateTime recordedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public String getBloodPressureDisplay() {
        if (bloodPressureSystolic != null && bloodPressureDiastolic != null) {
            return bloodPressureSystolic + "/" + bloodPressureDiastolic + " mmHg";
        }
        return "N/A";
    }

    public String getTemperatureDisplay() {
        if (temperature != null) {
            return String.format("%.1f°C", temperature);
        }
        return "N/A";
    }

    public String getWeightDisplay() {
        if (weight != null) {
            return String.format("%.1f kg", weight);
        }
        return "N/A";
    }

    public String getHeightDisplay() {
        if (height != null) {
            return String.format("%.0f cm", height);
        }
        return "N/A";
    }

    public String getBmiDisplay() {
        if (bmi != null) {
            return String.format("%.1f", bmi);
        }
        return "N/A";
    }

    public String getBmiCategory() {
        if (bmi == null) return "Unknown";

        if (bmi < 18.5) return "Underweight";
        else if (bmi < 25.0) return "Normal";
        else if (bmi < 30.0) return "Overweight";
        else return "Obese";
    }

    public boolean isAbnormal() {
        return "ABNORMAL".equalsIgnoreCase(healthStatus);
    }
}

