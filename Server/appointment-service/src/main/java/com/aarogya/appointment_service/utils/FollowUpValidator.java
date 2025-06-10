package com.aarogya.appointment_service.utils;

import com.aarogya.appointment_service.dto.request.FollowUpRequestDto;
import com.aarogya.appointment_service.exceptions.ResourceNotFound;
import com.aarogya.appointment_service.exceptions.RuntimeConflict;
import com.aarogya.appointment_service.models.Appointment;
import com.aarogya.appointment_service.repository.AppointmentRepository;
import com.aarogya.appointment_service.repository.FollowUpRepository;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class FollowUpValidator {

    private final AppointmentRepository appointmentRepository;
    private final FollowUpRepository followUpRepository;

    public void validateFollowUpRequest(String originalAppointmentId, String doctorId, FollowUpRequestDto requestDto) {
        Appointment appointment = appointmentRepository.findByIdAndDoctorId(originalAppointmentId, doctorId)
                .orElseThrow(() -> new ResourceNotFound("Original appointment not found or not accessible"));

        if (!appointment.getPatientId().equals(requestDto.getPatientId())) {
            throw new ValidationException("Patient does not match original appointment");
        }

        if (requestDto.getRecommendedDate().isBefore(LocalDate.now())) {
            throw new ValidationException("Recommended date must be in the future");
        }

        if (followUpRepository.existsByOriginalAppointmentIdAndRecommendedDate(
                originalAppointmentId, requestDto.getRecommendedDate())) {
            throw new RuntimeConflict("Follow-up already exists for this appointment on the recommended date");
        }
    }
}
