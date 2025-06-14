package com.aarogya.prescription_service.service;

import com.aarogya.prescription_service.dto.PrescriptionAnalyticsDTO;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface PrescriptionAnalyticsService {

    PrescriptionAnalyticsDTO getDoctorPrescriptionAnalytics(String doctorId, LocalDate startDate, LocalDate endDate);

    PrescriptionAnalyticsDTO getPatientPrescriptionAnalytics(String patientId, LocalDate startDate, LocalDate endDate);

    Map<String, Integer> getTopPrescribedMedicines(String doctorId, LocalDate startDate, LocalDate endDate, int limit);

    Map<String, Integer> getTopDiagnoses(String doctorId, LocalDate startDate, LocalDate endDate, int limit);

    Map<String, Double> getPrescriptionTrends(String doctorId, LocalDate startDate, LocalDate endDate);

    List<String> getDrugInteractionAlerts(String doctorId, LocalDate startDate, LocalDate endDate);

    Map<String, Integer> getPrescriptionsByStatus(String doctorId, LocalDate startDate, LocalDate endDate);

    Double getAveragePrescriptionValue(String doctorId, LocalDate startDate, LocalDate endDate);

    Map<String, Integer> getRefillAnalytics(String doctorId, LocalDate startDate, LocalDate endDate);

    void generatePrescriptionReport(String doctorId, LocalDate startDate, LocalDate endDate);
}
