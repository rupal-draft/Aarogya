package com.aarogya.patient_management_service.service.implementations;

import com.aarogya.patient_management_service.dto.request.CreateAllergyRequest;
import com.aarogya.patient_management_service.dto.request.UpdateAllergyRequest;
import com.aarogya.patient_management_service.dto.response.PatientAllergyResponse;
import com.aarogya.patient_management_service.exceptions.ResourceNotFoundException;
import com.aarogya.patient_management_service.exceptions.ServiceException;
import com.aarogya.patient_management_service.model.PatientAllergy;
import com.aarogya.patient_management_service.repository.PatientAllergyRepository;
import com.aarogya.patient_management_service.service.PatientAllergyService;
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

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class PatientAllergyServiceImpl implements PatientAllergyService {

    private static final String ALLERGY_NOT_FOUND = "Allergy not found with ID: %s for patient: %s";
    private static final String EMERGENCY_ACTION = "Seek immediate medical attention. Administer epinephrine if available.";
    private static final List<String> CRITICAL_SEVERITIES = Arrays.asList("SEVERE", "CRITICAL");
    private static final List<String> VALID_SEVERITIES = Arrays.asList("MILD", "MODERATE", "SEVERE", "CRITICAL");

    private final PatientAllergyRepository allergyRepository;
    private final ModelMapper modelMapper;

    @Override
    @CacheEvict(value = {"patientAllergies", "criticalAllergies"}, key = "#patientId")
    public PatientAllergyResponse addAllergy(String patientId, CreateAllergyRequest request) {
        try {
            log.info("Adding allergy for patient: {}", patientId);
            validatePatientId(patientId);
            validateCreateRequest(request);

            PatientAllergy allergy = modelMapper.map(request, PatientAllergy.class);
            allergy.setPatientId(patientId);
            allergy.setSeverity(request.getSeverity().toUpperCase());
            allergy.setDiagnosedDate(request.getDiagnosedDate());
            allergy.setIsActive(request.isActive());
            allergy.setCreatedAt(LocalDateTime.now());
            allergy.setUpdatedAt(LocalDateTime.now());

            setEmergencyActionForCriticalSeverity(allergy);

            PatientAllergy savedAllergy = allergyRepository.save(allergy);
            log.info("Allergy added successfully with ID: {}", savedAllergy.getId());

            return convertToResponse(savedAllergy);

        } catch (DataAccessException e) {
            log.error("Database error while adding allergy for patient: {}", patientId, e);
            throw new ServiceException("Failed to add allergy due to database error", e);
        } catch (IllegalArgumentException e) {
            log.error("Validation error while adding allergy for patient: {}", patientId, e);
            throw new ServiceException("Invalid allergy data: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error while adding allergy for patient: {}", patientId, e);
            throw new ServiceException("Failed to add allergy", e);
        }
    }

    @Override
    @Cacheable(value = "patientAllergies", key = "#patientId + '_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<PatientAllergyResponse> getPatientAllergies(String patientId, Pageable pageable) {
        try {
            log.info("Fetching allergies for patient: {}", patientId);
            validatePatientId(patientId);

            Page<PatientAllergy> allergiesPage = allergyRepository.findByPatientIdOrderByDiagnosedDateDesc(patientId, pageable);
            return allergiesPage.map(this::convertToResponse);

        } catch (DataAccessException e) {
            log.error("Database error while fetching allergies for patient: {}", patientId, e);
            throw new ServiceException("Failed to fetch allergies due to database error", e);
        }
    }

    @Override
    @Cacheable(value = "criticalAllergies", key = "#patientId")
    public List<PatientAllergyResponse> getCriticalAllergies(String patientId) {
        try {
            log.info("Fetching critical allergies for patient: {}", patientId);
            validatePatientId(patientId);

            List<PatientAllergy> criticalAllergies = allergyRepository.findByPatientIdAndSeverityIn(patientId, CRITICAL_SEVERITIES);

            return criticalAllergies.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());

        } catch (DataAccessException e) {
            log.error("Database error while fetching critical allergies for patient: {}", patientId, e);
            throw new ServiceException("Failed to fetch critical allergies due to database error", e);
        }
    }

    @Override
    public PatientAllergyResponse getAllergyById(String patientId, String allergyId) {
        try {
            log.info("Fetching allergy by ID: {} for patient: {}", allergyId, patientId);
            validatePatientId(patientId);

            PatientAllergy allergy = getAllergyForPatient(allergyId, patientId);
            return convertToResponse(allergy);

        } catch (DataAccessException e) {
            log.error("Database error while fetching allergy {} for patient: {}", allergyId, patientId, e);
            throw new ServiceException("Failed to fetch allergy due to database error", e);
        }
    }

    @Override
    @CacheEvict(value = {"patientAllergies", "criticalAllergies"}, key = "#patientId")
    public PatientAllergyResponse updateAllergy(String patientId, String allergyId, UpdateAllergyRequest request) {
        try {
            log.info("Updating allergy: {} for patient: {}", allergyId, patientId);
            validatePatientId(patientId);
            validateUpdateRequest(request);

            PatientAllergy existingAllergy = getAllergyForPatient(allergyId, patientId);

            modelMapper.map(request, existingAllergy);
            if (request.getSeverity() != null) {
                existingAllergy.setSeverity(request.getSeverity().toUpperCase());
            }
            existingAllergy.setUpdatedAt(LocalDateTime.now());

            setEmergencyActionForCriticalSeverity(existingAllergy);

            PatientAllergy updatedAllergy = allergyRepository.save(existingAllergy);
            log.info("Allergy {} updated successfully", allergyId);

            return convertToResponse(updatedAllergy);

        } catch (DataAccessException e) {
            log.error("Database error while updating allergy {} for patient: {}", allergyId, patientId, e);
            throw new ServiceException("Failed to update allergy due to database error", e);
        } catch (IllegalArgumentException e) {
            log.error("Validation error while updating allergy {} for patient: {}", allergyId, patientId, e);
            throw new ServiceException("Invalid allergy data: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error while updating allergy {} for patient: {}", allergyId, patientId, e);
            throw new ServiceException("Failed to update allergy", e);
        }
    }

    @Override
    @CacheEvict(value = {"patientAllergies", "criticalAllergies"}, key = "#patientId")
    public PatientAllergyResponse partialUpdateAllergy(String patientId, String allergyId, UpdateAllergyRequest request) {
        try {
            log.info("Partially updating allergy: {} for patient: {}", allergyId, patientId);
            validatePatientId(patientId);

            PatientAllergy existingAllergy = getAllergyForPatient(allergyId, patientId);

            updateNonNullFields(request, existingAllergy);
            existingAllergy.setUpdatedAt(LocalDateTime.now());

            setEmergencyActionForCriticalSeverity(existingAllergy);

            PatientAllergy updatedAllergy = allergyRepository.save(existingAllergy);
            log.info("Allergy {} partially updated successfully", allergyId);

            return convertToResponse(updatedAllergy);

        } catch (DataAccessException e) {
            log.error("Database error while partially updating allergy {} for patient: {}", allergyId, patientId, e);
            throw new ServiceException("Failed to partially update allergy due to database error", e);
        } catch (Exception e) {
            log.error("Unexpected error while partially updating allergy {} for patient: {}", allergyId, patientId, e);
            throw new ServiceException("Failed to partially update allergy", e);
        }
    }

    @Override
    @CacheEvict(value = {"patientAllergies", "criticalAllergies"}, key = "#patientId")
    public PatientAllergyResponse updateAllergySeverity(String patientId, String allergyId, String severity) {
        try {
            log.info("Updating allergy severity: {} for patient: {} to: {}", allergyId, patientId, severity);
            validatePatientId(patientId);

            if (severity == null || severity.trim().isEmpty()) {
                throw new IllegalArgumentException("Severity cannot be null or empty");
            }

            String normalizedSeverity = severity.toUpperCase();
            if (!VALID_SEVERITIES.contains(normalizedSeverity)) {
                throw new IllegalArgumentException("Severity must be MILD, MODERATE, SEVERE, or CRITICAL");
            }

            PatientAllergy existingAllergy = getAllergyForPatient(allergyId, patientId);

            existingAllergy.setSeverity(normalizedSeverity);
            existingAllergy.setUpdatedAt(LocalDateTime.now());

            setEmergencyActionForCriticalSeverity(existingAllergy);

            PatientAllergy updatedAllergy = allergyRepository.save(existingAllergy);
            log.info("Allergy {} severity updated to {}", allergyId, normalizedSeverity);

            return convertToResponse(updatedAllergy);

        } catch (DataAccessException e) {
            log.error("Database error while updating allergy severity {} for patient: {}", allergyId, patientId, e);
            throw new ServiceException("Failed to update allergy severity due to database error", e);
        } catch (IllegalArgumentException e) {
            log.error("Validation error while updating allergy severity {} for patient: {}", allergyId, patientId, e);
            throw new ServiceException("Invalid severity: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error while updating allergy severity {} for patient: {}", allergyId, patientId, e);
            throw new ServiceException("Failed to update allergy severity", e);
        }
    }

    @Override
    @CacheEvict(value = {"patientAllergies", "criticalAllergies"}, key = "#patientId")
    public void deleteAllergy(String patientId, String allergyId) {
        try {
            log.info("Deleting allergy: {} for patient: {}", allergyId, patientId);
            validatePatientId(patientId);

            if (!allergyRepository.existsByIdAndPatientId(allergyId, patientId)) {
                throw new ResourceNotFoundException(String.format(ALLERGY_NOT_FOUND, allergyId, patientId));
            }

            allergyRepository.deleteById(allergyId);
            log.info("Allergy {} deleted successfully", allergyId);

        } catch (DataAccessException e) {
            log.error("Database error while deleting allergy {} for patient: {}", allergyId, patientId, e);
            throw new ServiceException("Failed to delete allergy due to database error", e);
        }
    }

    private PatientAllergy getAllergyForPatient(String allergyId, String patientId) {
        return allergyRepository.findByIdAndPatientId(allergyId, patientId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(ALLERGY_NOT_FOUND, allergyId, patientId)));
    }

    private PatientAllergyResponse convertToResponse(PatientAllergy allergy) {

        return modelMapper.map(allergy, PatientAllergyResponse.class);
    }

    private void validatePatientId(String patientId) {
        if (patientId == null || patientId.trim().isEmpty()) {
            throw new IllegalArgumentException("Patient ID is required");
        }
    }

    private void validateCreateRequest(CreateAllergyRequest request) {
        if (request.getAllergen() == null || request.getAllergen().trim().isEmpty()) {
            throw new IllegalArgumentException("Allergen is required");
        }
        if (request.getSeverity() == null || request.getSeverity().trim().isEmpty()) {
            throw new IllegalArgumentException("Severity is required");
        }
        if (!VALID_SEVERITIES.contains(request.getSeverity().toUpperCase())) {
            throw new IllegalArgumentException("Severity must be MILD, MODERATE, SEVERE, or CRITICAL");
        }
        if (request.getDiagnosedDate() == null) {
            throw new IllegalArgumentException("Diagnosed date is required");
        }
    }

    private void validateUpdateRequest(UpdateAllergyRequest request) {
        if (request.getAllergen() != null && request.getAllergen().trim().isEmpty()) {
            throw new IllegalArgumentException("Allergen cannot be empty");
        }
        if (request.getSeverity() != null) {
            if (request.getSeverity().trim().isEmpty()) {
                throw new IllegalArgumentException("Severity cannot be empty");
            }
            if (!VALID_SEVERITIES.contains(request.getSeverity().toUpperCase())) {
                throw new IllegalArgumentException("Severity must be MILD, MODERATE, SEVERE, or CRITICAL");
            }
        }
    }

    private void setEmergencyActionForCriticalSeverity(PatientAllergy allergy) {
        if (CRITICAL_SEVERITIES.contains(allergy.getSeverity().toUpperCase())) {
            if (allergy.getEmergencyAction() == null || allergy.getEmergencyAction().trim().isEmpty()) {
                allergy.setEmergencyAction(EMERGENCY_ACTION);
            }
        }
    }

    private void updateNonNullFields(UpdateAllergyRequest request, PatientAllergy existingAllergy) {
        if (request.getAllergen() != null) {
            existingAllergy.setAllergen(request.getAllergen().trim());
        }
        if (request.getAllergyType() != null) {
            existingAllergy.setAllergyType(request.getAllergyType().trim());
        }
        if (request.getSeverity() != null) {
            existingAllergy.setSeverity(request.getSeverity().toUpperCase().trim());
            setEmergencyActionForCriticalSeverity(existingAllergy);
        }
        if (request.getSymptoms() != null) {
            existingAllergy.setSymptoms(request.getSymptoms());
        }
        if (request.getReaction() != null) {
            existingAllergy.setReaction(request.getReaction().trim());
        }
        if (request.getNotes() != null) {
            existingAllergy.setNotes(request.getNotes().trim());
        }
        if (request.getEmergencyAction() != null) {
            existingAllergy.setEmergencyAction(request.getEmergencyAction().trim());
        }
        if (request.getDiagnosedDate() != null) {
            existingAllergy.setDiagnosedDate(request.getDiagnosedDate());
        }
        if (request.getDiagnosedBy() != null) {
            existingAllergy.setDiagnosedBy(request.getDiagnosedBy().trim());
        }
        if (request.getIsActive() != null) {
            existingAllergy.setIsActive(request.getIsActive());
        }
    }
}
