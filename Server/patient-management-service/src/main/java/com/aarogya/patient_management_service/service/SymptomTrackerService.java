package com.aarogya.patient_management_service.service;

import com.aarogya.patient_management_service.dto.request.CreateSymptomTrackerRequest;
import com.aarogya.patient_management_service.dto.request.UpdateSymptomTrackerRequest;
import com.aarogya.patient_management_service.dto.response.SymptomStatsResponse;
import com.aarogya.patient_management_service.dto.response.SymptomTrackerResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface SymptomTrackerService {

    Page<SymptomTrackerResponse> getPatientSymptoms(String patientId, Pageable pageable);

    SymptomTrackerResponse getSymptom(String patientId, String symptomId);

    Page<SymptomTrackerResponse> getSymptomsByName(String patientId, String symptomName, Pageable pageable);

    Page<SymptomTrackerResponse> getSymptomsBySeverityRange(String patientId, Integer minSeverity, Integer maxSeverity, Pageable pageable);

    Page<SymptomTrackerResponse> getRecentSymptoms(String patientId, LocalDateTime since, Pageable pageable);

    SymptomTrackerResponse recordSymptom(String patientId, CreateSymptomTrackerRequest request);

    SymptomTrackerResponse updateSymptom(String patientId, String symptomId, UpdateSymptomTrackerRequest request);

    SymptomTrackerResponse partialUpdateSymptom(String patientId, String symptomId, UpdateSymptomTrackerRequest request);

    void deleteSymptom(String patientId, String symptomId);

    Page<SymptomTrackerResponse> getSymptomsByCategory(String patientId, String category, Pageable pageable);

    Page<SymptomTrackerResponse> getSevereSymptoms(String patientId, Pageable pageable);

    List<SymptomTrackerResponse> getSymptomsByDateRange(String patientId, LocalDateTime start, LocalDateTime end);

    SymptomStatsResponse getSymptomStats(String patientId);
}
