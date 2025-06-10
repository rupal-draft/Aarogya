package com.aarogya.doctor_service.services;

import com.aarogya.doctor_service.dto.DoctorMetricsDTO;

import java.time.LocalDate;
import java.util.List;

public interface MetricsService {

    DoctorMetricsDTO getDoctorMetrics(String doctorId, LocalDate date);

    List<DoctorMetricsDTO> getDoctorMetricsRange(String doctorId, LocalDate startDate, LocalDate endDate);

    void updateDailyMetrics(String doctorId, LocalDate date);

    void recordAppointmentMetric(String doctorId, String appointmentId, String status, int duration);

    void recordPatientMetric(String doctorId, String patientId, boolean isNewPatient);

    void recordRatingMetric(String doctorId, Integer rating);

    void recordPrescriptionMetric(String doctorId, String prescriptionId);

    DoctorMetricsDTO getAggregatedMetrics(String doctorId, LocalDate startDate, LocalDate endDate);

    void generateMonthlyReport(String doctorId, int year, int month);

    void cleanupOldMetrics(int daysToKeep);
}
