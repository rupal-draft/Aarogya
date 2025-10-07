package com.aarogya.patient_management_service.service.implementations;

import com.aarogya.patient_management_service.annotations.EvictPatientCaches;
import com.aarogya.patient_management_service.dto.request.CreateDiseaseHistoryRequest;
import com.aarogya.patient_management_service.dto.request.UpdateDiseaseHistoryRequest;
import com.aarogya.patient_management_service.dto.response.DiseaseHistoryResponse;
import com.aarogya.patient_management_service.exceptions.ResourceNotFoundException;
import com.aarogya.patient_management_service.exceptions.ServiceException;
import com.aarogya.patient_management_service.model.DiseaseHistory;
import com.aarogya.patient_management_service.repository.DiseaseHistoryRepository;
import com.aarogya.patient_management_service.service.DiseaseHistoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
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
public class DiseaseHistoryServiceImpl implements DiseaseHistoryService {

    private static final String DISEASE_HISTORY_NOT_FOUND = "Disease history not found with ID: %s for patient: %s";
    private static final String DEFAULT_SEVERITY = "Mild";
    private static final String DEFAULT_STATUS = "Active";
    private static final boolean DEFAULT_IS_CHRONIC = false;

    private final DiseaseHistoryRepository diseaseHistoryRepository;
    private final ModelMapper modelMapper;

    @Override
    @EvictPatientCaches
    public DiseaseHistoryResponse createDiseaseHistory(String patientId, CreateDiseaseHistoryRequest request) {
        try {
            log.info("Creating disease history for patient: {}", patientId);

            validateCreateRequest(request);

            DiseaseHistory diseaseHistory = DiseaseHistory.builder()
                    .patientId(patientId)
                    .diseaseName(request.getDiseaseName().trim())
                    .diseaseCode(request.getDiseaseCode() != null ? request.getDiseaseCode().trim() : null)
                    .diagnosisDate(request.getDiagnosisDate())
                    .diagnosedBy(request.getDiagnosedBy().trim())
                    .severity(request.getSeverity() != null ? request.getSeverity() : DEFAULT_SEVERITY)
                    .status(request.getStatus() != null ? request.getStatus() : DEFAULT_STATUS)
                    .isChronic(request.getIsChronic() != null ? request.getIsChronic() : DEFAULT_IS_CHRONIC)
                    .description(request.getDescription() != null ? request.getDescription().trim() : null)
                    .treatment(request.getTreatment() != null ? request.getTreatment().trim() : null)
                    .notes(request.getNotes() != null ? request.getNotes().trim() : null)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            DiseaseHistory saved = diseaseHistoryRepository.save(diseaseHistory);
            log.info("Disease history created successfully with ID: {}", saved.getId());

            return convertToResponse(saved);

        } catch (DataAccessException e) {
            log.error("Database error while creating disease history for patient: {}", patientId, e);
            throw new ServiceException("Failed to create disease history due to database error", e);
        } catch (IllegalArgumentException e) {
            log.error("Validation error while creating disease history for patient: {}", patientId, e);
            throw new ServiceException("Invalid disease history data: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error while creating disease history for patient: {}", patientId, e);
            throw new ServiceException("Failed to create disease history", e);
        }
    }

    @Override
    @Cacheable(value = "diseaseHistory", key = "#patientId + '_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<DiseaseHistoryResponse> getDiseaseHistory(String patientId, Pageable pageable) {
        try {
            log.info("Fetching disease history for patient: {}", patientId);

            Page<DiseaseHistory> diseasePage = diseaseHistoryRepository.findByPatientIdOrderByDiagnosisDateDesc(patientId, pageable);

            return diseasePage.map(this::convertToResponse);

        } catch (DataAccessException e) {
            log.error("Database error while fetching disease history for patient: {}", patientId, e);
            throw new ServiceException("Failed to fetch disease history due to database error", e);
        }
    }

