package com.aarogya.doctor_service.services.availability;

import com.aarogya.doctor_service.dto.availability.response.CalendarQuickViewResponse;

import java.time.YearMonth;

public interface AvailabilityQuickViewService {
    CalendarQuickViewResponse getQuickView(String doctorId, YearMonth month);
}
