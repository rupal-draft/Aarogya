package com.aarogya.doctor_service.dto.availability.response;

import com.aarogya.doctor_service.enums.availability.OverrideType;
import com.aarogya.doctor_service.models.availability.TimeRange;
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
public class AvailabilityOverrideResponseDTO {
    private String id;
    private String doctorId;
    private LocalDate date;
    private OverrideType overrideType;
    private String reason;
    private List<TimeRange> affectedTimeRanges;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