    @Override
    @Cacheable(value = "activeDiseases", key = "#patientId")
    public List<DiseaseHistoryResponse> getActiveDiseases(String patientId) {
        try {
            log.info("Fetching active diseases for patient: {}", patientId);

            return diseaseHistoryRepository.findByPatientIdAndStatus(patientId, "Active")
                    .stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());

        } catch (DataAccessException e) {
            log.error("Database error while fetching active diseases for patient: {}", patientId, e);
            throw new ServiceException("Failed to fetch active diseases due to database error", e);
        }
    }

    @Override
    @Cacheable(value = "chronicDiseases", key = "#patientId")
    public List<DiseaseHistoryResponse> getChronicDiseases(String patientId) {
        try {
            log.info("Fetching chronic diseases for patient: {}", patientId);

            return diseaseHistoryRepository.findByPatientIdAndIsChronicTrue(patientId)
                    .stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());

        } catch (DataAccessException e) {
            log.error("Database error while fetching chronic diseases for patient: {}", patientId, e);
            throw new ServiceException("Failed to fetch chronic diseases due to database error", e);
        }
    }

    @Override
    @EvictPatientCaches
    public DiseaseHistoryResponse updateDiseaseHistory(String patientId, String diseaseId, UpdateDiseaseHistoryRequest request) {
        try {
            log.info("Updating disease history {} for patient: {}", diseaseId, patientId);

            validateUpdateRequest(request);

            DiseaseHistory existing = getDiseaseHistoryForPatient(diseaseId, patientId);

            updateDiseaseHistoryFields(existing, request);
            existing.setUpdatedAt(LocalDateTime.now());

            DiseaseHistory updated = diseaseHistoryRepository.save(existing);
            log.info("Disease history {} updated successfully", diseaseId);

            return convertToResponse(updated);

        } catch (DataAccessException e) {
            log.error("Database error while updating disease history {} for patient: {}", diseaseId, patientId, e);
            throw new ServiceException("Failed to update disease history due to database error", e);
        } catch (IllegalArgumentException e) {
            log.error("Validation error while updating disease history {} for patient: {}", diseaseId, patientId, e);
            throw new ServiceException("Invalid disease history data: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error while updating disease history {} for patient: {}", diseaseId, patientId, e);
            throw new ServiceException("Failed to update disease history", e);
        }
    }

    @Override
    @EvictPatientCaches
    public void deleteDiseaseHistory(String patientId, String diseaseId) {
        try {
            log.info("Deleting disease history {} for patient: {}", diseaseId, patientId);

            if (!diseaseHistoryRepository.existsByIdAndPatientId(diseaseId, patientId)) {
                throw new ResourceNotFoundException(String.format(DISEASE_HISTORY_NOT_FOUND, diseaseId, patientId));
            }

            diseaseHistoryRepository.deleteById(diseaseId);
            log.info("Disease history {} deleted successfully", diseaseId);

        } catch (DataAccessException e) {
            log.error("Database error while deleting disease history {} for patient: {}", diseaseId, patientId, e);
            throw new ServiceException("Failed to delete disease history due to database error", e);
        }
    }

    @Override
    public Optional<DiseaseHistoryResponse> getDiseaseHistoryById(String patientId, String diseaseId) {
        try {
            log.info("Fetching disease history {} for patient: {}", diseaseId, patientId);

            return diseaseHistoryRepository.findByIdAndPatientId(diseaseId, patientId)
                    .map(this::convertToResponse);

        } catch (DataAccessException e) {
            log.error("Database error while fetching disease history {} for patient: {}", diseaseId, patientId, e);
            throw new ServiceException("Failed to fetch disease history due to database error", e);
        }
    }

    private DiseaseHistory getDiseaseHistoryForPatient(String diseaseId, String patientId) {
        return diseaseHistoryRepository.findByIdAndPatientId(diseaseId, patientId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(DISEASE_HISTORY_NOT_FOUND, diseaseId, patientId)));
    }

    private DiseaseHistoryResponse convertToResponse(DiseaseHistory diseaseHistory) {
        DiseaseHistoryResponse response = modelMapper.map(diseaseHistory, DiseaseHistoryResponse.class);

        // Set additional computed fields
        response.setActive(response.isActive());
        response.setCritical(response.isCritical());
        response.setDaysSinceDiagnosis(response.getDaysSinceDiagnosis());

        return response;
    }

    private void validateCreateRequest(CreateDiseaseHistoryRequest request) {
        if (request.getDiseaseName() == null || request.getDiseaseName().trim().isEmpty()) {
            throw new IllegalArgumentException("Disease name is required");
        }
        if (request.getDiagnosisDate() == null) {
            throw new IllegalArgumentException("Diagnosis date is required");
        }
        if (request.getDiagnosedBy() == null || request.getDiagnosedBy().trim().isEmpty()) {
            throw new IllegalArgumentException("Diagnosed by is required");
        }
        if (request.getSeverity() != null && isValidSeverity(request.getSeverity())) {
            throw new IllegalArgumentException("Invalid severity value");
        }
        if (request.getStatus() != null && isValidStatus(request.getStatus())) {
            throw new IllegalArgumentException("Invalid status value");
        }
    }

    private void validateUpdateRequest(UpdateDiseaseHistoryRequest request) {
        if (request.getDiseaseName() != null && request.getDiseaseName().trim().isEmpty()) {
            throw new IllegalArgumentException("Disease name cannot be empty");
        }
        if (request.getDiagnosedBy() != null && request.getDiagnosedBy().trim().isEmpty()) {
            throw new IllegalArgumentException("Diagnosed by cannot be empty");
        }
        if (request.getSeverity() != null && isValidSeverity(request.getSeverity())) {
            throw new IllegalArgumentException("Invalid severity value");
        }
        if (request.getStatus() != null && isValidStatus(request.getStatus())) {
            throw new IllegalArgumentException("Invalid status value");
        }
    }

    private boolean isValidSeverity(String severity) {
        return !Arrays.asList("Mild", "Moderate", "Severe", "Critical").contains(severity);
    }

    private boolean isValidStatus(String status) {
        return !Arrays.asList("Active", "Resolved", "Chronic", "Under Treatment").contains(status);
    }

    private void updateDiseaseHistoryFields(DiseaseHistory existing, UpdateDiseaseHistoryRequest request) {
        if (request.getDiseaseName() != null) {
            existing.setDiseaseName(request.getDiseaseName().trim());
        }
        if (request.getDiseaseCode() != null) {
            existing.setDiseaseCode(request.getDiseaseCode().trim());
        }
        if (request.getDiagnosisDate() != null) {
            existing.setDiagnosisDate(request.getDiagnosisDate());
        }
        if (request.getDiagnosedBy() != null) {
            existing.setDiagnosedBy(request.getDiagnosedBy().trim());
        }
        if (request.getSeverity() != null) {
            existing.setSeverity(request.getSeverity());
        }
        if (request.getStatus() != null) {
            existing.setStatus(request.getStatus());
        }
        if (request.getIsChronic() != null) {
            existing.setChronic(request.getIsChronic());
        }
        if (request.getDescription() != null) {
            existing.setDescription(request.getDescription().trim());
        }
        if (request.getTreatment() != null) {
            existing.setTreatment(request.getTreatment().trim());
        }
        if (request.getNotes() != null) {
            existing.setNotes(request.getNotes().trim());
        }
    }
}
