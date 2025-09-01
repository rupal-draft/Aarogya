package com.aarogya.doctor_service.models.availability;

import com.aarogya.doctor_service.enums.availability.DayOfWeek;
import com.aarogya.doctor_service.enums.availability.RecurrenceType;
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
public class RecurrencePattern {
    @NotNull
    private RecurrenceType type; // DAILY, WEEKLY, MONTHLY, YEARLY

    private Integer interval;

    private List<DayOfWeek> daysOfWeek;

    private Integer dayOfMonth;

    private Integer month;

    @NotNull
    private LocalDate startDate;

    private LocalDate endDate;

    @Builder.Default
    private Integer occurrenceCount = null;
}
