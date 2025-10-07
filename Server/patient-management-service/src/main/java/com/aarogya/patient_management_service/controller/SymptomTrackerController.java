package com.aarogya.patient_management_service.controller;

import com.aarogya.patient_management_service.advices.ApiError;
import com.aarogya.patient_management_service.advices.ApiResponse;
import com.aarogya.patient_management_service.dto.request.CreateSymptomTrackerRequest;
import com.aarogya.patient_management_service.dto.request.UpdateSymptomTrackerRequest;
import com.aarogya.patient_management_service.dto.response.SymptomStatsResponse;
import com.aarogya.patient_management_service.dto.response.SymptomTrackerResponse;
import com.aarogya.patient_management_service.service.SymptomTrackerService;
import io.github.resilience4j.ratelimiter.RequestNotPermitted;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/{patientId}/symptoms")
@Validated
public class SymptomTrackerController {

    private final SymptomTrackerService symptomTrackerService;

    public SymptomTrackerController(SymptomTrackerService symptomTrackerService) {
        this.symptomTrackerService = symptomTrackerService;
    }

    @GetMapping
    @RateLimiter(name = "symptomsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<Page<SymptomTrackerResponse>> getPatientSymptoms(
            @PathVariable String patientId,
            Pageable pageable) {
        Page<SymptomTrackerResponse> response = symptomTrackerService.getPatientSymptoms(patientId, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{symptomId}")
    @RateLimiter(name = "symptomsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<SymptomTrackerResponse> getSymptom(
            @PathVariable String patientId,
            @PathVariable String symptomId) {
        SymptomTrackerResponse response = symptomTrackerService.getSymptom(patientId, symptomId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/name/{symptomName}")
    @RateLimiter(name = "symptomsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<Page<SymptomTrackerResponse>> getSymptomsByName(
            @PathVariable String patientId,
            @PathVariable String symptomName,
            Pageable pageable) {
        Page<SymptomTrackerResponse> response = symptomTrackerService.getSymptomsByName(patientId, symptomName, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/severity-range")
    @RateLimiter(name = "symptomsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<Page<SymptomTrackerResponse>> getSymptomsBySeverityRange(
            @PathVariable String patientId,
            @RequestParam(required = false) Integer minSeverity,
            @RequestParam(required = false) Integer maxSeverity,
            Pageable pageable) {
        Page<SymptomTrackerResponse> response = symptomTrackerService.getSymptomsBySeverityRange(patientId, minSeverity, maxSeverity, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/recent")
    @RateLimiter(name = "symptomsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<Page<SymptomTrackerResponse>> getRecentSymptoms(
            @PathVariable String patientId,
            @RequestParam LocalDateTime since,
            Pageable pageable) {
        Page<SymptomTrackerResponse> response = symptomTrackerService.getRecentSymptoms(patientId, since, pageable);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @RateLimiter(name = "symptomsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<SymptomTrackerResponse> recordSymptom(
            @PathVariable String patientId,
            @Valid @RequestBody CreateSymptomTrackerRequest request) {
        SymptomTrackerResponse response = symptomTrackerService.recordSymptom(patientId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{symptomId}")
    @RateLimiter(name = "symptomsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<SymptomTrackerResponse> updateSymptom(
            @PathVariable String patientId,
            @PathVariable String symptomId,
            @Valid @RequestBody UpdateSymptomTrackerRequest request) {
        SymptomTrackerResponse response = symptomTrackerService.updateSymptom(patientId, symptomId, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{symptomId}")
    @RateLimiter(name = "symptomsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<SymptomTrackerResponse> partialUpdateSymptom(
            @PathVariable String patientId,
            @PathVariable String symptomId,
            @Valid @RequestBody UpdateSymptomTrackerRequest request) {
        SymptomTrackerResponse response = symptomTrackerService.partialUpdateSymptom(patientId, symptomId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{symptomId}")
    @RateLimiter(name = "symptomsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<ApiResponse<String>> deleteSymptom(
            @PathVariable String patientId,
            @PathVariable String symptomId) {
        symptomTrackerService.deleteSymptom(patientId, symptomId);
        return ResponseEntity.ok(ApiResponse.success("Symptom record deleted successfully!"));
    }

    @GetMapping("/category/{category}")
    @RateLimiter(name = "symptomsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<Page<SymptomTrackerResponse>> getSymptomsByCategory(
            @PathVariable String patientId,
            @PathVariable String category,
            Pageable pageable) {
        Page<SymptomTrackerResponse> response = symptomTrackerService.getSymptomsByCategory(patientId, category, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/severe")
    @RateLimiter(name = "symptomsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<Page<SymptomTrackerResponse>> getSevereSymptoms(
            @PathVariable String patientId,
            Pageable pageable) {
        Page<SymptomTrackerResponse> response = symptomTrackerService.getSevereSymptoms(patientId, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/date-range")
    @RateLimiter(name = "symptomsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<List<SymptomTrackerResponse>> getSymptomsByDateRange(
            @PathVariable String patientId,
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end) {
        List<SymptomTrackerResponse> response = symptomTrackerService.getSymptomsByDateRange(patientId, start, end);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    @RateLimiter(name = "symptomsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<SymptomStatsResponse> getSymptomStats(
            @PathVariable String patientId) {
        SymptomStatsResponse response = symptomTrackerService.getSymptomStats(patientId);
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<ApiError> rateLimiterFallback(RequestNotPermitted ex) {
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setMessage("Too many requests. Please try again later.")
                .setStatus(HttpStatus.TOO_MANY_REQUESTS)
                .build();
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(apiError);
    }
}

