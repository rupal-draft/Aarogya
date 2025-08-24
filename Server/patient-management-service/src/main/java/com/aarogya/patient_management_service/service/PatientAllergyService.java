package com.aarogya.patient_management_service.service;

import com.aarogya.patient_management_service.dto.request.CreateAllergyRequest;
import com.aarogya.patient_management_service.dto.request.UpdateAllergyRequest;
import com.aarogya.patient_management_service.dto.response.PatientAllergyResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PatientAllergyService {

    PatientAllergyResponse addAllergy(String patientId, CreateAllergyRequest request);

    Page<PatientAllergyResponse> getPatientAllergies(String patientId, Pageable pageable);

    List<PatientAllergyResponse> getCriticalAllergies(String patientId);

    PatientAllergyResponse getAllergyById(String patientId, String allergyId);

    PatientAllergyResponse updateAllergy(String patientId, String allergyId, UpdateAllergyRequest request);

    PatientAllergyResponse partialUpdateAllergy(String patientId, String allergyId, UpdateAllergyRequest request);

    PatientAllergyResponse updateAllergySeverity(String patientId, String allergyId, String severity);

    void deleteAllergy(String patientId, String allergyId);
}
