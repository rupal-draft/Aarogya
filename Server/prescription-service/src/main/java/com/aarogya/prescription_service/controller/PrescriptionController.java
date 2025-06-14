package com.aarogya.prescription_service.controller;

import com.aarogya.prescription_service.auth.UserContextHolder;
import com.aarogya.prescription_service.dto.*;
import com.aarogya.prescription_service.service.DrugInteractionService;
import com.aarogya.prescription_service.service.PrescriptionAnalyticsService;
import com.aarogya.prescription_service.service.PrescriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
public class PrescriptionController {

    private final PrescriptionService prescriptionService;
    private final DrugInteractionService drugInteractionService;
    private final PrescriptionAnalyticsService analyticsService;
    private final String doctorId = UserContextHolder.getUserDetails().getUserId();

    @PostMapping("/appointments/{appointmentId}")
    public ResponseEntity<PrescriptionDTO> createPrescription(
            @PathVariable String appointmentId,
            @Valid @RequestBody CreatePrescriptionDTO createPrescriptionDTO) {

        createPrescriptionDTO.setAppointmentId(appointmentId);
        createPrescriptionDTO.setDoctorId(doctorId);

        PrescriptionDTO prescription = prescriptionService.createPrescription(createPrescriptionDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(prescription);
    }

    @PutMapping("/{prescriptionId}")
    public ResponseEntity<PrescriptionDTO> updatePrescription(
            @PathVariable String prescriptionId,
            @Valid @RequestBody UpdatePrescriptionDTO updatePrescriptionDTO) {

        updatePrescriptionDTO.setDoctorId(doctorId);

        PrescriptionDTO prescription = prescriptionService.updatePrescription(prescriptionId, updatePrescriptionDTO);
        return ResponseEntity.ok(prescription);
    }

    @GetMapping("/{prescriptionId}")
    public ResponseEntity<PrescriptionDTO> getPrescription(
            @PathVariable String prescriptionId) {

        PrescriptionDTO prescription = prescriptionService.getPrescriptionById(prescriptionId);
        return ResponseEntity.ok(prescription);
    }

    @GetMapping("/appointments/{appointmentId}")
    public ResponseEntity<List<PrescriptionDTO>> getPrescriptionsByAppointment(
            @PathVariable String appointmentId) {

        List<PrescriptionDTO> prescriptions = prescriptionService.getPrescriptionsByAppointment(appointmentId);
        return ResponseEntity.ok(prescriptions);
    }

    @GetMapping("/doctors/{doctorId}")
    public ResponseEntity<Page<PrescriptionDTO>> getDoctorPrescriptions(
            @PathVariable String doctorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        Page<PrescriptionDTO> prescriptions = prescriptionService.getDoctorPrescriptions(doctorId, pageRequest);
        return ResponseEntity.ok(prescriptions);
    }

    @GetMapping("/patients/{patientId}")
    public ResponseEntity<Page<PrescriptionDTO>> getPatientPrescriptions(
            @PathVariable String patientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<PrescriptionDTO> prescriptions = prescriptionService.getPatientPrescriptions(patientId, pageRequest);
        return ResponseEntity.ok(prescriptions);
    }

    @GetMapping("/doctors/{doctorId}/patients/{patientId}")
    public ResponseEntity<List<PrescriptionDTO>> getDoctorPatientPrescriptions(
            @PathVariable String doctorId,
            @PathVariable String patientId) {

        List<PrescriptionDTO> prescriptions = prescriptionService.getDoctorPatientPrescriptions(doctorId, patientId);
        return ResponseEntity.ok(prescriptions);
    }

    @DeleteMapping("/{prescriptionId}")
    public ResponseEntity<Void> deletePrescription(
            @PathVariable String prescriptionId) {

        prescriptionService.deletePrescription(prescriptionId, doctorId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{prescriptionId}/duplicate")
    public ResponseEntity<PrescriptionDTO> duplicatePrescription(
            @PathVariable String prescriptionId,
            @RequestParam String appointmentId) {

        PrescriptionDTO prescription = prescriptionService.duplicatePrescription(prescriptionId, appointmentId);
        return ResponseEntity.status(HttpStatus.CREATED).body(prescription);
    }

    @PostMapping("/{prescriptionId}/refill")
    public ResponseEntity<PrescriptionDTO> refillPrescription(
            @PathVariable String prescriptionId,
            @RequestParam String pharmacyId) {

        PrescriptionDTO prescription = prescriptionService.refillPrescription(prescriptionId, pharmacyId);
        return ResponseEntity.ok(prescription);
    }

    @PostMapping("/{prescriptionId}/send-to-pharmacy")
    public ResponseEntity<Void> sendToPharmacy(
            @PathVariable String prescriptionId,
            @RequestParam String pharmacyId) {

        prescriptionService.sendPrescriptionToPharmacy(prescriptionId, pharmacyId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{prescriptionId}/mark-dispensed")
    public ResponseEntity<Void> markAsDispensed(
            @PathVariable String prescriptionId,
            @RequestParam String pharmacyId) {

        prescriptionService.markPrescriptionAsDispensed(prescriptionId, pharmacyId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<PrescriptionDTO>> searchPrescriptions(
            @RequestParam String query) {

        List<PrescriptionDTO> prescriptions = prescriptionService.searchPrescriptions(query, doctorId);
        return ResponseEntity.ok(prescriptions);
    }

    @GetMapping("/expired")
    public ResponseEntity<List<PrescriptionDTO>> getExpiredPrescriptions() {
        List<PrescriptionDTO> prescriptions = prescriptionService.getExpiredPrescriptions();
        return ResponseEntity.ok(prescriptions);
    }

    @GetMapping("/follow-up-due")
    public ResponseEntity<List<PrescriptionDTO>> getPrescriptionsWithFollowUpDue(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        List<PrescriptionDTO> prescriptions = prescriptionService.getPrescriptionsWithFollowUpDue(startDate, endDate);
        return ResponseEntity.ok(prescriptions);
    }

    @GetMapping("/patients/{patientId}/refills")
    public ResponseEntity<List<PrescriptionDTO>> getPrescriptionsForRefill(
            @PathVariable String patientId) {

        List<PrescriptionDTO> prescriptions = prescriptionService.getPrescriptionsForRefill(patientId);
        return ResponseEntity.ok(prescriptions);
    }

    @GetMapping("/doctors/{doctorId}/summary")
    public ResponseEntity<PrescriptionSummaryDTO> getPrescriptionSummary(
            @PathVariable String doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        PrescriptionSummaryDTO summary = prescriptionService.getPrescriptionSummary(doctorId, startDate, endDate);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/doctors/{doctorId}/analytics")
    public ResponseEntity<PrescriptionAnalyticsDTO> getPrescriptionAnalytics(
            @PathVariable String doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        PrescriptionAnalyticsDTO analytics = analyticsService.getDoctorPrescriptionAnalytics(doctorId, startDate, endDate);
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/doctors/{doctorId}/top-medicines")
    public ResponseEntity<Map<String, Integer>> getTopPrescribedMedicines(
            @PathVariable String doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "10") int limit) {

        Map<String, Integer> topMedicines = analyticsService.getTopPrescribedMedicines(doctorId, startDate, endDate, limit);
        return ResponseEntity.ok(topMedicines);
    }

    @PostMapping("/check-interactions")
    public ResponseEntity<List<DrugInteractionDTO>> checkDrugInteractions(
            @RequestParam String patientId,
            @RequestBody List<PrescriptionMedicineDTO> medicines) {

        List<DrugInteractionDTO> interactions = drugInteractionService.checkDrugInteractions(patientId, medicines);
        return ResponseEntity.ok(interactions);
    }

    @GetMapping("/patients/{patientId}/interactions")
    public ResponseEntity<List<DrugInteractionDTO>> getPatientDrugInteractions(
            @PathVariable String patientId) {

        List<DrugInteractionDTO> interactions = drugInteractionService.getPatientDrugInteractions(patientId);
        return ResponseEntity.ok(interactions);
    }

    @PostMapping("/interactions/{interactionId}/resolve")
    public ResponseEntity<DrugInteractionDTO> resolveInteraction(
            @PathVariable String interactionId,
            @RequestParam String resolution) {

        DrugInteractionDTO interaction = drugInteractionService.resolveInteraction(interactionId, resolution, doctorId);
        return ResponseEntity.ok(interaction);
    }
}
