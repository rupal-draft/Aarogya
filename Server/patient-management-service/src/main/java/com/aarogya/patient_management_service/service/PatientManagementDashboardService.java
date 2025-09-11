package com.aarogya.patient_management_service.service;

import com.aarogya.patient_management_service.dto.response.PatientDashboardResponseDTO;

public interface PatientManagementDashboardService {
    PatientDashboardResponseDTO getPatientDashboard(String patientId);
}
