package com.aarogya.appointment_service.controller;

import com.aarogya.appointment_service.advices.ApiError;
import com.aarogya.appointment_service.advices.ApiResponse;
import com.aarogya.appointment_service.dto.request.AppointmentRequestDto;
import com.aarogya.appointment_service.dto.request.EmergencyAppointmentDto;
import com.aarogya.appointment_service.dto.request.UpdateAppointmentStatusDto;
import com.aarogya.appointment_service.dto.response.AppointmentResponseDto;
import com.aarogya.appointment_service.service.AppointmentService;
import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import io.github.resilience4j.ratelimiter.RateLimiterRegistry;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/core")
@Slf4j
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    private static final String APPOINTMENT_SERVICE = "appointmentService";

    @Bean
    public CircuitBreaker appointmentCircuitBreaker() {
        return CircuitBreakerRegistry.ofDefaults().circuitBreaker(APPOINTMENT_SERVICE);
    }

    @Bean
    public io.github.resilience4j.ratelimiter.RateLimiter appointmentRateLimiter() {
        return RateLimiterRegistry.ofDefaults().rateLimiter(APPOINTMENT_SERVICE);
    }

    public ResponseEntity<ApiResponse<AppointmentResponseDto>> appointmentServiceFallback(Object request, Throwable throwable) {
        log.warn("Fallback method called for appointment service", throwable);
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setMessage("Appointment service is currently unavailable. Please try again later.")
                .setStatus(HttpStatus.SERVICE_UNAVAILABLE)
                .build();
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ApiResponse.error(apiError));
    }

    public ResponseEntity<ApiResponse<Page<AppointmentResponseDto>>> appointmentListFallback(Throwable throwable) {
        log.warn("Fallback method called for appointment list", throwable);
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setMessage("Unable to retrieve appointments at this time. Please try again later.")
                .setStatus(HttpStatus.SERVICE_UNAVAILABLE)
                .build();
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ApiResponse.error(apiError));
    }

    @PostMapping
    @io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker(name = APPOINTMENT_SERVICE, fallbackMethod = "appointmentServiceFallback")
    @RateLimiter(name = APPOINTMENT_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<AppointmentResponseDto>> requestAppointment(
            @Valid @RequestBody AppointmentRequestDto requestDto) {
        log.info("Received appointment request for doctor: {}", requestDto.getDoctorId());
        AppointmentResponseDto response = appointmentService.requestAppointment(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response));
    }

    @PutMapping("/{id}/status")
    @io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker(name = APPOINTMENT_SERVICE, fallbackMethod = "appointmentServiceFallback")
    @RateLimiter(name = APPOINTMENT_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<AppointmentResponseDto>> updateAppointmentStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateAppointmentStatusDto updateDto) {
        log.info("Updating appointment status for ID: {}", id);
        AppointmentResponseDto response = appointmentService.updateAppointmentStatus(id, updateDto);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/emergency")
    @io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker(name = APPOINTMENT_SERVICE, fallbackMethod = "appointmentServiceFallback")
    @RateLimiter(name = APPOINTMENT_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<AppointmentResponseDto>> requestEmergencyAppointment(
            @Valid @RequestBody EmergencyAppointmentDto emergencyDto) {
        log.info("Received emergency appointment request");
        AppointmentResponseDto response = appointmentService.requestEmergencyAppointment(emergencyDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    @io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker(name = APPOINTMENT_SERVICE, fallbackMethod = "appointmentServiceFallback")
    @RateLimiter(name = APPOINTMENT_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<AppointmentResponseDto>> getAppointmentDetails(
            @PathVariable String id) {
        log.info("Fetching appointment details for ID: {}", id);
        AppointmentResponseDto response = appointmentService.getAppointmentDetails(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/patient")
    @io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker(name = APPOINTMENT_SERVICE, fallbackMethod = "appointmentListFallback")
    @RateLimiter(name = APPOINTMENT_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<Page<AppointmentResponseDto>>> getPatientAppointments(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("Fetching patient appointments with filters - status: {}, date: {}", status, date);
        Page<AppointmentResponseDto> response = appointmentService.getPatientAppointments(
                status != null ? status : null,
                date, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/doctor")
    @io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker(name = APPOINTMENT_SERVICE, fallbackMethod = "appointmentListFallback")
    @RateLimiter(name = APPOINTMENT_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<Page<AppointmentResponseDto>>> getDoctorAppointments(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("Fetching doctor appointments with filters - status: {}, date: {}", status, date);
        Page<AppointmentResponseDto> response = appointmentService.getDoctorAppointments(status, date, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/upcoming")
    @io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker(name = APPOINTMENT_SERVICE, fallbackMethod = "appointmentListFallback")
    @RateLimiter(name = APPOINTMENT_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<List<AppointmentResponseDto>>> getUpcomingAppointments(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate) {
        log.info("Request for upcoming appointments from date: {}", fromDate);
        List<AppointmentResponseDto> response = appointmentService.getUpcomingAppointments(fromDate);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/doctor/range")
    @io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker(name = APPOINTMENT_SERVICE, fallbackMethod = "appointmentListFallback")
    @RateLimiter(name = APPOINTMENT_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<List<AppointmentResponseDto>>> getDoctorAppointmentsBetweenDates(
            @RequestParam String doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        log.info("Request for doctor appointments between {} and {} for doctor {}", startDate, endDate, doctorId);
        List<AppointmentResponseDto> response = appointmentService.getDoctorAppointmentsBetweenDates(
                doctorId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/patient/range")
    @io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker(name = APPOINTMENT_SERVICE, fallbackMethod = "appointmentListFallback")
    @RateLimiter(name = APPOINTMENT_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<List<AppointmentResponseDto>>> getPatientAppointmentsBetweenDates(
            @RequestParam String patientId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        log.info("Request for patient appointments between {} and {} for patient {}", startDate, endDate, patientId);
        List<AppointmentResponseDto> response = appointmentService.getPatientAppointmentsBetweenDates(
                patientId, startDate, endDate);
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
