package com.aarogya.doctor_service.dto.availability.request;

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
public class RecurrencePatternRequest {
    @NotNull(message = "Recurrence type is required")
    private String type;

    private Integer interval;

    private List<String> daysOfWeek;

    private Integer dayOfMonth;

    private Integer month;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    private LocalDate endDate;

    private Integer occurrenceCount;
}
