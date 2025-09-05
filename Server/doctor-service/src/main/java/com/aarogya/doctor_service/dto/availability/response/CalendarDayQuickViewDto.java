package com.aarogya.doctor_service.dto.availability.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalendarDayQuickViewDto {
    private LocalDate date;
    private Boolean isAvailable;
    private Integer totalSlots;
    private Integer bookedSlots;
    private Integer freeSlots;
    private String status;
    private String note;
}
