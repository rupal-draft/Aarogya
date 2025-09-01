package com.aarogya.doctor_service.services.availability;

import com.aarogya.doctor_service.dto.availability.request.*;
import com.aarogya.doctor_service.dto.availability.response.AvailabilityRangeResponse;
import com.aarogya.doctor_service.dto.availability.response.AvailabilityResponse;
import com.aarogya.doctor_service.dto.availability.response.ScheduleResponse;
import com.aarogya.doctor_service.dto.availability.response.SlotAvailabilityResponse;
import com.aarogya.doctor_service.models.availability.AvailabilityOverride;
import com.aarogya.doctor_service.models.availability.RecurringUnavailability;
import com.aarogya.doctor_service.models.availability.SpecialAvailability;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AvailabilityService {
    AvailabilityResponse setAvailability(AvailabilityRequest request);
    AvailabilityResponse getAvailability(LocalDate date);
    AvailabilityRangeResponse getAvailabilityRange(AvailabilityRangeRequest request);
    ScheduleResponse getSchedule();
    ScheduleResponse updateSchedule(ScheduleRequest request);
    RecurringUnavailability createRecurringUnavailability(RecurringUnavailabilityRequest request);
    List<RecurringUnavailability> getRecurringUnavailabilities();
    void deleteRecurringUnavailability(String id);
    SpecialAvailability createSpecialAvailability(SpecialAvailabilityRequest request);
    List<SpecialAvailability> getSpecialAvailabilities();
    AvailabilityOverride createOverride(AvailabilityOverrideRequest request);
    SlotAvailabilityResponse checkSlotAvailability(SlotAvailabilityRequest request);
    void generateAvailabilities(LocalDate startDate, LocalDate endDate);
    void updateSlotBooking(String appointmentId, LocalDate date, LocalTime startTime, int delta);
}
