package com.aarogya.doctor_service.dto.availability.response;

import com.aarogya.doctor_service.models.availability.RecurrencePattern;
import com.aarogya.doctor_service.models.availability.TimeRange;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecurringUnavailabilityResponseDTO {
    private String id;
    private String doctorId;
    private String title;
    private String description;
    private RecurrencePattern recurrencePattern;
    private TimeRange timeRange;
    private Boolean isAllDay;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

