package com.aarogya.appointment_service.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmergencyAppointmentDto {

    @NotEmpty(message = "Symptoms are required for emergency appointment")
    @Size(max = 10, message = "Maximum 10 symptoms allowed")
    private List<@NotBlank String> symptoms;

    @NotBlank(message = "Emergency description is required")
    @Size(max = 1000, message = "Emergency description cannot exceed 1000 characters")
    private String emergencyDescription;

    private String preferredSpecialization;

    @Min(value = 1, message = "Priority must be between 1 and 5")
    @Max(value = 5, message = "Priority must be between 1 and 5")
    private Integer priority = 5;
}
