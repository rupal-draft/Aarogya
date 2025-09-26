package com.aarogya.appointment_service.service;

import com.aarogya.appointment_service.dto.grpc.AppointmentCountByDateDto;
import com.aarogya.appointment_service.dto.grpc.AppointmentStatsDto;
import com.aarogya.appointment_service.dto.grpc.PatientStatsDto;
import com.aarogya.payment_service.events.AppointmentApproveEvent;
import com.aarogya.payment_service.events.AppointmentRejectEvent;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentConsumerService {
    void approveAppointment(AppointmentApproveEvent event);
    void rejectAppointment(AppointmentRejectEvent event);
    AppointmentStatsDto getDoctorStats(String doctorId);
    PatientStatsDto getPatientStats(String doctorId);
    List<AppointmentCountByDateDto> getAppointmentCountsByDateRange(
            String doctorId, LocalDate start, LocalDate end);
}
