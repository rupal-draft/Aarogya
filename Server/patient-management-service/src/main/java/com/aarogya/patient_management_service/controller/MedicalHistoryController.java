package com.aarogya.patient_management_service.controller;

import com.aarogya.patient_management_service.advices.ApiError;
import com.aarogya.patient_management_service.advices.ApiResponse;
import com.aarogya.patient_management_service.auth.UserContextHolder;
import com.aarogya.patient_management_service.dto.request.CreateMedicalHistoryRequest;
import com.aarogya.patient_management_service.dto.response.MedicalHistoryResponse;
import com.aarogya.patient_management_service.service.MedicalHistoryService;
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
import java.util.Optional;

@RestController
@RequestMapping("/medical-history")
@Validated
public class MedicalHistoryController {

    private final MedicalHistoryService medicalHistoryService;

    public MedicalHistoryController(MedicalHistoryService medicalHistoryService) {
        this.medicalHistoryService = medicalHistoryService;
    }

    @GetMapping
    @RateLimiter(name = "medicalHistoryRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<Page<MedicalHistoryResponse>> getPatientMedicalHistory(Pageable pageable) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        Page<MedicalHistoryResponse> response = medicalHistoryService.getPatientMedicalHistory(patientId, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/active")
    @RateLimiter(name = "medicalHistoryRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<List<MedicalHistoryResponse>> getActiveMedicalHistory() {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        List<MedicalHistoryResponse> response = medicalHistoryService.getActiveMedicalHistory(patientId);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @RateLimiter(name = "medicalHistoryRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<MedicalHistoryResponse> addMedicalHistory(
            @Valid @RequestBody CreateMedicalHistoryRequest request) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        MedicalHistoryResponse response = medicalHistoryService.addMedicalHistory(patientId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{historyId}")
    @RateLimiter(name = "medicalHistoryRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<MedicalHistoryResponse> updateMedicalHistory(
            @PathVariable String historyId,
            @Valid @RequestBody CreateMedicalHistoryRequest request) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        MedicalHistoryResponse response = medicalHistoryService.updateMedicalHistory(patientId, historyId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{historyId}")
    @RateLimiter(name = "medicalHistoryRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<ApiResponse<String>> deleteMedicalHistory(@PathVariable String historyId) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        medicalHistoryService.deleteMedicalHistory(patientId, historyId);
        return ResponseEntity.ok(ApiResponse.success("Medical history deleted successfully!"));
    }

    @GetMapping("/search")
    @RateLimiter(name = "medicalHistoryRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<List<MedicalHistoryResponse>> searchMedicalHistory(
            @RequestParam String query) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        List<MedicalHistoryResponse> response = medicalHistoryService.searchMedicalHistory(patientId, query);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{historyId}")
    @RateLimiter(name = "medicalHistoryRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<MedicalHistoryResponse> getMedicalHistoryById(@PathVariable String historyId) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        Optional<MedicalHistoryResponse> response = medicalHistoryService.getMedicalHistoryById(patientId, historyId);
        return response.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    public ResponseEntity<ApiError> rateLimiterFallback(RequestNotPermitted ex) {
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setMessage("Too many requests. Please try again later.")
                .setStatus(HttpStatus.TOO_MANY_REQUESTS)
                .build();
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(apiError);
    }
}
