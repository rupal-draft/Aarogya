package com.aarogya.doctor_service.dto.availability.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimeSlotRequest {
    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    @Min(value = 0, message = "Booked count cannot be negative")
    private Integer bookedCount;

    @Min(value = 0, message = "Available slots cannot be negative")
    private Integer availableSlots;

    @NotNull(message = "Availability status is required")
    private Boolean isAvailable;

    private String reasonForUnavailability;
}
