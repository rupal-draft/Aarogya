package com.aarogya.appointment_service.controller;

import com.aarogya.appointment_service.advices.ApiError;
import com.aarogya.appointment_service.advices.ApiResponse;
import com.aarogya.appointment_service.dto.request.FollowUpRequestDto;
import com.aarogya.appointment_service.dto.response.FollowUpResponseDto;
import com.aarogya.appointment_service.service.FollowUpService;
import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerConfig;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import io.github.resilience4j.ratelimiter.RateLimiterConfig;
import io.github.resilience4j.ratelimiter.RateLimiterRegistry;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/followup")
@Slf4j
public class FollowUpController {

    private final FollowUpService followUpService;

    public FollowUpController(FollowUpService followUpService) {
        this.followUpService = followUpService;
    }

    private static final String FOLLOW_UP_SERVICE = "followUpService";

    @Bean
    public CircuitBreakerConfig circuitBreakerConfig() {
        return CircuitBreakerConfig.custom()
                .failureRateThreshold(50)
                .waitDurationInOpenState(Duration.ofMillis(1000))
                .permittedNumberOfCallsInHalfOpenState(3)
                .slidingWindowSize(5)
                .recordExceptions(Exception.class)
                .build();
    }

    @Bean
    public RateLimiterConfig rateLimiterConfig() {
        return RateLimiterConfig.custom()
                .limitForPeriod(10)
                .limitRefreshPeriod(Duration.ofSeconds(1))
                .timeoutDuration(Duration.ofMillis(100))
                .build();
    }

    @Bean
    public CircuitBreakerRegistry circuitBreakerRegistry() {
        return CircuitBreakerRegistry.of(circuitBreakerConfig());
    }

    @Bean
    public RateLimiterRegistry rateLimiterRegistry() {
        return RateLimiterRegistry.of(rateLimiterConfig());
    }

    @Bean
    public CircuitBreaker followUpCircuitBreaker() {
        return circuitBreakerRegistry().circuitBreaker(FOLLOW_UP_SERVICE);
    }

    @Bean
    public io.github.resilience4j.ratelimiter.RateLimiter followUpRateLimiter() {
        return rateLimiterRegistry().rateLimiter(FOLLOW_UP_SERVICE);
    }

    public ResponseEntity<ApiResponse<FollowUpResponseDto>> followUpServiceFallback(String id, Throwable throwable) {
        log.warn("Fallback method called for follow-up service", throwable);
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setMessage("Follow-up service is currently unavailable. Please try again later.")
                .setStatus(HttpStatus.SERVICE_UNAVAILABLE)
                .build();
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ApiResponse.error(apiError));
    }

    public ResponseEntity<ApiResponse<Page<FollowUpResponseDto>>> followUpListFallback(Throwable throwable) {
        log.warn("Fallback method called for follow-up list", throwable);
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setMessage("Unable to retrieve follow-ups at this time. Please try again later.")
                .setStatus(HttpStatus.SERVICE_UNAVAILABLE)
                .build();
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ApiResponse.error(apiError));
    }

    @PostMapping
    @io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker(name = FOLLOW_UP_SERVICE, fallbackMethod = "followUpServiceFallback")
    @RateLimiter(name = FOLLOW_UP_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<FollowUpResponseDto>> scheduleFollowUp(
            @RequestParam String originalAppointmentId,
            @Valid @RequestBody FollowUpRequestDto requestDto) {

        FollowUpResponseDto response = followUpService.scheduleFollowUp(originalAppointmentId, requestDto);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    @io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker(name = FOLLOW_UP_SERVICE, fallbackMethod = "followUpListFallback")
    @RateLimiter(name = FOLLOW_UP_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<Page<FollowUpResponseDto>>> getFollowUps(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<FollowUpResponseDto> response = followUpService.getFollowUps(status, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/date-range")
    @io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker(name = FOLLOW_UP_SERVICE, fallbackMethod = "followUpListFallback")
    @RateLimiter(name = FOLLOW_UP_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<Page<FollowUpResponseDto>>> getFollowUpsByDateRange(
            @RequestParam(required = false) String status,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<FollowUpResponseDto> response = followUpService.getFollowUpsByDateRange(status, startDate, endDate, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/urgent")
    @io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker(name = FOLLOW_UP_SERVICE, fallbackMethod = "followUpListFallback")
    @RateLimiter(name = FOLLOW_UP_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<List<FollowUpResponseDto>>> getUrgentFollowUps(
            @RequestParam String doctorId,
            @RequestParam @Min(1) @Max(5) Integer urgencyLevel) {

        List<FollowUpResponseDto> response = followUpService.getUrgentFollowUps(doctorId, urgencyLevel);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/patient-summary")
    @io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker(name = FOLLOW_UP_SERVICE, fallbackMethod = "followUpListFallback")
    @RateLimiter(name = FOLLOW_UP_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<List<FollowUpResponseDto>>> getPatientFollowUpSummary(
            @RequestParam String patientId,
            @RequestParam(required = false) String status) {

        List<FollowUpResponseDto> response = followUpService.getPatientFollowUpSummary(patientId, status);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{followUpId}/status")
    @io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker(name = FOLLOW_UP_SERVICE, fallbackMethod = "followUpServiceFallback")
    @RateLimiter(name = FOLLOW_UP_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<FollowUpResponseDto>> updateFollowUpStatus(
            @PathVariable String followUpId,
            @RequestParam String status) {

        FollowUpResponseDto response = followUpService.updateFollowUpStatus(followUpId, status);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{followUpId}")
    @io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker(name = FOLLOW_UP_SERVICE, fallbackMethod = "followUpServiceFallback")
    @RateLimiter(name = FOLLOW_UP_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<FollowUpResponseDto>> getFollowUpDetails(
            @PathVariable String followUpId) {

        FollowUpResponseDto response = followUpService.getFollowUpDetails(followUpId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @Scheduled(cron = "0 0 9 * * ?")
    @PostMapping("/process-overdue")
    @io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker(name = FOLLOW_UP_SERVICE, fallbackMethod = "followUpListFallback")
    @RateLimiter(name = FOLLOW_UP_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<List<FollowUpResponseDto>>> processOverdueFollowUps() {
        List<FollowUpResponseDto> response = followUpService.processOverdueFollowUps();
        return ResponseEntity.ok(ApiResponse.success(response));
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
