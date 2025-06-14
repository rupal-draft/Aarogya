package com.aarogya.prescription_service.controller;

import com.aarogya.prescription_service.auth.UserContextHolder;
import com.aarogya.prescription_service.dto.DrugInteractionDTO;
import com.aarogya.prescription_service.dto.PrescriptionMedicineDTO;
import com.aarogya.prescription_service.service.DrugInteractionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/drug-interactions")
@RequiredArgsConstructor
public class DrugInteractionController {

    private final DrugInteractionService drugInteractionService;
    private final String doctorId = UserContextHolder.getUserDetails().getUserId();

    @PostMapping("/check")
    public ResponseEntity<List<DrugInteractionDTO>> checkDrugInteractions(
            @RequestParam String patientId,
            @RequestBody List<PrescriptionMedicineDTO> medicines) {

        List<DrugInteractionDTO> interactions = drugInteractionService.checkDrugInteractions(patientId, medicines);
        return ResponseEntity.ok(interactions);
    }

    @PostMapping("/check-with-existing")
    public ResponseEntity<List<DrugInteractionDTO>> checkDrugInteractionsWithExisting(
            @RequestParam String patientId,
            @RequestBody List<PrescriptionMedicineDTO> newMedicines) {

        List<DrugInteractionDTO> interactions = drugInteractionService.checkDrugInteractionsWithExisting(patientId, newMedicines);
        return ResponseEntity.ok(interactions);
    }

    @GetMapping("/specific")
    public ResponseEntity<DrugInteractionDTO> checkSpecificInteraction(
            @RequestParam String drug1,
            @RequestParam String drug2) {

        DrugInteractionDTO interaction = drugInteractionService.checkSpecificInteraction(drug1, drug2);
        return ResponseEntity.ok(interaction);
    }

    @GetMapping("/patients/{patientId}")
    public ResponseEntity<List<DrugInteractionDTO>> getPatientDrugInteractions(
            @PathVariable String patientId) {

        List<DrugInteractionDTO> interactions = drugInteractionService.getPatientDrugInteractions(patientId);
        return ResponseEntity.ok(interactions);
    }

    @GetMapping("/patients/{patientId}/critical")
    public ResponseEntity<List<DrugInteractionDTO>> getCriticalInteractions(
            @PathVariable String patientId) {

        List<DrugInteractionDTO> interactions = drugInteractionService.getCriticalInteractions(patientId);
        return ResponseEntity.ok(interactions);
    }

    @PostMapping("/{interactionId}/resolve")
    public ResponseEntity<DrugInteractionDTO> resolveInteraction(
            @PathVariable String interactionId,
            @RequestParam String resolution) {

        DrugInteractionDTO interaction = drugInteractionService.resolveInteraction(interactionId, resolution, doctorId);
        return ResponseEntity.ok(interaction);
    }

    @PostMapping("/{interactionId}/ignore")
    public ResponseEntity<Void> ignoreInteraction(
            @PathVariable String interactionId,
            @RequestParam String reason) {

        drugInteractionService.ignoreInteraction(interactionId, reason, doctorId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/update-database")
    public ResponseEntity<Void> updateInteractionDatabase() {
        drugInteractionService.updateInteractionDatabase();
        return ResponseEntity.ok().build();
    }
}
