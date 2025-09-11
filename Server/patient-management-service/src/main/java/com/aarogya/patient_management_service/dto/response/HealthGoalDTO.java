package com.aarogya.patient_management_service.dto.response;


import com.fasterxml.jackson.annotation.JsonInclude;
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
@JsonInclude(JsonInclude.Include.NON_NULL)
public class HealthGoalDTO {
    private String id;
    private String goalType;
    private String title;
    private String description;
    private BigDecimal targetValue;
    private BigDecimal currentValue;
    private String unit;
    private LocalDate targetDate;
    private String status;
    private String priority;
}
