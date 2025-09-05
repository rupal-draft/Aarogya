package com.aarogya.doctor_service.dto.availability.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.YearMonth;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalendarQuickViewResponse {
    private String doctorId;
    private YearMonth month;
    private List<CalendarDayQuickViewDto> days;
}
