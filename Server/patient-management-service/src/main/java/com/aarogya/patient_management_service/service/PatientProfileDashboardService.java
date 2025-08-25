package com.aarogya.patient_management_service.service;

import com.aarogya.patient_management_service.dto.response.CompletePatientProfileResponse;

public interface PatientProfileDashboardService {

    CompletePatientProfileResponse getCompletePatientProfile(String patientId);
}
