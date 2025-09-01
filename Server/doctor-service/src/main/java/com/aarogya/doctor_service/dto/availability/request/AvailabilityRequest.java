package com.aarogya.doctor_service.dto.availability.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityRequest {
    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Availability status is required")
    private Boolean isAvailable;

    private String reasonForUnavailability;

    @NotNull(message = "Time slots are required")
    private List<TimeSlotRequest> timeSlots;

    @Min(value = 5, message = "Slot duration must be at least 5 minutes")
    @Max(value = 240, message = "Slot duration cannot exceed 4 hours")
    private Integer slotDurationMinutes;

    @Min(value = 1, message = "Maximum patients per slot must be at least 1")
    @Max(value = 10, message = "Maximum patients per slot cannot exceed 10")
    private Integer maxPatientsPerSlot;
}
