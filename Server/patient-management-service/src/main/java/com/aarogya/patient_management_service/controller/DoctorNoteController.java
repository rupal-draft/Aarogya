package com.aarogya.patient_management_service.controller;

import com.aarogya.patient_management_service.advices.ApiError;
import com.aarogya.patient_management_service.advices.ApiResponse;
import com.aarogya.patient_management_service.auth.UserContextHolder;
import com.aarogya.patient_management_service.dto.request.CreateDoctorNoteRequest;
import com.aarogya.patient_management_service.dto.request.UpdateDoctorNoteRequest;
import com.aarogya.patient_management_service.dto.response.DoctorNoteResponse;
import com.aarogya.patient_management_service.exceptions.AccessForbidden;
import com.aarogya.patient_management_service.service.DoctorNoteService;
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

@RestController
@RequestMapping("/doctor-notes")
@Validated
public class DoctorNoteController {

    private final DoctorNoteService doctorNoteService;

    public DoctorNoteController(DoctorNoteService doctorNoteService) {
        this.doctorNoteService = doctorNoteService;
    }

    @GetMapping("/{patientId}")
    @RateLimiter(name = "doctorNotesRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<Page<DoctorNoteResponse>> getPatientNotes(
            @PathVariable String patientId,
            Pageable pageable) {

        validatePatientAccess(patientId);
        Page<DoctorNoteResponse> response = doctorNoteService.getPatientNotes(patientId, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @RateLimiter(name = "doctorNotesRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<Page<DoctorNoteResponse>> getMyNotes(
            Pageable pageable) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        validatePatientAccess(patientId);
        Page<DoctorNoteResponse> response = doctorNoteService.getPatientNotes(patientId, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{patientId}/{noteId}")
    @RateLimiter(name = "doctorNotesRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<DoctorNoteResponse> getPatientNote(
            @PathVariable String patientId,
            @PathVariable String noteId) {

        validatePatientAccess(patientId);
        DoctorNoteResponse response = doctorNoteService.getPatientNote(patientId, noteId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{patientId}/type/{noteType}")
    @RateLimiter(name = "doctorNotesRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<Page<DoctorNoteResponse>> getPatientNotesByType(
            @PathVariable String patientId,
            @PathVariable String noteType,
            Pageable pageable) {

        validatePatientAccess(patientId);
        Page<DoctorNoteResponse> response = doctorNoteService.getPatientNotesByType(patientId, noteType, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{patientId}/priority/{priority}")
    @RateLimiter(name = "doctorNotesRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<Page<DoctorNoteResponse>> getPatientNotesByPriority(
            @PathVariable String patientId,
            @PathVariable String priority,
            Pageable pageable) {

        validatePatientAccess(patientId);
        Page<DoctorNoteResponse> response = doctorNoteService.getPatientNotesByPriority(patientId, priority, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{patientId}/category/{category}")
    @RateLimiter(name = "doctorNotesRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<Page<DoctorNoteResponse>> getPatientNotesByCategory(
            @PathVariable String patientId,
            @PathVariable String category,
            Pageable pageable) {

        validatePatientAccess(patientId);
        Page<DoctorNoteResponse> response = doctorNoteService.getPatientNotesByCategory(patientId, category, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/non-private")
    @RateLimiter(name = "doctorNotesRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<Page<DoctorNoteResponse>> getNonPrivateNotes(
            Pageable pageable) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        validatePatientAccess(patientId);
        Page<DoctorNoteResponse> response = doctorNoteService.getNonPrivateNotes(patientId, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/urgent")
    @RateLimiter(name = "doctorNotesRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<Page<DoctorNoteResponse>> getUrgentNotes(
            Pageable pageable) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        validatePatientAccess(patientId);
        Page<DoctorNoteResponse> response = doctorNoteService.getUrgentNotes(patientId, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/recent/{days}")
    @RateLimiter(name = "doctorNotesRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<Page<DoctorNoteResponse>> getRecentNotes(
            @PathVariable @Min(1) int days,
            Pageable pageable) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        validatePatientAccess(patientId);
        Page<DoctorNoteResponse> response = doctorNoteService.getRecentNotes(patientId, days, pageable);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @RateLimiter(name = "doctorNotesRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<DoctorNoteResponse> createDoctorNote(
            @Valid @RequestBody CreateDoctorNoteRequest request) {

        DoctorNoteResponse response = doctorNoteService.createDoctorNote(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{patientId}/{noteId}")
    @RateLimiter(name = "doctorNotesRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<DoctorNoteResponse> updateDoctorNote(
            @PathVariable String patientId,
            @PathVariable String noteId,
            @Valid @RequestBody UpdateDoctorNoteRequest request) {

        validatePatientAccess(patientId);
        DoctorNoteResponse response = doctorNoteService.updateDoctorNote(patientId, noteId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{patientId}/{noteId}")
    @RateLimiter(name = "doctorNotesRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<ApiResponse<String>> deleteDoctorNote(
            @PathVariable String patientId,
            @PathVariable String noteId) {

        validatePatientAccess(patientId);
        doctorNoteService.deleteDoctorNote(patientId, noteId);
        return ResponseEntity.ok(ApiResponse.success("Doctor note deleted successfully!"));
    }

    public ResponseEntity<ApiError> rateLimiterFallback(RequestNotPermitted ex) {
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setMessage("Too many requests. Please try again later.")
                .setStatus(HttpStatus.TOO_MANY_REQUESTS)
                .build();

        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(apiError);
    }

    private void validatePatientAccess(String patientId) {
        String currentUserId = UserContextHolder.getUserDetails().getUserId();
        if (!currentUserId.equals(patientId)) {
            throw new AccessForbidden("Access denied to patient data");
        }
    }
}
