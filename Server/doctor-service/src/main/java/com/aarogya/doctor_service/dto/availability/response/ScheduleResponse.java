package com.aarogya.doctor_service.dto.availability.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleResponse {
    private String id;
    private String doctorId;
    private Map<String, DailyScheduleResponse> weeklySchedule;
    private Integer defaultSlotDurationMinutes;
    private Integer defaultMaxPatientsPerSlot;
    private Integer bookingLeadTimeHours;
    private Integer maxBookingDaysInAdvance;
    private Integer minCancellationNoticeHours;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

