package com.aarogya.patient_management_service.controller;

import com.aarogya.patient_management_service.advices.ApiError;
import com.aarogya.patient_management_service.advices.ApiResponse;
import com.aarogya.patient_management_service.auth.UserContextHolder;
import com.aarogya.patient_management_service.dto.request.CreateDiseaseHistoryRequest;
import com.aarogya.patient_management_service.dto.request.UpdateDiseaseHistoryRequest;
import com.aarogya.patient_management_service.dto.response.DiseaseHistoryResponse;
import com.aarogya.patient_management_service.service.DiseaseHistoryService;
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
@RequestMapping("/disease-history")
@Validated
public class DiseaseHistoryController {

    private final DiseaseHistoryService diseaseHistoryService;

    public DiseaseHistoryController(DiseaseHistoryService diseaseHistoryService) {
        this.diseaseHistoryService = diseaseHistoryService;
    }

    @PostMapping
    @RateLimiter(name = "diseaseHistoryRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<DiseaseHistoryResponse> createDiseaseHistory(
            @Valid @RequestBody CreateDiseaseHistoryRequest request) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        DiseaseHistoryResponse response = diseaseHistoryService.createDiseaseHistory(patientId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @RateLimiter(name = "diseaseHistoryRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<Page<DiseaseHistoryResponse>> getDiseaseHistory(
            Pageable pageable) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        Page<DiseaseHistoryResponse> response = diseaseHistoryService.getDiseaseHistory(patientId, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/active")
    @RateLimiter(name = "diseaseHistoryRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<List<DiseaseHistoryResponse>> getActiveDiseases() {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        List<DiseaseHistoryResponse> response = diseaseHistoryService.getActiveDiseases(patientId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/chronic")
    @RateLimiter(name = "diseaseHistoryRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<List<DiseaseHistoryResponse>> getChronicDiseases() {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        List<DiseaseHistoryResponse> response = diseaseHistoryService.getChronicDiseases(patientId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{diseaseId}")
    @RateLimiter(name = "diseaseHistoryRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<DiseaseHistoryResponse> getDiseaseHistoryById(
            @PathVariable String diseaseId) {

        String patientId = UserContextHolder.getUserDetails().getUserId();
        Optional<DiseaseHistoryResponse> response =
                diseaseHistoryService.getDiseaseHistoryById(patientId, diseaseId);

        return response
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{diseaseId}")
    @RateLimiter(name = "diseaseHistoryRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<DiseaseHistoryResponse> updateDiseaseHistory(
            @PathVariable String diseaseId,
            @Valid @RequestBody UpdateDiseaseHistoryRequest request) {

        String patientId = UserContextHolder.getUserDetails().getUserId();
        DiseaseHistoryResponse response = diseaseHistoryService.updateDiseaseHistory(patientId, diseaseId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{diseaseId}")
    @RateLimiter(name = "diseaseHistoryRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<ApiResponse<String>> deleteDiseaseHistory(
            @PathVariable String diseaseId) {

        String patientId = UserContextHolder.getUserDetails().getUserId();
        diseaseHistoryService.deleteDiseaseHistory(patientId, diseaseId);
        return ResponseEntity.ok(ApiResponse.success("History deleted successfully!"));
    }

    public ResponseEntity<ApiError> rateLimiterFallback(RequestNotPermitted ex) {
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setMessage("Too many requests. Please try again later.")
                .setStatus(HttpStatus.TOO_MANY_REQUESTS)
                .build();

        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(apiError);
    }
}