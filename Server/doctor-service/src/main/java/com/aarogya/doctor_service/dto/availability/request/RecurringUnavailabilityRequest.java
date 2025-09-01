package com.aarogya.doctor_service.dto.availability.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecurringUnavailabilityRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Recurrence pattern is required")
    private RecurrencePatternRequest recurrencePattern;

    @NotNull(message = "Time range is required")
    private TimeRangeRequest timeRange;

    private Boolean isAllDay;
}
