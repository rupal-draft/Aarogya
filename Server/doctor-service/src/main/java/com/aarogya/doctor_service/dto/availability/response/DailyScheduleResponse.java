package com.aarogya.doctor_service.dto.availability.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyScheduleResponse {
    private Boolean isAvailable;
    private String reasonForUnavailability;
    private List<TimeRangeResponse> availableSlots;
    private Integer slotDurationMinutes;
    private Integer maxPatientsPerSlot;
}
