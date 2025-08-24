package com.aarogya.patient_management_service.controller;

import com.aarogya.patient_management_service.advices.ApiError;
import com.aarogya.patient_management_service.advices.ApiResponse;
import com.aarogya.patient_management_service.auth.UserContextHolder;
import com.aarogya.patient_management_service.dto.request.CreateEmergencyContactRequest;
import com.aarogya.patient_management_service.dto.request.UpdateEmergencyContactRequest;
import com.aarogya.patient_management_service.dto.response.EmergencyContactResponse;
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

    @GetMapping
    @RateLimiter(name = "emergencyContactsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<List<EmergencyContactResponse>> getPatientEmergencyContacts() {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        List<EmergencyContactResponse> response = emergencyContactService.getPatientEmergencyContacts(patientId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{contactId}")
    @RateLimiter(name = "emergencyContactsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<EmergencyContactResponse> getEmergencyContact(
            @PathVariable String contactId) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        EmergencyContactResponse response = emergencyContactService.getEmergencyContact(patientId, contactId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/primary")
    @RateLimiter(name = "emergencyContactsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<EmergencyContactResponse> getPrimaryContact() {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        EmergencyContactResponse response = emergencyContactService.getPrimaryContact(patientId);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @RateLimiter(name = "emergencyContactsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<EmergencyContactResponse> createEmergencyContact(
            @Valid @RequestBody CreateEmergencyContactRequest request) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        EmergencyContactResponse response = emergencyContactService.createEmergencyContact(patientId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{contactId}")
    @RateLimiter(name = "emergencyContactsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<EmergencyContactResponse> updateEmergencyContact(
            @PathVariable String contactId,
            @Valid @RequestBody UpdateEmergencyContactRequest request) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        EmergencyContactResponse response = emergencyContactService.updateEmergencyContact(patientId, contactId, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{contactId}")
    @RateLimiter(name = "emergencyContactsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<EmergencyContactResponse> partialUpdateEmergencyContact(
            @PathVariable String contactId,
            @Valid @RequestBody UpdateEmergencyContactRequest request) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        EmergencyContactResponse response = emergencyContactService.partialUpdateEmergencyContact(patientId, contactId, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{contactId}/primary")
    @RateLimiter(name = "emergencyContactsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<EmergencyContactResponse> setPrimaryContact(
            @PathVariable String contactId) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        EmergencyContactResponse response = emergencyContactService.setPrimaryContact(patientId, contactId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{contactId}")
    @RateLimiter(name = "emergencyContactsRateLimiter", fallbackMethod = "rateLimiterFallback")
    public ResponseEntity<ApiResponse<String>> deleteEmergencyContact(
            @PathVariable String contactId) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        emergencyContactService.deleteEmergencyContact(patientId, contactId);
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
