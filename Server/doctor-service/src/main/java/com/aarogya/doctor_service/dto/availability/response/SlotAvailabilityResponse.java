package com.aarogya.doctor_service.dto.availability.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SlotAvailabilityResponse {
    private Boolean isAvailable;
    private Integer availableSlots;
    private Integer bookedSlots;
    private String reasonIfUnavailable;
    private LocalDateTime nextAvailableSlot;
}
