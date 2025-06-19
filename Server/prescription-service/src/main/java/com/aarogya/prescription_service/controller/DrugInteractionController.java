package com.aarogya.prescription_service.controller;

import com.aarogya.prescription_service.advices.ApiError;
import com.aarogya.prescription_service.advices.ApiResponse;
import com.aarogya.prescription_service.auth.UserContextHolder;
import com.aarogya.prescription_service.dto.DrugInteractionDTO;
import com.aarogya.prescription_service.dto.PrescriptionMedicineDTO;
import com.aarogya.prescription_service.service.DrugInteractionService;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/drug-interactions")
@RequiredArgsConstructor
@Slf4j
public class DrugInteractionController {

    private final DrugInteractionService drugInteractionService;
    private static final String DRUG_INTERACTION_SERVICE = "drugInteractionService";

    public ResponseEntity<ApiResponse<List<DrugInteractionDTO>>> drugInteractionListFallback(Throwable throwable) {
        log.warn("Fallback method called for drug interaction service", throwable);
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setMessage("Drug interaction service is currently unavailable. Please try again later.")
                .setStatus(HttpStatus.SERVICE_UNAVAILABLE)
                .build();
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ApiResponse.error(apiError));
    }

    public ResponseEntity<ApiResponse<DrugInteractionDTO>> drugInteractionFallback(Throwable throwable) {
        log.warn("Fallback method called for drug interaction service", throwable);
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setMessage("Drug interaction service is currently unavailable. Please try again later.")
                .setStatus(HttpStatus.SERVICE_UNAVAILABLE)
                .build();
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ApiResponse.error(apiError));
    }

    @PostMapping("/check")
    @CircuitBreaker(name = DRUG_INTERACTION_SERVICE, fallbackMethod = "drugInteractionListFallback")
    @RateLimiter(name = DRUG_INTERACTION_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<List<DrugInteractionDTO>>> checkDrugInteractions(
            @RequestParam String patientId,
            @RequestBody List<PrescriptionMedicineDTO> medicines) {

        List<DrugInteractionDTO> interactions = drugInteractionService.checkDrugInteractions(patientId, medicines);
        return ResponseEntity.ok(ApiResponse.success(interactions));
    }

    @PostMapping("/check-with-existing")
    @CircuitBreaker(name = DRUG_INTERACTION_SERVICE, fallbackMethod = "drugInteractionListFallback")
    @RateLimiter(name = DRUG_INTERACTION_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<List<DrugInteractionDTO>>> checkDrugInteractionsWithExisting(
            @RequestParam String patientId,
            @RequestBody List<PrescriptionMedicineDTO> newMedicines) {

        List<DrugInteractionDTO> interactions = drugInteractionService.checkDrugInteractionsWithExisting(patientId, newMedicines);
        return ResponseEntity.ok(ApiResponse.success(interactions));
    }

    @GetMapping("/specific")
    @CircuitBreaker(name = DRUG_INTERACTION_SERVICE, fallbackMethod = "drugInteractionFallback")
    @RateLimiter(name = DRUG_INTERACTION_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<DrugInteractionDTO>> checkSpecificInteraction(
            @RequestParam String drug1,
            @RequestParam String drug2) {

        DrugInteractionDTO interaction = drugInteractionService.checkSpecificInteraction(drug1, drug2);
        return ResponseEntity.ok(ApiResponse.success(interaction));
    }

    @GetMapping("/patients/{patientId}")
    @CircuitBreaker(name = DRUG_INTERACTION_SERVICE, fallbackMethod = "drugInteractionListFallback")
    @RateLimiter(name = DRUG_INTERACTION_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<List<DrugInteractionDTO>>> getPatientDrugInteractions(
            @PathVariable String patientId) {

        List<DrugInteractionDTO> interactions = drugInteractionService.getPatientDrugInteractions(patientId);
        return ResponseEntity.ok(ApiResponse.success(interactions));
    }

    @GetMapping("/patients/{patientId}/critical")
    @CircuitBreaker(name = DRUG_INTERACTION_SERVICE, fallbackMethod = "drugInteractionListFallback")
    @RateLimiter(name = DRUG_INTERACTION_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<List<DrugInteractionDTO>>> getCriticalInteractions(
            @PathVariable String patientId) {

        List<DrugInteractionDTO> interactions = drugInteractionService.getCriticalInteractions(patientId);
        return ResponseEntity.ok(ApiResponse.success(interactions));
    }

    @PostMapping("/{interactionId}/resolve")
    @CircuitBreaker(name = DRUG_INTERACTION_SERVICE, fallbackMethod = "drugInteractionFallback")
    @RateLimiter(name = DRUG_INTERACTION_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<DrugInteractionDTO>> resolveInteraction(
            @PathVariable String interactionId,
            @RequestParam String resolution) {

        DrugInteractionDTO interaction = drugInteractionService.resolveInteraction(interactionId, resolution, UserContextHolder.getUserDetails().getUserId());
        return ResponseEntity.ok(ApiResponse.success(interaction));
    }

    @PostMapping("/{interactionId}/ignore")
    @CircuitBreaker(name = DRUG_INTERACTION_SERVICE, fallbackMethod = "operationSuccessFallback")
    @RateLimiter(name = DRUG_INTERACTION_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<String>> ignoreInteraction(
            @PathVariable String interactionId,
            @RequestParam String reason) {

        drugInteractionService.ignoreInteraction(interactionId, reason, UserContextHolder.getUserDetails().getUserId());
        return ResponseEntity.ok(ApiResponse.success("Interaction ignored successfully"));
    }

    public ResponseEntity<ApiResponse<String>> rateLimitFallback(String serviceName, Throwable throwable) {
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setMessage("Too many requests to " + serviceName + ". Please try again later.")
                .setStatus(HttpStatus.TOO_MANY_REQUESTS)
                .build();
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .body(ApiResponse.error(apiError));
    }

    public ResponseEntity<ApiResponse<String>> operationSuccessFallback(Throwable throwable) {
        return ResponseEntity.ok(ApiResponse.success("Operation may not have completed due to high load. Please verify status."));
    }
}
