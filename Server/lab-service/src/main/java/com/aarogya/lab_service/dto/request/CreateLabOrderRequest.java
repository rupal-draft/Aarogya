package com.aarogya.lab_service.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateLabOrderRequest {

    @NotEmpty(message = "At least one test must be selected")
    private List<String> testIds;

    private String doctorId;

    @NotNull(message = "Scheduled date time is required")
    @Future(message = "Scheduled date time must be in the future")
    private LocalDateTime scheduledDateTime;

    @NotBlank(message = "Location is required")
    private String location;

    @Size(max = 500, message = "Special instructions cannot exceed 500 characters")
    private String specialInstructions;
}
