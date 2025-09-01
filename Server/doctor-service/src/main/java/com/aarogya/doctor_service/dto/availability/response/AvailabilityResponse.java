package com.aarogya.doctor_service.dto.availability.response;

import com.aarogya.doctor_service.enums.availability.AvailabilityStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityResponse {
    private String id;
    private String doctorId;
    private LocalDate date;
    private Boolean isAvailable;
    private String reasonForUnavailability;
    private List<TimeSlotResponse> timeSlots;
    private Integer slotDurationMinutes;
    private Integer maxPatientsPerSlot;
    private AvailabilityStatus status;
    private Integer totalAvailableSlots;
    private Integer totalBookedSlots;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

