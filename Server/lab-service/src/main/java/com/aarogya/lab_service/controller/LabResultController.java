package com.aarogya.lab_service.controller;

import com.aarogya.lab_service.advices.ApiError;
import com.aarogya.lab_service.advices.ApiResponse;
import com.aarogya.lab_service.auth.UserContextHolder;
import com.aarogya.lab_service.dto.request.UpdateLabResultRequest;
import com.aarogya.lab_service.dto.response.LabResultResponse;
import com.aarogya.lab_service.service.LabResultService;
import io.github.resilience4j.ratelimiter.RateLimiterRegistry;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/results")
@Slf4j
public class LabResultController {

    private final LabResultService labResultService;

    public LabResultController(LabResultService labResultService, RateLimiterRegistry rateLimiterRegistry) {
        this.labResultService = labResultService;
    }

    @GetMapping("/my-results")
    @RateLimiter(name = "highRateEndpoints", fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<Page<LabResultResponse>>> getMyResults(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) int size) {

        String patientId = UserContextHolder.getUserDetails().getUserId();
        log.info("GET /api/v1/lab/results/my-results - patient: {}, page: {}, size: {}",
                patientId, page, size);

        Page<LabResultResponse> results = labResultService.getPatientResults(patientId, page, size);
        return ResponseEntity.ok(ApiResponse.success("Patient results retrieved successfully", results));
    }

    @GetMapping("/doctor-results")
    @RateLimiter(name = "highRateEndpoints", fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<Page<LabResultResponse>>> getDoctorResults(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) int size) {

        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("GET /api/v1/lab/results/doctor-results - doctor: {}, page: {}, size: {}",
                doctorId, page, size);

        Page<LabResultResponse> results = labResultService.getDoctorPatientResults(doctorId, page, size);
        return ResponseEntity.ok(ApiResponse.success("Doctor patient results retrieved successfully", results));
    }

    @GetMapping("/order/{orderId}")
    @RateLimiter(name = "labResultController", fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<List<LabResultResponse>>> getOrderResults(
            @PathVariable @NotBlank String orderId) {

        log.info("GET /api/v1/lab/results/order/{}", orderId);

        List<LabResultResponse> results = labResultService.getOrderResults(orderId);
        return ResponseEntity.ok(ApiResponse.success("Order results retrieved successfully", results));
    }

    @GetMapping("/{resultId}")
    @RateLimiter(name = "labResultController", fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<LabResultResponse>> getResultById(
            @PathVariable @NotBlank String resultId) {

        log.info("GET /api/v1/lab/results/{}", resultId);

        LabResultResponse result = labResultService.getResultById(resultId);
        return ResponseEntity.ok(ApiResponse.success("Lab result retrieved successfully", result));
    }

    @GetMapping("/date-range")
    @RateLimiter(name = "labResultController", fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<List<LabResultResponse>>> getResultsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        String patientId = UserContextHolder.getUserDetails().getUserId();
        log.info("GET /api/v1/lab/results/date-range - patient: {}, start: {}, end: {}",
                patientId, startDate, endDate);

        List<LabResultResponse> results = labResultService.getPatientResultsByDateRange(
                patientId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Results by date range retrieved successfully", results));
    }

    @GetMapping("/abnormal")
    @RateLimiter(name = "labResultController", fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<List<LabResultResponse>>> getAbnormalResults() {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        log.info("GET /api/v1/lab/results/abnormal - patient: {}", patientId);

        List<LabResultResponse> results = labResultService.getAbnormalResults(patientId);
        return ResponseEntity.ok(ApiResponse.success("Abnormal results retrieved successfully", results));
    }

    @PutMapping("/{resultId}")
    @RateLimiter(name = "lowRateEndpoints", fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<LabResultResponse>> updateResult(
            @PathVariable @NotBlank String resultId,
            @Valid @RequestBody UpdateLabResultRequest request) {

        log.info("PUT /api/v1/lab/results/{}", resultId);

        LabResultResponse result = labResultService.updateResult(resultId, request);
        return ResponseEntity.ok(ApiResponse.success("Lab result updated successfully", result));
    }

    public ResponseEntity<ApiResponse<?>> rateLimitFallback(Exception ex) {
        log.warn("Rate limit exceeded for LabResultController: {}", ex.getMessage());

        ApiError error = new ApiError.ApiErrorBuilder()
                .setMessage("Too many requests. Please try again later.")
                .setStatus(HttpStatus.TOO_MANY_REQUESTS)
                .setSubErrors(List.of("Rate limit exceeded", "Please wait before making another request"))
                .build();

        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .body(ApiResponse.error("Too many requests. Please try again later.",error));
    }
}
