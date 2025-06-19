package com.aarogya.prescription_service.controller;

import com.aarogya.prescription_service.advices.ApiError;
import com.aarogya.prescription_service.advices.ApiResponse;
import com.aarogya.prescription_service.auth.UserContextHolder;
import com.aarogya.prescription_service.dto.*;
import com.aarogya.prescription_service.service.DrugInteractionService;
import com.aarogya.prescription_service.service.PrescriptionAnalyticsService;
import com.aarogya.prescription_service.service.PrescriptionService;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/core")
@RequiredArgsConstructor
@Validated
@Slf4j
public class PrescriptionController {

    private final PrescriptionService prescriptionService;
    private final DrugInteractionService drugInteractionService;
    private final PrescriptionAnalyticsService analyticsService;
    private static final String PRESCRIPTION_SERVICE = "prescriptionService";

    public ResponseEntity<ApiResponse<PrescriptionDTO>> prescriptionFallback(Throwable throwable) {
        log.warn("Fallback method called for prescription service", throwable);
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setMessage("Prescription service is currently unavailable. Please try again later.")
                .setStatus(HttpStatus.SERVICE_UNAVAILABLE)
                .build();
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ApiResponse.error(apiError));
    }

    public ResponseEntity<ApiResponse<List<PrescriptionDTO>>> prescriptionListFallback(Throwable throwable) {
        log.warn("Fallback method called for prescription service", throwable);
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setMessage("Prescription service is currently unavailable. Please try again later.")
                .setStatus(HttpStatus.SERVICE_UNAVAILABLE)
                .build();
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ApiResponse.error(apiError));
    }

    public ResponseEntity<ApiResponse<Page<PrescriptionDTO>>> prescriptionPageFallback(Throwable throwable) {
        log.warn("Fallback method called for prescription service", throwable);
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setMessage("Prescription service is currently unavailable. Please try again later.")
                .setStatus(HttpStatus.SERVICE_UNAVAILABLE)
                .build();
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ApiResponse.error(apiError));
    }

    public ResponseEntity<ApiResponse<String>> operationSuccessFallback(Throwable throwable) {
        return ResponseEntity.ok(ApiResponse.success("Operation may not have completed due to high load. Please verify status."));
    }

    @PostMapping("/appointments/{appointmentId}")
    @CircuitBreaker(name = PRESCRIPTION_SERVICE, fallbackMethod = "prescriptionFallback")
    @RateLimiter(name = PRESCRIPTION_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<PrescriptionDTO>> createPrescription(
            @PathVariable String appointmentId,
            @Valid @RequestBody CreatePrescriptionDTO createPrescriptionDTO) throws Exception {

        createPrescriptionDTO.setAppointmentId(appointmentId);
        createPrescriptionDTO.setDoctorId(UserContextHolder.getUserDetails().getUserId());

        PrescriptionDTO prescription = prescriptionService.createPrescription(createPrescriptionDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(prescription));
    }

    @PutMapping("/{prescriptionId}")
    @CircuitBreaker(name = PRESCRIPTION_SERVICE, fallbackMethod = "prescriptionFallback")
    @RateLimiter(name = PRESCRIPTION_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<PrescriptionDTO>> updatePrescription(
            @PathVariable String prescriptionId,
            @Valid @RequestBody UpdatePrescriptionDTO updatePrescriptionDTO) throws Exception {

        updatePrescriptionDTO.setDoctorId(UserContextHolder.getUserDetails().getUserId());

        PrescriptionDTO prescription = prescriptionService.updatePrescription(prescriptionId, updatePrescriptionDTO);
        return ResponseEntity.ok(ApiResponse.success(prescription));
    }

    @GetMapping("/{prescriptionId}")
    @CircuitBreaker(name = PRESCRIPTION_SERVICE, fallbackMethod = "prescriptionFallback")
    @RateLimiter(name = PRESCRIPTION_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<PrescriptionDTO>> getPrescription(
            @PathVariable String prescriptionId) {

        PrescriptionDTO prescription = prescriptionService.getPrescriptionById(prescriptionId);
        return ResponseEntity.ok(ApiResponse.success(prescription));
    }

    @GetMapping("/appointments/{appointmentId}")
    @CircuitBreaker(name = PRESCRIPTION_SERVICE, fallbackMethod = "prescriptionListFallback")
    @RateLimiter(name = PRESCRIPTION_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<List<PrescriptionDTO>>> getPrescriptionsByAppointment(
            @PathVariable String appointmentId) {

        List<PrescriptionDTO> prescriptions = prescriptionService.getPrescriptionsByAppointment(appointmentId);
        return ResponseEntity.ok(ApiResponse.success(prescriptions));
    }

    @GetMapping("/doctors/{doctorId}")
    @CircuitBreaker(name = PRESCRIPTION_SERVICE, fallbackMethod = "prescriptionPageFallback")
    @RateLimiter(name = PRESCRIPTION_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<Page<PrescriptionDTO>>> getDoctorPrescriptions(
            @PathVariable String doctorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        Page<PrescriptionDTO> prescriptions = prescriptionService.getDoctorPrescriptions(doctorId, pageRequest);
        return ResponseEntity.ok(ApiResponse.success(prescriptions));
    }

    @GetMapping("/patients/{patientId}")
    @CircuitBreaker(name = PRESCRIPTION_SERVICE, fallbackMethod = "prescriptionPageFallback")
    @RateLimiter(name = PRESCRIPTION_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<Page<PrescriptionDTO>>> getPatientPrescriptions(
            @PathVariable String patientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<PrescriptionDTO> prescriptions = prescriptionService.getPatientPrescriptions(patientId, pageRequest);
        return ResponseEntity.ok(ApiResponse.success(prescriptions));
    }

    @GetMapping("/doctors/{doctorId}/patients/{patientId}")
    @CircuitBreaker(name = PRESCRIPTION_SERVICE, fallbackMethod = "prescriptionListFallback")
    @RateLimiter(name = PRESCRIPTION_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<List<PrescriptionDTO>>> getDoctorPatientPrescriptions(
            @PathVariable String doctorId,
            @PathVariable String patientId) {

        List<PrescriptionDTO> prescriptions = prescriptionService.getDoctorPatientPrescriptions(doctorId, patientId);
        return ResponseEntity.ok(ApiResponse.success(prescriptions));
    }

    @DeleteMapping("/{prescriptionId}")
    @CircuitBreaker(name = PRESCRIPTION_SERVICE, fallbackMethod = "operationSuccessFallback")
    @RateLimiter(name = PRESCRIPTION_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<String>> deletePrescription(
            @PathVariable String prescriptionId) throws Exception {

        prescriptionService.deletePrescription(prescriptionId, UserContextHolder.getUserDetails().getUserId());
        return ResponseEntity.ok(ApiResponse.success("Prescription deleted successfully"));
    }

    @GetMapping("/search")
    @CircuitBreaker(name = PRESCRIPTION_SERVICE, fallbackMethod = "prescriptionListFallback")
    @RateLimiter(name = PRESCRIPTION_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<List<PrescriptionDTO>>> searchPrescriptions(
            @RequestParam String query) {

        List<PrescriptionDTO> prescriptions = prescriptionService.searchPrescriptions(query, UserContextHolder.getUserDetails().getUserId());
        return ResponseEntity.ok(ApiResponse.success(prescriptions));
    }

    @GetMapping("/follow-up-due")
    @CircuitBreaker(name = PRESCRIPTION_SERVICE, fallbackMethod = "prescriptionListFallback")
    @RateLimiter(name = PRESCRIPTION_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<List<PrescriptionDTO>>> getPrescriptionsWithFollowUpDue(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        List<PrescriptionDTO> prescriptions = prescriptionService.getPrescriptionsWithFollowUpDue(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(prescriptions));
    }

    @GetMapping("/doctors/{doctorId}/summary")
    @CircuitBreaker(name = PRESCRIPTION_SERVICE, fallbackMethod = "prescriptionFallback")
    @RateLimiter(name = PRESCRIPTION_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<PrescriptionSummaryDTO>> getPrescriptionSummary(
            @PathVariable String doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        PrescriptionSummaryDTO summary = prescriptionService.getPrescriptionSummary(doctorId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    @GetMapping("/doctors/{doctorId}/analytics")
    @CircuitBreaker(name = PRESCRIPTION_SERVICE, fallbackMethod = "prescriptionFallback")
    @RateLimiter(name = PRESCRIPTION_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<PrescriptionAnalyticsDTO>> getPrescriptionAnalytics(
            @PathVariable String doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        PrescriptionAnalyticsDTO analytics = analyticsService.getDoctorPrescriptionAnalytics(doctorId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(analytics));
    }

    @GetMapping("/doctors/{doctorId}/top-medicines")
    @CircuitBreaker(name = PRESCRIPTION_SERVICE, fallbackMethod = "mapResponseFallback")
    @RateLimiter(name = PRESCRIPTION_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<Map<String, Integer>>> getTopPrescribedMedicines(
            @PathVariable String doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "10") int limit) {

        Map<String, Integer> topMedicines = analyticsService.getTopPrescribedMedicines(doctorId, startDate, endDate, limit);
        return ResponseEntity.ok(ApiResponse.success(topMedicines));
    }

    @PostMapping("/check-interactions")
    @CircuitBreaker(name = PRESCRIPTION_SERVICE, fallbackMethod = "drugInteractionListFallback")
    @RateLimiter(name = PRESCRIPTION_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<List<DrugInteractionDTO>>> checkDrugInteractions(
            @RequestParam String patientId,
            @RequestBody List<PrescriptionMedicineDTO> medicines) {

        List<DrugInteractionDTO> interactions = drugInteractionService.checkDrugInteractions(patientId, medicines);
        return ResponseEntity.ok(ApiResponse.success(interactions));
    }

    @GetMapping("/patients/{patientId}/interactions")
    @CircuitBreaker(name = PRESCRIPTION_SERVICE, fallbackMethod = "drugInteractionListFallback")
    @RateLimiter(name = PRESCRIPTION_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<List<DrugInteractionDTO>>> getPatientDrugInteractions(
            @PathVariable String patientId) {

        List<DrugInteractionDTO> interactions = drugInteractionService.getPatientDrugInteractions(patientId);
        return ResponseEntity.ok(ApiResponse.success(interactions));
    }

    @PostMapping("/interactions/{interactionId}/resolve")
    @CircuitBreaker(name = PRESCRIPTION_SERVICE, fallbackMethod = "drugInteractionFallback")
    @RateLimiter(name = PRESCRIPTION_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<DrugInteractionDTO>> resolveInteraction(
            @PathVariable String interactionId,
            @RequestParam String resolution) {

        DrugInteractionDTO interaction = drugInteractionService.resolveInteraction(interactionId, resolution, UserContextHolder.getUserDetails().getUserId());
        return ResponseEntity.ok(ApiResponse.success(interaction));
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
