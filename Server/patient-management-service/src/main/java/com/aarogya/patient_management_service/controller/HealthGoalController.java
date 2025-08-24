package com.aarogya.patient_management_service.controller;

import com.aarogya.patient_management_service.advices.ApiError;
import com.aarogya.patient_management_service.advices.ApiResponse;
import com.aarogya.patient_management_service.auth.UserContextHolder;
import com.aarogya.patient_management_service.dto.request.CreateHealthGoalRequest;
import com.aarogya.patient_management_service.dto.request.UpdateHealthGoalRequest;
import com.aarogya.patient_management_service.dto.response.HealthGoalResponse;
import com.aarogya.patient_management_service.dto.response.HealthGoalStatsResponse;
import com.aarogya.patient_management_service.service.HealthGoalService;
import io.github.resilience4j.ratelimiter.RequestNotPermitted;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/health-goals")
@Validated
public class HealthGoalController {

    private final HealthGoalService healthGoalService;

    public HealthGoalController(HealthGoalService healthGoalService) {
        this.healthGoalService = healthGoalService;
    }

    @GetMapping
    @RateLimiter(name = "healthGoalsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<Page<HealthGoalResponse>> getPatientHealthGoals(Pageable pageable) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        Page<HealthGoalResponse> response = healthGoalService.getPatientHealthGoals(patientId, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{goalId}")
    @RateLimiter(name = "healthGoalsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<HealthGoalResponse> getHealthGoal(@PathVariable String goalId) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        HealthGoalResponse response = healthGoalService.getHealthGoal(patientId, goalId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/active")
    @RateLimiter(name = "healthGoalsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<Page<HealthGoalResponse>> getActiveGoals(Pageable pageable) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        Page<HealthGoalResponse> response = healthGoalService.getActiveGoals(patientId, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/type/{goalType}")
    @RateLimiter(name = "healthGoalsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<Page<HealthGoalResponse>> getGoalsByType(
            @PathVariable String goalType,
            Pageable pageable) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        Page<HealthGoalResponse> response = healthGoalService.getGoalsByType(patientId, goalType, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/priority/{priority}")
    @RateLimiter(name = "healthGoalsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<Page<HealthGoalResponse>> getGoalsByPriority(
            @PathVariable String priority,
            Pageable pageable) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        Page<HealthGoalResponse> response = healthGoalService.getGoalsByPriority(patientId, priority, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/overdue")
    @RateLimiter(name = "healthGoalsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<Page<HealthGoalResponse>> getOverdueGoals(Pageable pageable) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        Page<HealthGoalResponse> response = healthGoalService.getOverdueGoals(patientId, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status/{status}")
    @RateLimiter(name = "healthGoalsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<Page<HealthGoalResponse>> getGoalsByStatus(
            @PathVariable String status,
            Pageable pageable) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        Page<HealthGoalResponse> response = healthGoalService.getGoalsByStatus(patientId, status, pageable);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @RateLimiter(name = "healthGoalsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<HealthGoalResponse> createHealthGoal(
            @Valid @RequestBody CreateHealthGoalRequest request) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        HealthGoalResponse response = healthGoalService.createHealthGoal(patientId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{goalId}")
    @RateLimiter(name = "healthGoalsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<HealthGoalResponse> updateHealthGoal(
            @PathVariable String goalId,
            @Valid @RequestBody UpdateHealthGoalRequest request) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        HealthGoalResponse response = healthGoalService.updateHealthGoal(patientId, goalId, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{goalId}")
    @RateLimiter(name = "healthGoalsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<HealthGoalResponse> partialUpdateHealthGoal(
            @PathVariable String goalId,
            @Valid @RequestBody UpdateHealthGoalRequest request) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        HealthGoalResponse response = healthGoalService.partialUpdateHealthGoal(patientId, goalId, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{goalId}/progress")
    @RateLimiter(name = "healthGoalsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<HealthGoalResponse> updateProgress(
            @PathVariable String goalId,
            @RequestParam @DecimalMin("0.0") BigDecimal currentValue) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        HealthGoalResponse response = healthGoalService.updateProgress(patientId, goalId, currentValue);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{goalId}/progress/add")
    @RateLimiter(name = "healthGoalsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<HealthGoalResponse> addToProgress(
            @PathVariable String goalId,
            @RequestParam @DecimalMin("0.0") BigDecimal increment) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        HealthGoalResponse response = healthGoalService.addToProgress(patientId, goalId, increment);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{goalId}/status")
    @RateLimiter(name = "healthGoalsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<HealthGoalResponse> updateStatus(
            @PathVariable String goalId,
            @RequestParam String status) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        HealthGoalResponse response = healthGoalService.updateStatus(patientId, goalId, status);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{goalId}")
    @RateLimiter(name = "healthGoalsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<ApiResponse<String>> deleteHealthGoal(@PathVariable String goalId) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        healthGoalService.deleteHealthGoal(patientId, goalId);
        return ResponseEntity.ok(ApiResponse.success("Health goal deleted successfully!"));
    }

    @GetMapping("/stats")
    @RateLimiter(name = "healthGoalsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<HealthGoalStatsResponse> getHealthGoalStats() {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        HealthGoalStatsResponse response = healthGoalService.getHealthGoalStats(patientId);
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
