package com.aarogya.patient_management_service.service.implementations;

import com.aarogya.patient_management_service.dto.request.CreateMedicalHistoryRequest;
import com.aarogya.patient_management_service.dto.response.MedicalHistoryResponse;
import com.aarogya.patient_management_service.exceptions.ResourceNotFoundException;
import com.aarogya.patient_management_service.exceptions.ServiceException;
import com.aarogya.patient_management_service.model.MedicalHistory;
import com.aarogya.patient_management_service.repository.MedicalHistoryRepository;
import com.aarogya.patient_management_service.service.MedicalHistoryService;
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
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class MedicalHistoryServiceImpl implements MedicalHistoryService {

    private static final String MEDICAL_HISTORY_NOT_FOUND = "Medical history not found with ID: %s for patient: %s";
    private static final String DEFAULT_STATUS = "Active";
    private static final String DEFAULT_SEVERITY = "Moderate";
    private static final String DEFAULT_CATEGORY = "General";

    private final MedicalHistoryRepository medicalHistoryRepository;
    private final ModelMapper modelMapper;

    @Override
    @Cacheable(value = "medicalHistory", key = "#patientId + '_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<MedicalHistoryResponse> getPatientMedicalHistory(String patientId, Pageable pageable) {
        try {
            log.info("Fetching medical history for patient: {}", patientId);
            validatePatientId(patientId);

            return medicalHistoryRepository.findByPatientIdOrderByDiagnosisDateDesc(patientId, pageable)
                    .map(history -> modelMapper.map(history, MedicalHistoryResponse.class));

        } catch (DataAccessException e) {
            log.error("Database error while fetching medical history for patient: {}", patientId, e);
            throw new ServiceException("Failed to fetch medical history due to database error", e);
        }
    }

    @Override
    @Cacheable(value = "activeMedicalHistory", key = "#patientId")
    public List<MedicalHistoryResponse> getActiveMedicalHistory(String patientId) {
        try {
            log.info("Fetching active medical history for patient: {}", patientId);
            validatePatientId(patientId);

            return medicalHistoryRepository.findByPatientIdAndActiveTrue(patientId)
                    .stream()
                    .map(history -> modelMapper.map(history, MedicalHistoryResponse.class))
                    .collect(Collectors.toList());

        } catch (DataAccessException e) {
            log.error("Database error while fetching active medical history for patient: {}", patientId, e);
            throw new ServiceException("Failed to fetch active medical history due to database error", e);
        }
    }

    @Override
    @CacheEvict(value = {"medicalHistory", "activeMedicalHistory", "patientDashboard"}, allEntries = true)
    public MedicalHistoryResponse addMedicalHistory(String patientId, CreateMedicalHistoryRequest request) {
        try {
            log.info("Adding medical history for patient: {}", patientId);
            validatePatientId(patientId);
            validateCreateRequest(request);

            MedicalHistory history = MedicalHistory.builder()
                    .patientId(patientId)
                    .conditionName(request.getConditionName() != null ? request.getConditionName().trim() : "")
                    .diagnosisDate(request.getDiagnosisDate())
                    .status(request.getStatus() != null ? request.getStatus().trim() : DEFAULT_STATUS)
                    .notes(request.getNotes() != null ? request.getNotes().trim() : "")
                    .severity(request.getSeverity() != null ? request.getSeverity().trim() : DEFAULT_SEVERITY)
                    .category(request.getCategory() != null ? request.getCategory().trim() : DEFAULT_CATEGORY)
                    .isActive(request.isActive())
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            MedicalHistory savedHistory = medicalHistoryRepository.save(history);
            log.info("Medical history added successfully with ID: {}", savedHistory.getId());

            return modelMapper.map(savedHistory, MedicalHistoryResponse.class);

        } catch (DataAccessException e) {
            log.error("Database error while adding medical history for patient: {}", patientId, e);
            throw new ServiceException("Failed to add medical history due to database error", e);
        } catch (IllegalArgumentException e) {
            log.error("Validation error while adding medical history for patient: {}", patientId, e);
            throw new ServiceException("Invalid medical history data: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error while adding medical history for patient: {}", patientId, e);
            throw new ServiceException("Failed to add medical history", e);
        }
    }

    @Override
    @CacheEvict(value = {"medicalHistory", "activeMedicalHistory", "patientDashboard"}, allEntries = true)
    public MedicalHistoryResponse updateMedicalHistory(String patientId, String historyId, CreateMedicalHistoryRequest request) {
        try {
            log.info("Updating medical history {} for patient: {}", historyId, patientId);
            validatePatientId(patientId);
            validateUpdateRequest(request);

            MedicalHistory history = getMedicalHistoryForPatient(historyId, patientId);
            updateMedicalHistoryFields(history, request);
            history.setUpdatedAt(LocalDateTime.now());

            MedicalHistory updatedHistory = medicalHistoryRepository.save(history);
            log.info("Medical history {} updated successfully", historyId);

            return modelMapper.map(updatedHistory, MedicalHistoryResponse.class);

        } catch (DataAccessException e) {
            log.error("Database error while updating medical history {} for patient: {}", historyId, patientId, e);
            throw new ServiceException("Failed to update medical history due to database error", e);
        } catch (IllegalArgumentException e) {
            log.error("Validation error while updating medical history {} for patient: {}", historyId, patientId, e);
            throw new ServiceException("Invalid medical history data: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error while updating medical history {} for patient: {}", historyId, patientId, e);
            throw new ServiceException("Failed to update medical history", e);
        }
    }

    @Override
    @CacheEvict(value = {"medicalHistory", "activeMedicalHistory", "patientDashboard"}, allEntries = true)
    public void deleteMedicalHistory(String patientId, String historyId) {
        try {
            log.info("Deleting medical history {} for patient: {}", historyId, patientId);
            validatePatientId(patientId);

            if (!medicalHistoryRepository.existsByIdAndPatientId(historyId, patientId)) {
                throw new ResourceNotFoundException(String.format(MEDICAL_HISTORY_NOT_FOUND, historyId, patientId));
            }

            medicalHistoryRepository.deleteById(historyId);
            log.info("Medical history {} deleted successfully", historyId);

        } catch (DataAccessException e) {
            log.error("Database error while deleting medical history {} for patient: {}", historyId, patientId, e);
            throw new ServiceException("Failed to delete medical history due to database error", e);
        }
    }

    @Override
    @Cacheable(value = "medicalHistorySearch", key = "#patientId + '_' + #query")
    public List<MedicalHistoryResponse> searchMedicalHistory(String patientId, String query) {
        try {
            log.info("Searching medical history for patient: {} with query: {}", patientId, query);
            validatePatientId(patientId);

            if (query == null || query.trim().isEmpty()) {
                throw new IllegalArgumentException("Search query cannot be empty");
            }

            return medicalHistoryRepository.findByPatientIdAndConditionNameContainingIgnoreCase(patientId, query.trim())
                    .stream()
                    .map(history -> modelMapper.map(history, MedicalHistoryResponse.class))
                    .collect(Collectors.toList());

        } catch (DataAccessException e) {
            log.error("Database error while searching medical history for patient: {} with query: {}", patientId, query, e);
            throw new ServiceException("Failed to search medical history due to database error", e);
        } catch (IllegalArgumentException e) {
            log.error("Validation error while searching medical history for patient: {} with query: {}", patientId, query, e);
            throw new ServiceException("Invalid search query: " + e.getMessage(), e);
        }
    }

    @Override
    public Optional<MedicalHistoryResponse> getMedicalHistoryById(String patientId, String historyId) {
        try {
            log.info("Fetching medical history {} for patient: {}", historyId, patientId);
            validatePatientId(patientId);

            return medicalHistoryRepository.findByIdAndPatientId(historyId, patientId)
                    .map(history -> modelMapper.map(history, MedicalHistoryResponse.class));

        } catch (DataAccessException e) {
            log.error("Database error while fetching medical history {} for patient: {}", historyId, patientId, e);
            throw new ServiceException("Failed to fetch medical history due to database error", e);
        }
    }

    private MedicalHistory getMedicalHistoryForPatient(String historyId, String patientId) {
        return medicalHistoryRepository.findByIdAndPatientId(historyId, patientId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(MEDICAL_HISTORY_NOT_FOUND, historyId, patientId)));
    }

    private void validatePatientId(String patientId) {
        if (patientId == null || patientId.trim().isEmpty()) {
            throw new IllegalArgumentException("Patient ID is required");
        }
    }

    private void validateCreateRequest(CreateMedicalHistoryRequest request) {
        if (request.getConditionName() == null || request.getConditionName().trim().isEmpty()) {
            throw new IllegalArgumentException("Condition name is required");
        }
        if (request.getDiagnosisDate() == null) {
            throw new IllegalArgumentException("Diagnosis date is required");
        }
        if (request.getStatus() != null && request.getStatus().trim().isEmpty()) {
            throw new IllegalArgumentException("Status cannot be empty");
        }
        if (request.getSeverity() != null && isValidSeverity(request.getSeverity())) {
            throw new IllegalArgumentException("Invalid severity value");
        }
    }

    private void validateUpdateRequest(CreateMedicalHistoryRequest request) {
        if (request.getConditionName() != null && request.getConditionName().trim().isEmpty()) {
            throw new IllegalArgumentException("Condition name cannot be empty");
        }
        if (request.getStatus() != null && request.getStatus().trim().isEmpty()) {
            throw new IllegalArgumentException("Status cannot be empty");
        }
        if (request.getSeverity() != null && isValidSeverity(request.getSeverity())) {
            throw new IllegalArgumentException("Invalid severity value");
        }
    }

    private boolean isValidSeverity(String severity) {
        return !Arrays.asList("Mild", "Moderate", "Severe", "Critical").contains(severity);
    }

    private void updateMedicalHistoryFields(MedicalHistory history, CreateMedicalHistoryRequest request) {
        if (request.getConditionName() != null) {
            history.setConditionName(request.getConditionName().trim());
        }
        if (request.getDiagnosisDate() != null) {
            history.setDiagnosisDate(request.getDiagnosisDate());
        }
        if (request.getStatus() != null) {
            history.setStatus(request.getStatus().trim());
        }
        if (request.getNotes() != null) {
            history.setNotes(request.getNotes().trim());
        }
        if (request.getSeverity() != null) {
            history.setSeverity(request.getSeverity().trim());
        }
        if (request.getCategory() != null) {
            history.setCategory(request.getCategory().trim());
        }
        history.setActive(request.isActive());
    }
}