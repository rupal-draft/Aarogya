package com.aarogya.appointment_service.utils;

import com.aarogya.appointment_service.dto.request.AppointmentRequestDto;
import com.aarogya.appointment_service.exceptions.TimeSlotNotAvailableException;
import com.aarogya.appointment_service.models.Appointment;
import com.aarogya.appointment_service.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class AppointmentValidator {

    private final AppointmentRepository appointmentRepository;

    public void validateAppointmentRequest(AppointmentRequestDto requestDto, String excludeAppointmentId) {
        if (!isTimeSlotAvailable(requestDto.getDoctorId(), requestDto.getAppointmentDate(),
                requestDto.getStartTime(), requestDto.getEndTime(), excludeAppointmentId)) {
            throw new TimeSlotNotAvailableException("Selected time slot is not available");
        }
    }

    private boolean isTimeSlotAvailable(String doctorId, LocalDate date, LocalTime startTime,
                                        LocalTime endTime, String excludeAppointmentId) {
        if (startTime.isAfter(endTime)) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        List<Appointment> conflictingAppointments = appointmentRepository.findConflictingAppointments(
                doctorId, date, startTime, endTime, excludeAppointmentId);
        return conflictingAppointments.isEmpty();
    }
}
