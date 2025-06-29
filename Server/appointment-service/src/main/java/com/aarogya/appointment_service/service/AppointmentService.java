package com.aarogya.appointment_service.service;

import com.aarogya.appointment_service.dto.request.AppointmentRequestDto;
import com.aarogya.appointment_service.dto.request.EmergencyAppointmentDto;
import com.aarogya.appointment_service.dto.request.UpdateAppointmentStatusDto;
import com.aarogya.appointment_service.dto.response.AppointmentResponseDto;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentService {

    AppointmentResponseDto requestAppointment(@Valid AppointmentRequestDto requestDto);

    AppointmentResponseDto updateAppointmentStatus(String appointmentId, @Valid UpdateAppointmentStatusDto updateDto);

    AppointmentResponseDto requestEmergencyAppointment(@Valid EmergencyAppointmentDto emergencyDto);

    AppointmentResponseDto getAppointmentDetails(String appointmentId);

    Page<AppointmentResponseDto> getPatientAppointments(String status, LocalDate date,
                                                        int page, int size);

    Page<AppointmentResponseDto> getDoctorAppointments(String status, LocalDate date,
                                                       int page, int size);

    List<AppointmentResponseDto> getDoctorAppointmentsByDate(String doctorId, LocalDate date);

    List<AppointmentResponseDto> getUpcomingAppointments(LocalDate fromDate);

    List<AppointmentResponseDto> getDoctorAppointmentsBetweenDates(String doctorId, LocalDate startDate, LocalDate endDate);

    List<AppointmentResponseDto> getPatientAppointmentsBetweenDates(String patientId, LocalDate startDate, LocalDate endDate);
}
