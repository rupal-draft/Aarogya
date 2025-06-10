package com.aarogya.doctor_service.services;

import com.aarogya.doctor_service.dto.DoctorPerformanceDTO;

import java.time.LocalDate;

public interface PerformanceService {

    DoctorPerformanceDTO getDoctorPerformance(String doctorId, LocalDate startDate, LocalDate endDate);

    void updateDoctorMetrics(String doctorId, LocalDate date);

    void recordAppointmentCompletion(String doctorId, String appointmentId, int durationMinutes, int waitTimeMinutes);

    void recordNewRating(String doctorId, Integer rating);
}
