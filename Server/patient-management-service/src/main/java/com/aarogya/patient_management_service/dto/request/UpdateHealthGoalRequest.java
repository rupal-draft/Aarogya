package com.aarogya.patient_management_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateHealthGoalRequest {

    private String goalType;
    private String title;
    private String description;
    private BigDecimal targetValue;
    private BigDecimal currentValue;
    private String unit;
    private LocalDate targetDate;
    private String status;
    private String priority;
    private String notes;
}
