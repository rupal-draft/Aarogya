package com.aarogya.doctor_service.dto.availability.response;

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
public class SpecialAvailabilityResponseDTO {
    private String id;
    private String doctorId;
    private LocalDate date;
    private String title;
    private String description;
    private Boolean isAvailable;
    private String reason;
    private List<TimeRange> customSlots;
    private Integer customSlotDuration;
    private Integer customMaxPatients;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

