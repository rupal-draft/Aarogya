package com.aarogya.patient_management_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateVitalsRequest {

    private String appointmentId = "";

    private String bloodPressure = "";

    private Integer heartRate;

    private BigDecimal temperature;

    private Integer respiratoryRate;

    private Integer oxygenSaturation;

    private BigDecimal weight;

    private BigDecimal height;

    private String notes = "";
}
