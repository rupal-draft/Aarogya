package com.aarogya.doctor_service.dto.availability.response;

import com.aarogya.doctor_service.enums.availability.AvailabilityStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityRangeResponse {
    private String doctorId;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<AvailabilityResponse> availabilities;
    private Map<LocalDate, AvailabilityStatus> availabilitySummary;
    private Integer totalAvailableDays;
    private Integer totalUnavailableDays;
}
