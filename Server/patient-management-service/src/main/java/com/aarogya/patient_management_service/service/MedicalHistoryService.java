package com.aarogya.patient_management_service.service;

import com.aarogya.patient_management_service.dto.request.CreateMedicalHistoryRequest;
import com.aarogya.patient_management_service.dto.response.MedicalHistoryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface MedicalHistoryService {

    Page<MedicalHistoryResponse> getPatientMedicalHistory(String patientId, Pageable pageable);

    List<MedicalHistoryResponse> getActiveMedicalHistory(String patientId);

    MedicalHistoryResponse addMedicalHistory(String patientId, CreateMedicalHistoryRequest request);

    MedicalHistoryResponse updateMedicalHistory(String patientId, String historyId, CreateMedicalHistoryRequest request);

    void deleteMedicalHistory(String patientId, String historyId);

    List<MedicalHistoryResponse> searchMedicalHistory(String patientId, String query);

    Optional<MedicalHistoryResponse> getMedicalHistoryById(String patientId, String historyId);
}
