package com.aarogya.patient_management_service.service;

import com.aarogya.patient_management_service.dto.request.CreateMedicationRequest;
import com.aarogya.patient_management_service.dto.request.UpdateMedicationRequest;
import com.aarogya.patient_management_service.dto.response.PatientMedicationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PatientMedicationService {

    PatientMedicationResponse addMedication(String patientId, CreateMedicationRequest request);

    Page<PatientMedicationResponse> getPatientMedications(String patientId, Pageable pageable);

    List<PatientMedicationResponse> getActiveMedications(String patientId);

    PatientMedicationResponse getMedicationById(String patientId, String medicationId);

    PatientMedicationResponse updateMedication(String patientId, String medicationId, UpdateMedicationRequest request);

    PatientMedicationResponse partialUpdateMedication(String patientId, String medicationId, UpdateMedicationRequest request);

    PatientMedicationResponse updateMedicationStatus(String patientId, String medicationId, String status);

    void deleteMedication(String patientId, String medicationId);
}
