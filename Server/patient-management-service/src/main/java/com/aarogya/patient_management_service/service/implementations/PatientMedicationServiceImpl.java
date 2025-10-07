package com.aarogya.patient_management_service.service.implementations;

import com.aarogya.patient_management_service.annotations.EvictPatientCaches;
import com.aarogya.patient_management_service.dto.request.CreateMedicationRequest;
import com.aarogya.patient_management_service.dto.request.UpdateMedicationRequest;
import com.aarogya.patient_management_service.dto.response.PatientMedicationResponse;
import com.aarogya.patient_management_service.exceptions.ResourceNotFoundException;
import com.aarogya.patient_management_service.exceptions.ServiceException;
import com.aarogya.patient_management_service.model.PatientMedication;
import com.aarogya.patient_management_service.repository.PatientMedicationRepository;
import com.aarogya.patient_management_service.service.PatientMedicationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class PatientMedicationServiceImpl implements PatientMedicationService {

    private static final String MEDICATION_NOT_FOUND = "Medication not found with ID: %s for patient: %s";
    private static final String DEFAULT_STATUS = "ACTIVE";
    private static final List<String> VALID_STATUSES = Arrays.asList("ACTIVE", "COMPLETED", "DISCONTINUED", "PAUSED");

    private final PatientMedicationRepository medicationRepository;
    private final ModelMapper modelMapper;

    @Override
    @EvictPatientCaches
    public PatientMedicationResponse addMedication(String patientId, CreateMedicationRequest request) {
        try {
            log.info("Adding medication for patient: {}", patientId);
            validatePatientId(patientId);
            validateCreateRequest(request);

            PatientMedication medication = modelMapper.map(request, PatientMedication.class);
            medication.setPatientId(patientId);
            medication.setStatus(request.getStatus() != null ? request.getStatus().toUpperCase() : DEFAULT_STATUS);
            medication.setReminderEnabled(request.isReminderEnabled());
            medication.setCreatedAt(LocalDateTime.now());
            medication.setUpdatedAt(LocalDateTime.now());

            PatientMedication savedMedication = medicationRepository.save(medication);
            log.info("Medication added successfully with ID: {}", savedMedication.getId());

            return convertToResponse(savedMedication);

        } catch (DataAccessException e) {
            log.error("Database error while adding medication for patient: {}", patientId, e);
            throw new ServiceException("Failed to add medication due to database error", e);
        } catch (IllegalArgumentException e) {
            log.error("Validation error while adding medication for patient: {}", patientId, e);
            throw new ServiceException("Invalid medication data: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error while adding medication for patient: {}", patientId, e);
            throw new ServiceException("Failed to add medication", e);
        }
    }

    @Override
    @Cacheable(value = "patientMedications", key = "#patientId + '_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<PatientMedicationResponse> getPatientMedications(String patientId, Pageable pageable) {
        try {
            log.info("Fetching medications for patient: {}", patientId);
            validatePatientId(patientId);

            Page<PatientMedication> medications = medicationRepository.findByPatientIdOrderByCreatedAtDesc(patientId, pageable);
            return medications.map(this::convertToResponse);

        } catch (DataAccessException e) {
            log.error("Database error while fetching medications for patient: {}", patientId, e);
            throw new ServiceException("Failed to fetch medications due to database error", e);
        }
    }

    @Override
    @Cacheable(value = "activeMedications", key = "#patientId")
    public List<PatientMedicationResponse> getActiveMedications(String patientId) {
        try {
            log.info("Fetching active medications for patient: {}", patientId);
            validatePatientId(patientId);

            List<PatientMedication> medications = medicationRepository.findByPatientIdAndStatus(patientId, "ACTIVE");
            return medications.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());

        } catch (DataAccessException e) {
            log.error("Database error while fetching active medications for patient: {}", patientId, e);
            throw new ServiceException("Failed to fetch active medications due to database error", e);
        }
    }

    @Override
    public PatientMedicationResponse getMedicationById(String patientId, String medicationId) {
        try {
            log.info("Fetching medication {} for patient: {}", medicationId, patientId);
            validatePatientId(patientId);

            PatientMedication medication = getMedicationForPatient(medicationId, patientId);
            return convertToResponse(medication);

        } catch (DataAccessException e) {
            log.error("Database error while fetching medication {} for patient: {}", medicationId, patientId, e);
            throw new ServiceException("Failed to fetch medication due to database error", e);
        }
    }

    @Override
    @EvictPatientCaches
    public PatientMedicationResponse updateMedication(String patientId, String medicationId, UpdateMedicationRequest request) {
        try {
            log.info("Updating medication {} for patient: {}", medicationId, patientId);
            validatePatientId(patientId);
            validateUpdateRequest(request);

            PatientMedication medication = getMedicationForPatient(medicationId, patientId);

            updateMedicationFields(medication, request, false);
            medication.setUpdatedAt(LocalDateTime.now());

            PatientMedication savedMedication = medicationRepository.save(medication);
            log.info("Medication {} updated successfully", medicationId);

            return convertToResponse(savedMedication);

        } catch (DataAccessException e) {
            log.error("Database error while updating medication {} for patient: {}", medicationId, patientId, e);
            throw new ServiceException("Failed to update medication due to database error", e);
        } catch (IllegalArgumentException e) {
            log.error("Validation error while updating medication {} for patient: {}", medicationId, patientId, e);
            throw new ServiceException("Invalid medication data: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error while updating medication {} for patient: {}", medicationId, patientId, e);
            throw new ServiceException("Failed to update medication", e);
        }
    }

    @Override
    @EvictPatientCaches
    public PatientMedicationResponse partialUpdateMedication(String patientId, String medicationId, UpdateMedicationRequest request) {
        try {
            log.info("Partially updating medication {} for patient: {}", medicationId, patientId);
            validatePatientId(patientId);

            PatientMedication medication = getMedicationForPatient(medicationId, patientId);

            updateMedicationFields(medication, request, true);
            medication.setUpdatedAt(LocalDateTime.now());

            PatientMedication savedMedication = medicationRepository.save(medication);
            log.info("Medication {} partially updated successfully", medicationId);

            return convertToResponse(savedMedication);

        } catch (DataAccessException e) {
            log.error("Database error while partially updating medication {} for patient: {}", medicationId, patientId, e);
            throw new ServiceException("Failed to partially update medication due to database error", e);
        } catch (Exception e) {
            log.error("Unexpected error while partially updating medication {} for patient: {}", medicationId, patientId, e);
            throw new ServiceException("Failed to partially update medication", e);
        }
    }

    @Override
    @EvictPatientCaches
    public PatientMedicationResponse updateMedicationStatus(String patientId, String medicationId, String status) {
        try {
            log.info("Updating medication status {} for patient: {}", medicationId, patientId);
            validatePatientId(patientId);

            if (status == null || status.trim().isEmpty()) {
                throw new IllegalArgumentException("Status cannot be null or empty");
            }

            String normalizedStatus = status.toUpperCase();
            if (!VALID_STATUSES.contains(normalizedStatus)) {
                throw new IllegalArgumentException("Status must be ACTIVE, COMPLETED, DISCONTINUED, or PAUSED");
            }

            PatientMedication medication = getMedicationForPatient(medicationId, patientId);

            medication.setStatus(normalizedStatus);
            medication.setUpdatedAt(LocalDateTime.now());

            PatientMedication savedMedication = medicationRepository.save(medication);
            log.info("Medication {} status updated to {}", medicationId, normalizedStatus);

            return convertToResponse(savedMedication);

        } catch (DataAccessException e) {
            log.error("Database error while updating medication status {} for patient: {}", medicationId, patientId, e);
            throw new ServiceException("Failed to update medication status due to database error", e);
        } catch (IllegalArgumentException e) {
            log.error("Validation error while updating medication status {} for patient: {}", medicationId, patientId, e);
            throw new ServiceException("Invalid status: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error while updating medication status {} for patient: {}", medicationId, patientId, e);
            throw new ServiceException("Failed to update medication status", e);
        }
    }

    @Override
    @EvictPatientCaches
    public void deleteMedication(String patientId, String medicationId) {
        try {
            log.info("Deleting medication {} for patient: {}", medicationId, patientId);
            validatePatientId(patientId);

            if (!medicationRepository.existsByIdAndPatientId(medicationId, patientId)) {
                throw new ResourceNotFoundException(String.format(MEDICATION_NOT_FOUND, medicationId, patientId));
            }

            medicationRepository.deleteById(medicationId);
            log.info("Medication {} deleted successfully", medicationId);

        } catch (DataAccessException e) {
            log.error("Database error while deleting medication {} for patient: {}", medicationId, patientId, e);
            throw new ServiceException("Failed to delete medication due to database error", e);
        }
    }

    private PatientMedication getMedicationForPatient(String medicationId, String patientId) {
        return medicationRepository.findByIdAndPatientId(medicationId, patientId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(MEDICATION_NOT_FOUND, medicationId, patientId)));
    }

    private PatientMedicationResponse convertToResponse(PatientMedication medication) {
        return modelMapper.map(medication, PatientMedicationResponse.class);
    }

    private void validatePatientId(String patientId) {
        if (patientId == null || patientId.trim().isEmpty()) {
            throw new IllegalArgumentException("Patient ID is required");
        }
    }

    private void validateCreateRequest(CreateMedicationRequest request) {
        if (request.getMedicationName() == null || request.getMedicationName().trim().isEmpty()) {
            throw new IllegalArgumentException("Medication name is required");
        }
        if (request.getDosage() == null || request.getDosage().trim().isEmpty()) {
            throw new IllegalArgumentException("Dosage is required");
        }
        if (request.getFrequency() == null || request.getFrequency().trim().isEmpty()) {
            throw new IllegalArgumentException("Frequency is required");
        }
        if (request.getStartDate() == null) {
            throw new IllegalArgumentException("Start date is required");
        }
    }

    private void validateUpdateRequest(UpdateMedicationRequest request) {
        if (request.getMedicationName() != null && request.getMedicationName().trim().isEmpty()) {
            throw new IllegalArgumentException("Medication name cannot be empty");
        }
        if (request.getDosage() != null && request.getDosage().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Dosage must be greater than 0");
        }
        if (request.getFrequency() != null && request.getFrequency().trim().isEmpty()) {
            throw new IllegalArgumentException("Frequency cannot be empty");
        }
        if (request.getStatus() != null && !VALID_STATUSES.contains(request.getStatus().toUpperCase())) {
            throw new IllegalArgumentException("Status must be ACTIVE, COMPLETED, DISCONTINUED, or PAUSED");
        }
    }

    private void updateMedicationFields(PatientMedication medication, UpdateMedicationRequest request, boolean isPartial) {
        if (!isPartial || request.getMedicationName() != null) {
            medication.setMedicationName(request.getMedicationName());
        }
        if (!isPartial || request.getDosage() != null) {
            medication.setDosage(request.getDosage());
        }
        if (!isPartial || request.getDosageUnit() != null) {
            medication.setDosageUnit(request.getDosageUnit());
        }
        if (!isPartial || request.getFrequency() != null) {
            medication.setFrequency(request.getFrequency());
        }
        if (!isPartial || request.getRoute() != null) {
            medication.setRoute(request.getRoute());
        }
        if (!isPartial || request.getStartDate() != null) {
            medication.setStartDate(request.getStartDate());
        }
        if (!isPartial || request.getEndDate() != null) {
            medication.setEndDate(request.getEndDate());
        }
        if (!isPartial || request.getStatus() != null) {
            medication.setStatus(request.getStatus().toUpperCase());
        }
        if (!isPartial || request.getPrescribedBy() != null) {
            medication.setPrescribedBy(request.getPrescribedBy());
        }
        if (!isPartial || request.getReason() != null) {
            medication.setReason(request.getReason());
        }
        if (!isPartial || request.getInstructions() != null) {
            medication.setInstructions(request.getInstructions());
        }
        if (!isPartial || request.getSideEffects() != null) {
            medication.setSideEffects(request.getSideEffects());
        }
        if (!isPartial || request.getNotes() != null) {
            medication.setNotes(request.getNotes());
        }
        if (!isPartial || request.getReminderEnabled() != null) {
            medication.setReminderEnabled(request.getReminderEnabled());
        }
    }
}
