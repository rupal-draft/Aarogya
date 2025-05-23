package com.aarogya.doctor_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvailableSlotDTO {
    private LocalTime startTime;
    private LocalTime endTime;
    private Boolean available;
}
