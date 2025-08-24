package com.aarogya.patient_management_service.controller;

import com.aarogya.patient_management_service.advices.ApiError;
import com.aarogya.patient_management_service.advices.ApiResponse;
import com.aarogya.patient_management_service.auth.UserContextHolder;
import com.aarogya.patient_management_service.dto.request.CreateMedicationRequest;
import com.aarogya.patient_management_service.dto.request.UpdateMedicationRequest;
import com.aarogya.patient_management_service.dto.response.PatientMedicationResponse;
import com.aarogya.patient_management_service.service.PatientMedicationService;
import io.github.resilience4j.ratelimiter.RequestNotPermitted;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medications")
@Validated
public class PatientMedicationController {

    private final PatientMedicationService patientMedicationService;

    public PatientMedicationController(PatientMedicationService patientMedicationService) {
        this.patientMedicationService = patientMedicationService;
    }

    @PostMapping
    @RateLimiter(name = "medicationsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<PatientMedicationResponse> addMedication(
            @Valid @RequestBody CreateMedicationRequest request) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        PatientMedicationResponse response = patientMedicationService.addMedication(patientId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @RateLimiter(name = "medicationsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<Page<PatientMedicationResponse>> getPatientMedications(Pageable pageable) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        Page<PatientMedicationResponse> response = patientMedicationService.getPatientMedications(patientId, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/active")
    @RateLimiter(name = "medicationsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<List<PatientMedicationResponse>> getActiveMedications() {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        List<PatientMedicationResponse> response = patientMedicationService.getActiveMedications(patientId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{medicationId}")
    @RateLimiter(name = "medicationsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<PatientMedicationResponse> getMedicationById(@PathVariable String medicationId) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        PatientMedicationResponse response = patientMedicationService.getMedicationById(patientId, medicationId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{medicationId}")
    @RateLimiter(name = "medicationsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<PatientMedicationResponse> updateMedication(
            @PathVariable String medicationId,
            @Valid @RequestBody UpdateMedicationRequest request) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        PatientMedicationResponse response = patientMedicationService.updateMedication(patientId, medicationId, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{medicationId}")
    @RateLimiter(name = "medicationsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<PatientMedicationResponse> partialUpdateMedication(
            @PathVariable String medicationId,
            @Valid @RequestBody UpdateMedicationRequest request) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        PatientMedicationResponse response = patientMedicationService.partialUpdateMedication(patientId, medicationId, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{medicationId}/status")
    @RateLimiter(name = "medicationsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<PatientMedicationResponse> updateMedicationStatus(
            @PathVariable String medicationId,
            @RequestParam String status) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        PatientMedicationResponse response = patientMedicationService.updateMedicationStatus(patientId, medicationId, status);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{medicationId")
    @RateLimiter(name = "medicationsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<ApiResponse<String>> deleteMedication(@PathVariable String medicationId) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        patientMedicationService.deleteMedication(patientId, medicationId);
        return ResponseEntity.ok(ApiResponse.success("Medication deleted successfully!"));
    }

    public ResponseEntity<ApiError> rateLimiterFallback(RequestNotPermitted ex) {
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setMessage("Too many requests. Please try again later.")
                .setStatus(HttpStatus.TOO_MANY_REQUESTS)
                .build();
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(apiError);
    }
}