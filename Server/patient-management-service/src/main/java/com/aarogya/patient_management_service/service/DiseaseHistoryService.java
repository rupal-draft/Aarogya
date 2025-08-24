package com.aarogya.patient_management_service.service;

import com.aarogya.patient_management_service.dto.request.CreateDiseaseHistoryRequest;
import com.aarogya.patient_management_service.dto.request.UpdateDiseaseHistoryRequest;
import com.aarogya.patient_management_service.dto.response.DiseaseHistoryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface DiseaseHistoryService {

    DiseaseHistoryResponse createDiseaseHistory(String patientId, CreateDiseaseHistoryRequest request);

    Page<DiseaseHistoryResponse> getDiseaseHistory(String patientId, Pageable pageable);

    List<DiseaseHistoryResponse> getActiveDiseases(String patientId);

    List<DiseaseHistoryResponse> getChronicDiseases(String patientId);

    DiseaseHistoryResponse updateDiseaseHistory(String patientId, String diseaseId, UpdateDiseaseHistoryRequest request);

    void deleteDiseaseHistory(String patientId, String diseaseId);

    Optional<DiseaseHistoryResponse> getDiseaseHistoryById(String patientId, String diseaseId);
}
