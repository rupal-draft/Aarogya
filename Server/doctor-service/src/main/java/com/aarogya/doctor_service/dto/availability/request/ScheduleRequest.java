package com.aarogya.doctor_service.dto.availability.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleRequest {
    @NotNull(message = "Weekly schedule is required")
    private Map<String, DailyScheduleRequest> weeklySchedule;

    @Min(value = 5, message = "Slot duration must be at least 5 minutes")
    @Max(value = 240, message = "Slot duration cannot exceed 4 hours")
    private Integer defaultSlotDurationMinutes;

    @Min(value = 1, message = "Maximum patients per slot must be at least 1")
    @Max(value = 10, message = "Maximum patients per slot cannot exceed 10")
    private Integer defaultMaxPatientsPerSlot;

    @Min(value = 1, message = "Booking lead time must be at least 1 hour")
    private Integer bookingLeadTimeHours;

    @Min(value = 1, message = "Maximum booking days must be at least 1")
    @Max(value = 365, message = "Maximum booking days cannot exceed 365")
    private Integer maxBookingDaysInAdvance;

    @Min(value = 1, message = "Minimum cancellation notice must be at least 1 hour")
    private Integer minCancellationNoticeHours;
}
