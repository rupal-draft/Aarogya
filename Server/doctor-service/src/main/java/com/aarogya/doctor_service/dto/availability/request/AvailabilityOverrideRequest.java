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
public class AvailabilityOverrideRequest {
    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Override type is required")
    private String overrideType;

    private String reason;

    private List<TimeRangeRequest> affectedTimeRanges;
}
