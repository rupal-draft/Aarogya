package com.aarogya.patient_management_service.controller;

import com.aarogya.patient_management_service.advices.ApiError;
import com.aarogya.patient_management_service.advices.ApiResponse;
import com.aarogya.patient_management_service.auth.UserContext;
import com.aarogya.patient_management_service.auth.UserContextHolder;
import com.aarogya.patient_management_service.dto.request.CreateEmergencyContactRequest;
import com.aarogya.patient_management_service.dto.request.UpdateEmergencyContactRequest;
import com.aarogya.patient_management_service.dto.response.EmergencyContactResponse;
import com.aarogya.patient_management_service.exceptions.AccessForbidden;
import com.aarogya.patient_management_service.service.EmergencyContactService;
import io.github.resilience4j.ratelimiter.RequestNotPermitted;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/emergency-contacts")
@Validated
public class EmergencyContactController {

    private final EmergencyContactService emergencyContactService;

    public EmergencyContactController(EmergencyContactService emergencyContactService) {
        this.emergencyContactService = emergencyContactService;
    }

    private String getEffectivePatientId(String patientIdFromPath) {
        UserContext user = UserContextHolder.getUserDetails();
        if ("PATIENT".equals(user.getRole())) {
            return user.getUserId();
        } else if ("DOCTOR".equals(user.getRole())) {
            return patientIdFromPath;
        } else {
            throw new AccessForbidden("Unauthorized access");
        }
    }

    @GetMapping("/{patientId}")
    @RateLimiter(name = "emergencyContactsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<List<EmergencyContactResponse>> getPatientEmergencyContacts(
            @PathVariable String patientId) {
        String effectivePatientId = getEffectivePatientId(patientId);
        List<EmergencyContactResponse> response = emergencyContactService.getPatientEmergencyContacts(effectivePatientId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{patientId}/{contactId}")
    @RateLimiter(name = "emergencyContactsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<EmergencyContactResponse> getEmergencyContact(
            @PathVariable String patientId,
            @PathVariable String contactId) {
        String effectivePatientId = getEffectivePatientId(patientId);
        EmergencyContactResponse response = emergencyContactService.getEmergencyContact(effectivePatientId, contactId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{patientId}")
    @RateLimiter(name = "emergencyContactsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<EmergencyContactResponse> createEmergencyContact(
            @PathVariable String patientId,
            @Valid @RequestBody CreateEmergencyContactRequest request) {
        String effectivePatientId = getEffectivePatientId(patientId);
        EmergencyContactResponse response = emergencyContactService.createEmergencyContact(effectivePatientId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{patientId}/{contactId}")
    @RateLimiter(name = "emergencyContactsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<EmergencyContactResponse> updateEmergencyContact(
            @PathVariable String patientId,
            @PathVariable String contactId,
            @Valid @RequestBody UpdateEmergencyContactRequest request) {
        String effectivePatientId = getEffectivePatientId(patientId);
        EmergencyContactResponse response = emergencyContactService.updateEmergencyContact(effectivePatientId, contactId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{patientId}/{contactId}")
    @RateLimiter(name = "emergencyContactsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<ApiResponse<String>> deleteEmergencyContact(
            @PathVariable String patientId,
            @PathVariable String contactId) {
        String effectivePatientId = getEffectivePatientId(patientId);
        emergencyContactService.deleteEmergencyContact(effectivePatientId, contactId);
        return ResponseEntity.ok(ApiResponse.success("Emergency contact deleted successfully!"));
    }

    public ResponseEntity<ApiError> rateLimiterFallback(RequestNotPermitted ex) {
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setMessage("Too many requests. Please try again later.")
                .setStatus(HttpStatus.TOO_MANY_REQUESTS)
                .build();
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(apiError);
    }
}
