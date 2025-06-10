package com.aarogya.doctor_service.services;

import com.aarogya.doctor_service.dto.AnalyticsDTO;
import com.aarogya.doctor_service.dto.DashboardDataDTO;
import com.aarogya.doctor_service.dto.PatientHistoryDTO;

import java.time.LocalDate;

public interface AnalyticsService {

    DashboardDataDTO getDashboardData(String doctorId);

    AnalyticsDTO getDoctorAnalytics(String doctorId, LocalDate startDate, LocalDate endDate);

    PatientHistoryDTO getPatientHistory(String doctorId, String patientId);
}
