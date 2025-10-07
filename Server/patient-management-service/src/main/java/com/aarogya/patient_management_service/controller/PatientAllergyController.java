package com.aarogya.patient_management_service.controller;

import com.aarogya.patient_management_service.advices.ApiError;
import com.aarogya.patient_management_service.advices.ApiResponse;
import com.aarogya.patient_management_service.dto.request.CreateAllergyRequest;
import com.aarogya.patient_management_service.dto.request.UpdateAllergyRequest;
import com.aarogya.patient_management_service.dto.response.PatientAllergyResponse;
import com.aarogya.patient_management_service.service.PatientAllergyService;
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
@RequestMapping("/{patientId}/allergies")
@Validated
public class PatientAllergyController {

    private final PatientAllergyService patientAllergyService;

    public PatientAllergyController(PatientAllergyService patientAllergyService) {
        this.patientAllergyService = patientAllergyService;
    }

    @PostMapping
    @RateLimiter(name = "allergiesRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<PatientAllergyResponse> addAllergy(
            @PathVariable String patientId,
            @Valid @RequestBody CreateAllergyRequest request) {

        PatientAllergyResponse response = patientAllergyService.addAllergy(patientId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @RateLimiter(name = "allergiesRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<Page<PatientAllergyResponse>> getPatientAllergies(
            @PathVariable String patientId,
            Pageable pageable) {

        Page<PatientAllergyResponse> response = patientAllergyService.getPatientAllergies(patientId, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/critical")
    @RateLimiter(name = "allergiesRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<List<PatientAllergyResponse>> getCriticalAllergies(
            @PathVariable String patientId) {

        List<PatientAllergyResponse> response = patientAllergyService.getCriticalAllergies(patientId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{allergyId}")
    @RateLimiter(name = "allergiesRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<PatientAllergyResponse> getAllergyById(
            @PathVariable String patientId,
            @PathVariable String allergyId) {

        PatientAllergyResponse response = patientAllergyService.getAllergyById(patientId, allergyId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{allergyId}")
    @RateLimiter(name = "allergiesRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<PatientAllergyResponse> updateAllergy(
            @PathVariable String patientId,
            @PathVariable String allergyId,
            @Valid @RequestBody UpdateAllergyRequest request) {

        PatientAllergyResponse response = patientAllergyService.updateAllergy(patientId, allergyId, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{allergyId}")
    @RateLimiter(name = "allergiesRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<PatientAllergyResponse> partialUpdateAllergy(
            @PathVariable String patientId,
            @PathVariable String allergyId,
            @Valid @RequestBody UpdateAllergyRequest request) {

        PatientAllergyResponse response = patientAllergyService.partialUpdateAllergy(patientId, allergyId, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{allergyId}/severity")
    @RateLimiter(name = "allergiesRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<PatientAllergyResponse> updateAllergySeverity(
            @PathVariable String patientId,
            @PathVariable String allergyId,
            @RequestParam String severity) {

        PatientAllergyResponse response = patientAllergyService.updateAllergySeverity(patientId, allergyId, severity);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{allergyId}")
    @RateLimiter(name = "allergiesRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<ApiResponse<String>> deleteAllergy(
            @PathVariable String patientId,
            @PathVariable String allergyId) {

        patientAllergyService.deleteAllergy(patientId, allergyId);
        return ResponseEntity.ok(ApiResponse.success("Allergy deleted successfully!"));
    }

    public ResponseEntity<ApiError> rateLimiterFallback(RequestNotPermitted ex) {
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setMessage("Too many requests. Please try again later.")
                .setStatus(HttpStatus.TOO_MANY_REQUESTS)
                .build();
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(apiError);
    }
}

