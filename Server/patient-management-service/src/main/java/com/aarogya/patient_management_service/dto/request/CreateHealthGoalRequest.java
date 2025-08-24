package com.aarogya.patient_management_service.dto.request;

import jakarta.validation.constraints.*;
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
    @Size(max = 50, message = "Goal type cannot exceed 50 characters")
    private String goalType;

    @Size(max = 100, message = "Title cannot exceed 100 characters")
    private String title;

    @NotBlank(message = "Goal description is required")
    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    @DecimalMin(value = "0.0", inclusive = false, message = "Target value must be positive")
    private BigDecimal targetValue;

    @DecimalMin(value = "0.0", message = "Current value cannot be negative")
    private BigDecimal currentValue;

    @Size(max = 20, message = "Unit cannot exceed 20 characters")
    private String unit;

    @NotNull(message = "Target date is required")
    @FutureOrPresent(message = "Target date cannot be in the past")
    private LocalDate targetDate;

    @Pattern(regexp = "HIGH|MEDIUM|LOW", message = "Priority must be HIGH, MEDIUM, or LOW")
    private String priority;

    @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
    private String notes;
}
