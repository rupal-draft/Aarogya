package com.aarogya.doctor_service.dto.availability.response;

import com.aarogya.doctor_service.enums.availability.AvailabilityStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimeSlotResponse {
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer bookedCount;
    private Integer availableSlots;
    private Boolean isAvailable;
    private String reasonForUnavailability;
    private AvailabilityStatus status;
}
