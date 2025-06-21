package com.aarogya.prescription_service.service.implementation;

import com.aarogya.prescription_service.client.DrugInteractionApiClient;
import com.aarogya.prescription_service.dto.DrugInteractionDTO;
import com.aarogya.prescription_service.dto.PrescriptionMedicineDTO;
import com.aarogya.prescription_service.exceptions.ResourceNotFound;
import com.aarogya.prescription_service.model.DrugInteraction;
import com.aarogya.prescription_service.model.Prescription;
import com.aarogya.prescription_service.model.PrescriptionMedicine;
import com.aarogya.prescription_service.model.enums.PrescriptionStatus;
import com.aarogya.prescription_service.repository.DrugInteractionRepository;
import com.aarogya.prescription_service.repository.PrescriptionMedicineRepository;
import com.aarogya.prescription_service.repository.PrescriptionRepository;
import com.aarogya.prescription_service.service.DrugInteractionService;
import com.aarogya.prescription_service.util.RxNavUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Validated
public class DrugInteractionServiceImpl implements DrugInteractionService {

    private final DrugInteractionRepository interactionRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final PrescriptionMedicineRepository medicineRepository;
    private final DrugInteractionApiClient drugInteractionApiClient;
    private final ModelMapper modelMapper;
    private final RxNavUtil rxNavUtil;

    @Override
    @Transactional
    public List<DrugInteractionDTO> checkDrugInteractions(String patientId, List<PrescriptionMedicineDTO> medicines) {
        List<DrugInteractionDTO> interactions = new ArrayList<>();

        for (int i = 0; i < medicines.size(); i++) {
            for (int j = i + 1; j < medicines.size(); j++) {
                PrescriptionMedicineDTO medicine1 = medicines.get(i);
                PrescriptionMedicineDTO medicine2 = medicines.get(j);

                DrugInteractionDTO interaction = checkSpecificInteraction(
                        medicine1.getMedicineName(),
                        medicine2.getMedicineName()
                );

                if (interaction != null) {
                    interaction.setPatientId(patientId);
                    interactions.add(interaction);
                }
            }
        }

        List<DrugInteractionDTO> existingInteractions = checkDrugInteractionsWithExisting(patientId, medicines);
        interactions.addAll(existingInteractions);

        for (DrugInteractionDTO interactionDTO : interactions) {
            if ("MAJOR".equals(interactionDTO.getInteractionType()) || "HIGH".equals(interactionDTO.getSeverity())) {
                DrugInteraction interaction = modelMapper.map(interactionDTO, DrugInteraction.class);
                interaction.setStatus("ACTIVE");
                interactionRepository.save(interaction);
            }
        }

        return interactions;
    }

    @Override
    public List<DrugInteractionDTO> checkDrugInteractionsWithExisting(String patientId, List<PrescriptionMedicineDTO> newMedicines) {
        List<DrugInteractionDTO> interactions = new ArrayList<>();

        List<Prescription> activePrescriptions = prescriptionRepository.findByPatientIdOrderByCreatedAtDesc(patientId, null)
                .getContent()
                .stream()
                .filter(p -> PrescriptionStatus.ACTIVE.equals(p.getStatus()))
                .collect(Collectors.toList());

        List<PrescriptionMedicine> existingMedicines = new ArrayList<>();
        for (Prescription prescription : activePrescriptions) {
            List<PrescriptionMedicine> medicines = medicineRepository.findByPrescriptionId(prescription.getId());
            existingMedicines.addAll(medicines);
        }

        for (PrescriptionMedicineDTO newMedicine : newMedicines) {
            for (PrescriptionMedicine existingMedicine : existingMedicines) {
                DrugInteractionDTO interaction = checkSpecificInteraction(
                        newMedicine.getMedicineName(),
                        existingMedicine.getMedicineName()
                );

                if (interaction != null) {
                    interaction.setPatientId(patientId);
                    interactions.add(interaction);
                }
            }
        }

        return interactions;
    }

    @Override
    @Cacheable(value = "drugInteractions", key = "#drug1 + ':' + #drug2")
    public DrugInteractionDTO checkSpecificInteraction(String drug1, String drug2) {
        try {
            List<DrugInteraction> localInteractions = interactionRepository.findByDrug1AndDrug2(drug1, drug2);
            if (!localInteractions.isEmpty()) {
                return modelMapper.map(localInteractions.get(0), DrugInteractionDTO.class);
            }

            localInteractions = interactionRepository.findByDrug1AndDrug2(drug2, drug1);
            if (!localInteractions.isEmpty()) {
                return modelMapper.map(localInteractions.get(0), DrugInteractionDTO.class);
            }

            String rxCui1 = rxNavUtil.getRxCuiForDrug(drug1);
            String rxCui2 = rxNavUtil.getRxCuiForDrug(drug2);

            if (rxCui1 == null || rxCui2 == null) {
                log.warn("RxCUI not found for one or both drugs: {} [{}], {} [{}]", drug1, rxCui1, drug2, rxCui2);
                return null;
            }

            DrugInteractionDTO externalInteraction = drugInteractionApiClient.checkInteractionByRxCuis(rxCui1, rxCui2);

            if (externalInteraction != null) {
                DrugInteraction interaction = modelMapper.map(externalInteraction, DrugInteraction.class);
                interaction.setDrug1(drug1);
                interaction.setDrug2(drug2);
                interactionRepository.save(interaction);
            }

            return externalInteraction;
        } catch (Exception e) {
            log.error("Error checking drug interaction between {} and {}: {}", drug1, drug2, e.getMessage());
            return null;
        }
    }

    @Override
    @Cacheable(value = "patientInteractions", key = "#patientId")
    public List<DrugInteractionDTO> getPatientDrugInteractions(String patientId) {
        List<DrugInteraction> interactions = interactionRepository.findByPatientIdAndStatus(patientId, "ACTIVE");
        return interactions.stream()
                .map(interaction -> modelMapper.map(interaction, DrugInteractionDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DrugInteractionDTO resolveInteraction(String interactionId, String resolution, String resolvedBy) {
        DrugInteraction interaction = interactionRepository.findById(interactionId)
                .orElseThrow(() -> new ResourceNotFound("Drug Interaction not found with id: " + interactionId));

        interaction.setStatus("RESOLVED");
        interaction.setResolution(resolution);
        interaction.setResolvedBy(resolvedBy);
        interaction.setResolvedAt(LocalDateTime.now());

        DrugInteraction savedInteraction = interactionRepository.save(interaction);
        return modelMapper.map(savedInteraction, DrugInteractionDTO.class);
    }

    @Override
    @Transactional
    public void ignoreInteraction(String interactionId, String reason, String ignoredBy) {
        DrugInteraction interaction = interactionRepository.findById(interactionId)
                .orElseThrow(() -> new ResourceNotFound("Drug Interaction not found with id: " + interactionId));

        interaction.setStatus("IGNORED");
        interaction.setResolution("Ignored: " + reason);
        interaction.setResolvedBy(ignoredBy);
        interaction.setResolvedAt(LocalDateTime.now());

        interactionRepository.save(interaction);
    }

    @Override
    @Cacheable(value = "criticalInteractions", key = "#patientId")
    public List<DrugInteractionDTO> getCriticalInteractions(String patientId) {
        List<DrugInteraction> interactions = interactionRepository.findByPatientIdAndStatusAndSeverity(
                patientId, "ACTIVE", "HIGH");

        return interactions.stream()
                .map(interaction -> modelMapper.map(interaction, DrugInteractionDTO.class))
                .collect(Collectors.toList());
    }
}
