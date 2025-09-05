package com.aarogya.prescription_service.controller;

import com.aarogya.prescription_service.dto.request.*;
import com.aarogya.prescription_service.dto.response.MedicineDto;
import com.aarogya.prescription_service.dto.response.PrescriptionResponse;
import com.aarogya.prescription_service.service.PrescriptionService;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/core")
@Slf4j
@RequiredArgsConstructor
@Validated
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    @PostMapping
    @CircuitBreaker(name = "prescriptionController", fallbackMethod = "createPrescriptionFallback")
    @RateLimiter(name = "prescriptionController")
    public ResponseEntity<PrescriptionResponse> createPrescription(
            @Valid @RequestBody PrescriptionRequest request) {
        log.info("Received request to create prescription for appointment: {}", request.getAppointmentId());
        PrescriptionResponse response = prescriptionService.createPrescription(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PrescriptionResponse> getPrescription(@PathVariable String id) {
        log.debug("Fetching prescription with ID: {}", id);
        PrescriptionResponse response = prescriptionService.getPrescription(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @CircuitBreaker(name = "prescriptionController", fallbackMethod = "updatePrescriptionFallback")
    public ResponseEntity<PrescriptionResponse> updatePrescription(
            @PathVariable String id,
            @Valid @RequestBody PrescriptionRequest request) {
        log.info("Updating prescription with ID: {}", id);
        PrescriptionResponse response = prescriptionService.updatePrescription(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrescription(@PathVariable String id) {
        log.info("Deleting prescription with ID: {}", id);
        prescriptionService.deletePrescription(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/doctor")
    public ResponseEntity<Page<PrescriptionResponse>> getDoctorPrescriptions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {

        Sort sort = direction.equalsIgnoreCase("ASC") ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<PrescriptionResponse> responses = prescriptionService.getPrescriptionsByDoctor(pageable);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<PrescriptionResponse>> getPatientPrescriptions(
            @PathVariable String patientId) {
        log.debug("Fetching prescriptions for patient: {}", patientId);
        List<PrescriptionResponse> responses = prescriptionService.getPrescriptionsByPatient(patientId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/medicines/search")
    public ResponseEntity<Page<MedicineDto>> searchMedicines(
            @ModelAttribute MedicineSearchRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<MedicineDto> results = prescriptionService.searchMedicines(request, pageable);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/medicines/{medicineId}")
    public ResponseEntity<MedicineDto> getMedicineDetails(@PathVariable String medicineId) {
        log.debug("Fetching details for medicine: {}", medicineId);
        MedicineDto medicine = prescriptionService.getMedicineDetails(medicineId);
        return ResponseEntity.ok(medicine);
    }

    @PostMapping("/check-interactions")
    public ResponseEntity<List<MedicineInteractionCheck>> checkInteractions(
            @RequestBody List<String> medicineIds) {
        log.debug("Checking interactions for medicines: {}", medicineIds);
        List<MedicineInteractionCheck> interactions = prescriptionService.checkMedicineInteractions(medicineIds);
        return ResponseEntity.ok(interactions);
    }

    @PostMapping("/{prescriptionId}/medicines")
    @CircuitBreaker(name = "prescriptionController", fallbackMethod = "addMedicineFallback")
    @RateLimiter(name = "prescriptionController")
    public ResponseEntity<PrescriptionResponse> addMedicineToPrescription(
            @PathVariable String prescriptionId,
            @Valid @RequestBody AddMedicineRequest request) {
        log.info("Adding medicine {} to prescription {}", request.getMedicineId(), prescriptionId);
        PrescriptionResponse response = prescriptionService.addMedicineToPrescription(prescriptionId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{prescriptionId}/medicines")
    @CircuitBreaker(name = "prescriptionController", fallbackMethod = "removeMedicineFallback")
    public ResponseEntity<PrescriptionResponse> removeMedicineFromPrescription(
            @PathVariable String prescriptionId,
            @Valid @RequestBody RemoveMedicineRequest request) {
        log.info("Removing medicine {} from prescription {}", request.getMedicineId(), prescriptionId);
        PrescriptionResponse response = prescriptionService.removeMedicineFromPrescription(prescriptionId, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}")
    @CircuitBreaker(name = "prescriptionController", fallbackMethod = "partialUpdatePrescriptionFallback")
    public ResponseEntity<PrescriptionResponse> partialUpdatePrescription(
            @PathVariable String id,
            @RequestBody Map<String, Object> updates) {
        log.info("Partial update of prescription with ID: {}", id);
        PrescriptionResponse response = prescriptionService.partialUpdatePrescription(id, updates);
        return ResponseEntity.ok(response);
    }

    // Fallback methods
    public ResponseEntity<PrescriptionResponse> createPrescriptionFallback(
            PrescriptionRequest request, Throwable t) {
        log.error("Fallback triggered for createPrescription: {}", t.getMessage());
        return ResponseEntity.badRequest().body(null);
    }

    public ResponseEntity<PrescriptionResponse> updatePrescriptionFallback(
            String id, PrescriptionRequest request, Throwable t) {
        log.error("Fallback triggered for updatePrescription: {}", t.getMessage());
        return ResponseEntity.badRequest().body(null);
    }

    public ResponseEntity<PrescriptionResponse> addMedicineFallback(
            String prescriptionId, AddMedicineRequest request, Throwable t) {
        log.error("Fallback triggered for addMedicineToPrescription: {}", t.getMessage());
        return ResponseEntity.badRequest().body(null);
    }

    public ResponseEntity<PrescriptionResponse> removeMedicineFallback(
            String prescriptionId, RemoveMedicineRequest request, Throwable t) {
        log.error("Fallback triggered for removeMedicineFromPrescription: {}", t.getMessage());
        return ResponseEntity.badRequest().body(null);
    }

    public ResponseEntity<PrescriptionResponse> partialUpdatePrescriptionFallback(
            String id, Map<String, Object> updates, Throwable t) {
        log.error("Fallback triggered for partialUpdatePrescription: {}", t.getMessage());
        return ResponseEntity.badRequest().body(null);
    }
}
