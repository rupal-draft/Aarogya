package com.aarogya.appointment_service.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FollowUpRequestDto {

    @NotNull(message = "Recommended date is required")
    @Future(message = "Recommended date must be in the future")
    private LocalDate recommendedDate;

    @NotBlank(message = "Reason is required")
    @Size(max = 500, message = "Reason cannot exceed 500 characters")
    private String reason;

    @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
    private String notes;

    @Min(value = 1, message = "Urgency level must be between 1 and 5")
    @Max(value = 5, message = "Urgency level must be between 1 and 5")
    private Integer urgencyLevel = 1;

    @NotBlank(message = "Patient ID is required")
    private String patientId;
}
