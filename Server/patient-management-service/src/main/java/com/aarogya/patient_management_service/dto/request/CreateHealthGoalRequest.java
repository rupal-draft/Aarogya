package com.aarogya.patient_management_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class CreateHealthGoalRequest {

    @NotBlank(message = "Goal type is required")
    private String goalType;

    @NotBlank(message = "Goal description is required")
    private String description;

    private BigDecimal targetValue;

    private BigDecimal currentValue;

    private String unit = "";

    @NotNull(message = "Target date is required")
    private LocalDate targetDate;

    private String notes = "";
}
