package com.aarogya.prescription_service.controller;

import com.aarogya.prescription_service.advices.ApiError;
import com.aarogya.prescription_service.advices.ApiResponse;
import com.aarogya.prescription_service.dto.PrescriptionAnalyticsDTO;
import com.aarogya.prescription_service.service.PrescriptionAnalyticsService;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/prescription-analytics")
@RequiredArgsConstructor
@Slf4j
public class PrescriptionAnalyticsController {

    private final PrescriptionAnalyticsService analyticsService;
    private static final String ANALYTICS_SERVICE = "analyticsService";

    public ResponseEntity<ApiResponse<PrescriptionAnalyticsDTO>> analyticsFallback(Throwable throwable) {
        log.warn("Fallback method called for analytics service", throwable);
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setMessage("Analytics service is currently unavailable. Please try again later.")
                .setStatus(HttpStatus.SERVICE_UNAVAILABLE)
                .build();
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ApiResponse.error(apiError));
    }

    public ResponseEntity<ApiResponse<Map<String, Integer>>> mapResponseFallback(Throwable throwable) {
        log.warn("Fallback method called for analytics service", throwable);
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setMessage("Analytics service is currently unavailable. Please try again later.")
                .setStatus(HttpStatus.SERVICE_UNAVAILABLE)
                .build();
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ApiResponse.error(apiError));
    }

    public ResponseEntity<ApiResponse<List<String>>> listResponseFallback(Throwable throwable) {
        log.warn("Fallback method called for analytics service", throwable);
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setMessage("Analytics service is currently unavailable. Please try again later.")
                .setStatus(HttpStatus.SERVICE_UNAVAILABLE)
                .build();
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ApiResponse.error(apiError));
    }

    public ResponseEntity<ApiResponse<Double>> doubleResponseFallback(Throwable throwable) {
        log.warn("Fallback method called for analytics service", throwable);
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setMessage("Analytics service is currently unavailable. Please try again later.")
                .setStatus(HttpStatus.SERVICE_UNAVAILABLE)
                .build();
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ApiResponse.error(apiError));
    }

    @GetMapping("/doctors/{doctorId}")
    @CircuitBreaker(name = ANALYTICS_SERVICE, fallbackMethod = "analyticsFallback")
    @RateLimiter(name = ANALYTICS_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<PrescriptionAnalyticsDTO>> getDoctorAnalytics(
            @PathVariable String doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        PrescriptionAnalyticsDTO analytics = analyticsService.getDoctorPrescriptionAnalytics(doctorId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(analytics));
    }

    @GetMapping("/patients/{patientId}")
    @CircuitBreaker(name = ANALYTICS_SERVICE, fallbackMethod = "analyticsFallback")
    @RateLimiter(name = ANALYTICS_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<PrescriptionAnalyticsDTO>> getPatientAnalytics(
            @PathVariable String patientId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        PrescriptionAnalyticsDTO analytics = analyticsService.getPatientPrescriptionAnalytics(patientId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(analytics));
    }

    @GetMapping("/doctors/{doctorId}/top-medicines")
    @CircuitBreaker(name = ANALYTICS_SERVICE, fallbackMethod = "mapResponseFallback")
    @RateLimiter(name = ANALYTICS_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<Map<String, Integer>>> getTopPrescribedMedicines(
            @PathVariable String doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "10") int limit) {

        Map<String, Integer> topMedicines = analyticsService.getTopPrescribedMedicines(doctorId, startDate, endDate, limit);
        return ResponseEntity.ok(ApiResponse.success(topMedicines));
    }

    @GetMapping("/doctors/{doctorId}/top-diagnoses")
    @CircuitBreaker(name = ANALYTICS_SERVICE, fallbackMethod = "mapResponseFallback")
    @RateLimiter(name = ANALYTICS_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<Map<String, Integer>>> getTopDiagnoses(
            @PathVariable String doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "10") int limit) {

        Map<String, Integer> topDiagnoses = analyticsService.getTopDiagnoses(doctorId, startDate, endDate, limit);
        return ResponseEntity.ok(ApiResponse.success(topDiagnoses));
    }

    @GetMapping("/doctors/{doctorId}/trends")
    @CircuitBreaker(name = ANALYTICS_SERVICE, fallbackMethod = "mapResponseFallback")
    @RateLimiter(name = ANALYTICS_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<Map<String, Double>>> getPrescriptionTrends(
            @PathVariable String doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        Map<String, Double> trends = analyticsService.getPrescriptionTrends(doctorId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(trends));
    }

    @GetMapping("/doctors/{doctorId}/interaction-alerts")
    @CircuitBreaker(name = ANALYTICS_SERVICE, fallbackMethod = "listResponseFallback")
    @RateLimiter(name = ANALYTICS_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<List<String>>> getDrugInteractionAlerts(
            @PathVariable String doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<String> alerts = analyticsService.getDrugInteractionAlerts(doctorId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(alerts));
    }

    @GetMapping("/doctors/{doctorId}/status-distribution")
    @CircuitBreaker(name = ANALYTICS_SERVICE, fallbackMethod = "mapResponseFallback")
    @RateLimiter(name = ANALYTICS_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<Map<String, Integer>>> getPrescriptionsByStatus(
            @PathVariable String doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        Map<String, Integer> statusDistribution = analyticsService.getPrescriptionsByStatus(doctorId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(statusDistribution));
    }

    @GetMapping("/doctors/{doctorId}/average-value")
    @CircuitBreaker(name = ANALYTICS_SERVICE, fallbackMethod = "doubleResponseFallback")
    @RateLimiter(name = ANALYTICS_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<Double>> getAveragePrescriptionValue(
            @PathVariable String doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        Double averageValue = analyticsService.getAveragePrescriptionValue(doctorId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(averageValue));
    }

    public ResponseEntity<ApiResponse<String>> rateLimitFallback(String serviceName, Throwable throwable) {
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setMessage("Too many requests to " + serviceName + ". Please try again later.")
                .setStatus(HttpStatus.TOO_MANY_REQUESTS)
                .build();
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .body(ApiResponse.error(apiError));
    }
}
