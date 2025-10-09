package com.aarogya.doctor_service.services.availability;

import com.aarogya.appointment_service.events.IncreaseBookingCountEvent;
import com.aarogya.doctor_service.dto.availability.request.*;
import com.aarogya.doctor_service.dto.availability.response.*;
import com.aarogya.doctor_service.models.availability.AvailabilityOverride;
import com.aarogya.doctor_service.models.availability.RecurringUnavailability;
import com.aarogya.doctor_service.models.availability.SpecialAvailability;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AvailabilityService {
    AvailabilityResponse setAvailability(AvailabilityRequest request);
    AvailabilityResponse getAvailability(String doctorId, LocalDate date);
    AvailabilityRangeResponse getAvailabilityRange(AvailabilityRangeRequest request);
    ScheduleResponse getSchedule();
    ScheduleResponse updateSchedule(ScheduleRequest request);
    RecurringUnavailabilityResponseDTO createRecurringUnavailability(RecurringUnavailabilityRequest request);
    List<RecurringUnavailabilityResponseDTO> getRecurringUnavailabilities();
    void deleteRecurringUnavailability(String id);
    SpecialAvailabilityResponseDTO createSpecialAvailability(SpecialAvailabilityRequest request);
    List<SpecialAvailabilityResponseDTO> getSpecialAvailabilities();
    AvailabilityOverrideResponseDTO createOverride(AvailabilityOverrideRequest request);
    SlotAvailabilityResponse checkSlotAvailability(SlotAvailabilityRequest request);
    void generateAvailabilities(LocalDate startDate, LocalDate endDate);
    void updateSlotBooking(String appointmentId, LocalDate date, LocalTime startTime, int delta);
    void increaseBookingCount(IncreaseBookingCountEvent increaseBookingCountEvent);
}
