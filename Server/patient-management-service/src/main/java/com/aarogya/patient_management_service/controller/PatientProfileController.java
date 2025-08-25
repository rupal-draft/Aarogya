package com.aarogya.patient_management_service.controller;

import com.aarogya.patient_management_service.advices.ApiResponse;
import com.aarogya.patient_management_service.auth.UserContextHolder;
import com.aarogya.patient_management_service.dto.response.CompletePatientProfileResponse;
import com.aarogya.patient_management_service.exceptions.ResourceNotFoundException;
import com.aarogya.patient_management_service.exceptions.ServiceException;
import com.aarogya.patient_management_service.service.PatientProfileDashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@Validated
@Slf4j
public class PatientProfileController {

    private final PatientProfileDashboardService patientProfileService;

    @GetMapping("/complete-profile")
    public ResponseEntity<ApiResponse<CompletePatientProfileResponse>> getCompletePatientProfile() {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        try {
            log.info("Request received for complete patient profile for patient ID: {}", patientId);

            CompletePatientProfileResponse profile = patientProfileService.getCompletePatientProfile(patientId);

            return ResponseEntity.ok(ApiResponse.<CompletePatientProfileResponse>builder()
                    .success(true)
                    .message("Patient profile retrieved successfully")
                    .data(profile)
                    .timestamp(LocalDateTime.now())
                    .build());

        } catch (IllegalArgumentException e) {
            log.warn("Invalid request for patient profile: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.<CompletePatientProfileResponse>builder()
                    .success(false)
                    .message("Invalid request: " + e.getMessage())
                    .timestamp(LocalDateTime.now())
                    .build());

        } catch (ResourceNotFoundException e) {
            log.warn("Patient not found: {}", patientId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.<CompletePatientProfileResponse>builder()
                    .success(false)
                    .message("Patient not found with ID: " + patientId)
                    .timestamp(LocalDateTime.now())
                    .build());

        } catch (ServiceException e) {
            log.error("Service error while fetching patient profile for {}: {}", patientId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.<CompletePatientProfileResponse>builder()
                    .success(false)
                    .message("Failed to retrieve patient profile: " + e.getMessage())
                    .timestamp(LocalDateTime.now())
                    .build());

        } catch (Exception e) {
            log.error("Unexpected error while fetching patient profile for {}: {}", patientId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.<CompletePatientProfileResponse>builder()
                    .success(false)
                    .message("An unexpected error occurred")
                    .timestamp(LocalDateTime.now())
                    .build());
        }
    }
}
