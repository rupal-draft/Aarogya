package com.aarogya.patient_management_service.service;

import com.aarogya.patient_management_service.dto.request.CreateVitalsRequest;
import com.aarogya.patient_management_service.dto.request.UpdateVitalsRequest;
import com.aarogya.patient_management_service.dto.response.PatientVitalsResponse;
import com.aarogya.patient_management_service.dto.response.VitalsStatsResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface PatientVitalsService {

    PatientVitalsResponse recordVitals(String patientId, CreateVitalsRequest request);

    Page<PatientVitalsResponse> getPatientVitals(String patientId, Pageable pageable);

    PatientVitalsResponse getLatestVitals(String patientId);

    VitalsStatsResponse getVitalsStats(String patientId, int days);

    List<PatientVitalsResponse> getVitalsTrends(String patientId, LocalDate startDate, LocalDate endDate);

    PatientVitalsResponse getVitalsById(String patientId, String vitalsId);

    PatientVitalsResponse updateVitals(String patientId, String vitalsId, UpdateVitalsRequest request);

    PatientVitalsResponse partialUpdateVitals(String patientId, String vitalsId, UpdateVitalsRequest request);

    void deleteVitals(String patientId, String vitalsId);
}
