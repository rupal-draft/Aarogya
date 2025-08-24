package com.aarogya.patient_management_service.controller;

import com.aarogya.patient_management_service.advices.ApiError;
import com.aarogya.patient_management_service.advices.ApiResponse;
import com.aarogya.patient_management_service.auth.UserContextHolder;
import com.aarogya.patient_management_service.dto.request.CreateVitalsRequest;
import com.aarogya.patient_management_service.dto.request.UpdateVitalsRequest;
import com.aarogya.patient_management_service.dto.response.PatientVitalsResponse;
import com.aarogya.patient_management_service.dto.response.VitalsStatsResponse;
import com.aarogya.patient_management_service.service.PatientVitalsService;
import io.github.resilience4j.ratelimiter.RequestNotPermitted;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/vitals")
@Validated
public class PatientVitalsController {

    private final PatientVitalsService patientVitalsService;

    public PatientVitalsController(PatientVitalsService patientVitalsService) {
        this.patientVitalsService = patientVitalsService;
    }

    @PostMapping
    @RateLimiter(name = "vitalsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<PatientVitalsResponse> recordVitals(
            @Valid @RequestBody CreateVitalsRequest request) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        PatientVitalsResponse response = patientVitalsService.recordVitals(patientId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @RateLimiter(name = "vitalsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<Page<PatientVitalsResponse>> getPatientVitals(Pageable pageable) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        Page<PatientVitalsResponse> response = patientVitalsService.getPatientVitals(patientId, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/latest")
    @RateLimiter(name = "vitalsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<PatientVitalsResponse> getLatestVitals() {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        PatientVitalsResponse response = patientVitalsService.getLatestVitals(patientId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    @RateLimiter(name = "vitalsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<VitalsStatsResponse> getVitalsStats(
            @RequestParam @Min(1) int days) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        VitalsStatsResponse response = patientVitalsService.getVitalsStats(patientId, days);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/trends")
    @RateLimiter(name = "vitalsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<List<PatientVitalsResponse>> getVitalsTrends(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        List<PatientVitalsResponse> response = patientVitalsService.getVitalsTrends(patientId, startDate, endDate);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{vitalsId}")
    @RateLimiter(name = "vitalsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<PatientVitalsResponse> getVitalsById(@PathVariable String vitalsId) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        PatientVitalsResponse response = patientVitalsService.getVitalsById(patientId, vitalsId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{vitalsId}")
    @RateLimiter(name = "vitalsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<PatientVitalsResponse> updateVitals(
            @PathVariable String vitalsId,
            @Valid @RequestBody UpdateVitalsRequest request) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        PatientVitalsResponse response = patientVitalsService.updateVitals(patientId, vitalsId, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{vitalsId}")
    @RateLimiter(name = "vitalsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<PatientVitalsResponse> partialUpdateVitals(
            @PathVariable String vitalsId,
            @Valid @RequestBody UpdateVitalsRequest request) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        PatientVitalsResponse response = patientVitalsService.partialUpdateVitals(patientId, vitalsId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{vitalsId}")
    @RateLimiter(name = "vitalsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<ApiResponse<String>> deleteVitals(@PathVariable String vitalsId) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        patientVitalsService.deleteVitals(patientId, vitalsId);
        return ResponseEntity.ok(ApiResponse.success("Vitals record deleted successfully!"));
    }

    public ResponseEntity<ApiError> rateLimiterFallback(RequestNotPermitted ex) {
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setMessage("Too many requests. Please try again later.")
                .setStatus(HttpStatus.TOO_MANY_REQUESTS)
                .build();
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(apiError);
    }
}
