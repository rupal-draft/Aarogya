package com.aarogya.appointment_service.service;

import com.aarogya.appointment_service.dto.grpc.AppointmentStatsDto;
import com.aarogya.appointment_service.dto.grpc.PatientStatsDto;
import com.aarogya.events.AppointmentApproveEvent;
import com.aarogya.events.AppointmentRejectEvent;

public interface AppointmentConsumerService {
    void approveAppointment(AppointmentApproveEvent event);
    void rejectAppointment(AppointmentRejectEvent event);
    AppointmentStatsDto getDoctorStats(String doctorId);
    PatientStatsDto getPatientStats(String doctorId);
}
