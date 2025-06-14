package com.aarogya.prescription_service.service;

import com.aarogya.prescription_service.dto.DrugInteractionDTO;
import com.aarogya.prescription_service.dto.PrescriptionMedicineDTO;

import java.util.List;

public interface DrugInteractionService {

    List<DrugInteractionDTO> checkDrugInteractions(String patientId, List<PrescriptionMedicineDTO> medicines);

    List<DrugInteractionDTO> checkDrugInteractionsWithExisting(String patientId, List<PrescriptionMedicineDTO> newMedicines);

    DrugInteractionDTO checkSpecificInteraction(String drug1, String drug2);

    List<DrugInteractionDTO> getPatientDrugInteractions(String patientId);

    DrugInteractionDTO resolveInteraction(String interactionId, String resolution, String resolvedBy);

    void ignoreInteraction(String interactionId, String reason, String ignoredBy);

    List<DrugInteractionDTO> getCriticalInteractions(String patientId);

    void updateInteractionDatabase();
}
