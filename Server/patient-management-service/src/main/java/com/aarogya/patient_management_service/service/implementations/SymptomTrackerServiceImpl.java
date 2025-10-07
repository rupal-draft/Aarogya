package com.aarogya.patient_management_service.service.implementations;

import com.aarogya.patient_management_service.annotations.EvictPatientCaches;
import com.aarogya.patient_management_service.dto.request.CreateSymptomTrackerRequest;
import com.aarogya.patient_management_service.dto.request.UpdateSymptomTrackerRequest;
import com.aarogya.patient_management_service.dto.response.SymptomStatsResponse;
import com.aarogya.patient_management_service.dto.response.SymptomTrackerResponse;
import com.aarogya.patient_management_service.exceptions.ResourceNotFoundException;
import com.aarogya.patient_management_service.exceptions.ServiceException;
import com.aarogya.patient_management_service.model.SymptomTracker;
import com.aarogya.patient_management_service.repository.SymptomTrackerRepository;
import com.aarogya.patient_management_service.service.SymptomTrackerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SymptomTrackerServiceImpl implements SymptomTrackerService {

    private static final String SYMPTOM_NOT_FOUND = "Symptom not found with ID: %s for patient: %s";
    private static final int MAX_SYMPTOMS_PER_DAY = 20;

    private final SymptomTrackerRepository symptomTrackerRepository;
    private final ModelMapper modelMapper;
    private final CacheManager cacheManager;

    @Override
    @Cacheable(value = "patientSymptoms", key = "#patientId + '_' + #pageable.pageNumber + '_' + #pageable.pageSize + '_' + #pageable.sort")
    public Page<SymptomTrackerResponse> getPatientSymptoms(String patientId, Pageable pageable) {
        try {
            log.info("Fetching symptoms for patient: {}, page: {}", patientId, pageable.getPageNumber());
            Page<SymptomTracker> symptoms = symptomTrackerRepository.findByPatientIdOrderByRecordedAtDesc(patientId, pageable);
            log.info("Found {} symptoms for patient: {}", symptoms.getTotalElements(), patientId);
            return symptoms.map(this::mapToResponse);
        } catch (DataAccessException e) {
            log.error("Database error while fetching symptoms for patient: {}", patientId, e);
            throw new ServiceException("Failed to fetch symptoms due to database error", e);
        }
    }

    @Override
    @Cacheable(value = "symptom", key = "#patientId + '_' + #symptomId")
    public SymptomTrackerResponse getSymptom(String patientId, String symptomId) {
        try {
            log.info("Fetching symptom {} for patient: {}", symptomId, patientId);
            SymptomTracker symptom = symptomTrackerRepository.findByIdAndPatientId(symptomId, patientId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            String.format(SYMPTOM_NOT_FOUND, symptomId, patientId)));
            return mapToResponse(symptom);
        } catch (DataAccessException e) {
            log.error("Database error while fetching symptom {} for patient: {}", symptomId, patientId, e);
            throw new ServiceException("Failed to fetch symptom due to database error", e);
        }
    }

    @Override
    @Cacheable(value = "symptomsByName", key = "#patientId + '_' + #symptomName + '_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<SymptomTrackerResponse> getSymptomsByName(String patientId, String symptomName, Pageable pageable) {
        try {
            log.info("Fetching symptoms by name '{}' for patient: {}", symptomName, patientId);
            return symptomTrackerRepository.findByPatientIdAndSymptomNameContainingIgnoreCaseOrderByRecordedAtDesc(patientId, symptomName, pageable)
                    .map(this::mapToResponse);
        } catch (DataAccessException e) {
            log.error("Database error while fetching symptoms by name '{}' for patient: {}", symptomName, patientId, e);
            throw new ServiceException("Failed to fetch symptoms by name due to database error", e);
        }
    }

    @Override
    @Cacheable(value = "symptomsBySeverity", key = "#patientId + '_' + #minSeverity + '_' + #maxSeverity + '_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<SymptomTrackerResponse> getSymptomsBySeverityRange(String patientId, Integer minSeverity, Integer maxSeverity, Pageable pageable) {
        try {
            log.info("Fetching symptoms by severity range {}-{} for patient: {}", minSeverity, maxSeverity, patientId);

            // Validate severity range
            validateSeverityRange(minSeverity, maxSeverity);

            return symptomTrackerRepository.findByPatientIdAndSeverityBetweenOrderByRecordedAtDesc(patientId, minSeverity, maxSeverity, pageable)
                    .map(this::mapToResponse);
        } catch (DataAccessException e) {
            log.error("Database error while fetching symptoms by severity range for patient: {}", patientId, e);
            throw new ServiceException("Failed to fetch symptoms by severity range due to database error", e);
        } catch (IllegalArgumentException e) {
            log.error("Validation error while fetching symptoms by severity range for patient: {}", patientId, e);
            throw new ServiceException(e.getMessage(), e);
        }
    }

    @Override
    @Cacheable(value = "recentSymptoms", key = "#patientId + '_' + #since + '_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<SymptomTrackerResponse> getRecentSymptoms(String patientId, LocalDateTime since, Pageable pageable) {
        try {
            log.info("Fetching recent symptoms since {} for patient: {}", since, patientId);

            if (since == null) {
                since = LocalDateTime.now().minusDays(7); // Default to last 7 days
            }

            return symptomTrackerRepository.findByPatientIdAndRecordedAtAfterOrderByRecordedAtDesc(patientId, since, pageable)
                    .map(this::mapToResponse);
        } catch (DataAccessException e) {
            log.error("Database error while fetching recent symptoms for patient: {}", patientId, e);
            throw new ServiceException("Failed to fetch recent symptoms due to database error", e);
        }
    }

    @Override
    @Transactional
    @EvictPatientCaches
    public SymptomTrackerResponse recordSymptom(String patientId, CreateSymptomTrackerRequest request) {
        try {
            log.info("Recording symptom for patient: {}", patientId);

            validateCreateRequest(request);
            validateDailySymptomLimit(patientId);

            SymptomTracker symptom = SymptomTracker.builder()
                    .patientId(patientId)
                    .symptomName(request.getSymptomName().trim())
                    .category(request.getCategory() != null ? request.getCategory().trim() : determineCategory(request.getSymptomName()))
                    .severity(request.getSeverity())
                    .description(request.getDescription() != null ? request.getDescription().trim() : "")
                    .triggers(request.getTriggers() != null ? request.getTriggers() : new ArrayList<>())
                    .duration(request.getDuration() != null ? request.getDuration().trim() : "")
                    .frequency(request.getFrequency() != null ? request.getFrequency().trim() : "")
                    .associatedSymptoms(request.getAssociatedSymptoms() != null ? request.getAssociatedSymptoms() : new ArrayList<>())
                    .notes(request.getNotes() != null ? request.getNotes().trim() : "")
                    .recordedAt(request.getRecordedAt() != null ? request.getRecordedAt() : LocalDateTime.now())
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            SymptomTracker savedSymptom = symptomTrackerRepository.save(symptom);
            log.info("Symptom recorded successfully with ID: {}", savedSymptom.getId());
            return mapToResponse(savedSymptom);
        } catch (DataAccessException e) {
            log.error("Database error while recording symptom for patient: {}", patientId, e);
            throw new ServiceException("Failed to record symptom due to database error", e);
        } catch (IllegalArgumentException e) {
            log.error("Validation error while recording symptom for patient: {}", patientId, e);
            throw new ServiceException(e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    @EvictPatientCaches
    public SymptomTrackerResponse updateSymptom(String patientId, String symptomId, UpdateSymptomTrackerRequest request) {
        try {
            log.info("Updating symptom {} for patient: {}", symptomId, patientId);

            validateUpdateRequest(request);

            SymptomTracker symptom = symptomTrackerRepository.findByIdAndPatientId(symptomId, patientId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            String.format(SYMPTOM_NOT_FOUND, symptomId, patientId)));

            if (request.getSymptomName() != null) {
                symptom.setSymptomName(request.getSymptomName().trim());
                if (request.getCategory() == null) {
                    symptom.setCategory(determineCategory(request.getSymptomName()));
                }
            }
            if (request.getCategory() != null) symptom.setCategory(request.getCategory().trim());
            if (request.getSeverity() != null) symptom.setSeverity(request.getSeverity());
            if (request.getDescription() != null) symptom.setDescription(request.getDescription().trim());
            if (request.getTriggers() != null) symptom.setTriggers(request.getTriggers());
            if (request.getDuration() != null) symptom.setDuration(request.getDuration().trim());
            if (request.getFrequency() != null) symptom.setFrequency(request.getFrequency().trim());
            if (request.getAssociatedSymptoms() != null) symptom.setAssociatedSymptoms(request.getAssociatedSymptoms());
            if (request.getNotes() != null) symptom.setNotes(request.getNotes().trim());
            if (request.getRecordedAt() != null) symptom.setRecordedAt(request.getRecordedAt());

            symptom.setUpdatedAt(LocalDateTime.now());

            SymptomTracker updatedSymptom = symptomTrackerRepository.save(symptom);
            log.info("Symptom {} updated successfully", symptomId);
            return mapToResponse(updatedSymptom);
        } catch (DataAccessException e) {
            log.error("Database error while updating symptom {} for patient: {}", symptomId, patientId, e);
            throw new ServiceException("Failed to update symptom due to database error", e);
        } catch (IllegalArgumentException e) {
            log.error("Validation error while updating symptom {} for patient: {}", symptomId, patientId, e);
            throw new ServiceException(e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    @EvictPatientCaches
    public SymptomTrackerResponse partialUpdateSymptom(String patientId, String symptomId, UpdateSymptomTrackerRequest request) {
        try {
            log.info("Partially updating symptom {} for patient: {}", symptomId, patientId);

            SymptomTracker symptom = symptomTrackerRepository.findByIdAndPatientId(symptomId, patientId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            String.format(SYMPTOM_NOT_FOUND, symptomId, patientId)));

            if (request.getSymptomName() != null) {
                validateSymptomName(request.getSymptomName());
                symptom.setSymptomName(request.getSymptomName().trim());
                if (request.getCategory() == null) {
                    symptom.setCategory(determineCategory(request.getSymptomName()));
                }
            }
            if (request.getCategory() != null) symptom.setCategory(request.getCategory().trim());
            if (request.getSeverity() != null) {
                validateSeverity(request.getSeverity());
                symptom.setSeverity(request.getSeverity());
            }
            if (request.getDescription() != null) symptom.setDescription(request.getDescription().trim());
            if (request.getTriggers() != null) symptom.setTriggers(request.getTriggers());
            if (request.getDuration() != null) symptom.setDuration(request.getDuration().trim());
            if (request.getFrequency() != null) symptom.setFrequency(request.getFrequency().trim());
            if (request.getAssociatedSymptoms() != null) symptom.setAssociatedSymptoms(request.getAssociatedSymptoms());
            if (request.getNotes() != null) symptom.setNotes(request.getNotes().trim());
            if (request.getRecordedAt() != null) symptom.setRecordedAt(request.getRecordedAt());

            symptom.setUpdatedAt(LocalDateTime.now());

            SymptomTracker updatedSymptom = symptomTrackerRepository.save(symptom);
            log.info("Symptom {} partially updated successfully", symptomId);
            return mapToResponse(updatedSymptom);
        } catch (DataAccessException e) {
            log.error("Database error while partially updating symptom {} for patient: {}", symptomId, patientId, e);
            throw new ServiceException("Failed to partially update symptom due to database error", e);
        }
    }

    @Override
    @Transactional
    @EvictPatientCaches
    public void deleteSymptom(String patientId, String symptomId) {
        try {
            log.info("Deleting symptom {} for patient: {}", symptomId, patientId);

            SymptomTracker symptom = symptomTrackerRepository.findByIdAndPatientId(symptomId, patientId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            String.format(SYMPTOM_NOT_FOUND, symptomId, patientId)));

            symptomTrackerRepository.delete(symptom);
            log.info("Symptom {} deleted successfully", symptomId);
        } catch (DataAccessException e) {
            log.error("Database error while deleting symptom {} for patient: {}", symptomId, patientId, e);
            throw new ServiceException("Failed to delete symptom due to database error", e);
        }
    }

    @Override
    public Page<SymptomTrackerResponse> getSymptomsByCategory(String patientId, String category, Pageable pageable) {
        try {
            log.info("Fetching symptoms by category '{}' for patient: {}", category, patientId);
            return symptomTrackerRepository.findByPatientIdAndCategoryOrderByRecordedAtDesc(patientId, category, pageable)
                    .map(this::mapToResponse);
        } catch (DataAccessException e) {
            log.error("Database error while fetching symptoms by category for patient: {}", patientId, e);
            throw new ServiceException("Failed to fetch symptoms by category due to database error", e);
        }
    }

    @Override
    public Page<SymptomTrackerResponse> getSevereSymptoms(String patientId, Pageable pageable) {
        try {
            log.info("Fetching severe symptoms (severity >= 7) for patient: {}", patientId);
            return symptomTrackerRepository.findByPatientIdAndSeverityGreaterThanEqualOrderByRecordedAtDesc(patientId, 7, pageable)
                    .map(this::mapToResponse);
        } catch (DataAccessException e) {
            log.error("Database error while fetching severe symptoms for patient: {}", patientId, e);
            throw new ServiceException("Failed to fetch severe symptoms due to database error", e);
        }
    }

    @Override
    public List<SymptomTrackerResponse> getSymptomsByDateRange(String patientId, LocalDateTime start, LocalDateTime end) {
        try {
            log.info("Fetching symptoms between {} and {} for patient: {}", start, end, patientId);
            return symptomTrackerRepository.findByPatientIdAndRecordedAtBetween(patientId, start, end)
                    .stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        } catch (DataAccessException e) {
            log.error("Database error while fetching symptoms by date range for patient: {}", patientId, e);
            throw new ServiceException("Failed to fetch symptoms by date range due to database error", e);
        }
    }

    @Override
    public SymptomStatsResponse getSymptomStats(String patientId) {
        try {
            log.info("Fetching symptom statistics for patient: {}", patientId);

            List<SymptomTrackerRepository.SymptomSummary> summaries = symptomTrackerRepository.getSymptomSummary(patientId);
            List<SymptomTracker> recentSymptoms = symptomTrackerRepository.findRecentSymptoms(patientId, PageRequest.of(0, 10));

            return SymptomStatsResponse.builder()
                    .symptomSummaries(summaries)
                    .recentSymptoms(recentSymptoms.stream().map(this::mapToResponse).collect(Collectors.toList()))
                    .totalSymptoms(recentSymptoms.size())
                    .build();
        } catch (DataAccessException e) {
            log.error("Database error while fetching symptom statistics for patient: {}", patientId, e);
            throw new ServiceException("Failed to fetch symptom statistics due to database error", e);
        }
    }

    private void validateDailySymptomLimit(String patientId) {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfDay = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);

        long todaySymptoms = symptomTrackerRepository.findByPatientIdAndRecordedAtBetween(patientId, startOfDay, endOfDay).size();

        if (todaySymptoms >= MAX_SYMPTOMS_PER_DAY) {
            throw new IllegalStateException("Maximum limit of " + MAX_SYMPTOMS_PER_DAY + " symptoms per day reached");
        }
    }

    private void validateCreateRequest(CreateSymptomTrackerRequest request) {
        validateSymptomName(request.getSymptomName());
        validateSeverity(request.getSeverity());

        if (request.getTriggers() != null) {
            validateTriggers(request.getTriggers());
        }
        if (request.getAssociatedSymptoms() != null) {
            validateAssociatedSymptoms(request.getAssociatedSymptoms());
        }
    }

    private void validateUpdateRequest(UpdateSymptomTrackerRequest request) {
        if (request.getSymptomName() != null) validateSymptomName(request.getSymptomName());
        if (request.getSeverity() != null) validateSeverity(request.getSeverity());
        if (request.getTriggers() != null) validateTriggers(request.getTriggers());
        if (request.getAssociatedSymptoms() != null) validateAssociatedSymptoms(request.getAssociatedSymptoms());
    }

    private void validateSymptomName(String symptomName) {
        if (symptomName == null || symptomName.trim().isEmpty()) {
            throw new IllegalArgumentException("Symptom name is required");
        }
        if (symptomName.trim().length() > 100) {
            throw new IllegalArgumentException("Symptom name cannot exceed 100 characters");
        }
    }

    private void validateSeverity(Integer severity) {
        if (severity == null) {
            throw new IllegalArgumentException("Severity is required");
        }
        if (severity < 1 || severity > 10) {
            throw new IllegalArgumentException("Severity must be between 1 and 10");
        }
    }

    private void validateSeverityRange(Integer minSeverity, Integer maxSeverity) {
        if (minSeverity == null || maxSeverity == null) {
            throw new IllegalArgumentException("Both min and max severity are required");
        }
        if (minSeverity < 1 || maxSeverity > 10 || minSeverity > maxSeverity) {
            throw new IllegalArgumentException("Invalid severity range. Must be between 1-10 and min <= max");
        }
    }

    private void validateTriggers(List<String> triggers) {
        if (triggers.size() > 20) {
            throw new IllegalArgumentException("Cannot have more than 20 triggers");
        }
        for (String trigger : triggers) {
            if (trigger.length() > 50) {
                throw new IllegalArgumentException("Trigger cannot exceed 50 characters");
            }
        }
    }

    private void validateAssociatedSymptoms(List<String> associatedSymptoms) {
        if (associatedSymptoms.size() > 10) {
            throw new IllegalArgumentException("Cannot have more than 10 associated symptoms");
        }
        for (String symptom : associatedSymptoms) {
            if (symptom.length() > 100) {
                throw new IllegalArgumentException("Associated symptom cannot exceed 100 characters");
            }
        }
    }

    private String determineCategory(String symptomName) {
        if (symptomName == null) return "General";

        String lowerName = symptomName.toLowerCase();
        if (lowerName.contains("pain") || lowerName.contains("ache") || lowerName.contains("hurt")) {
            return "Pain";
        } else if (lowerName.contains("cough") || lowerName.contains("breath") || lowerName.contains("lung")) {
            return "Respiratory";
        } else if (lowerName.contains("stomach") || lowerName.contains("digest") || lowerName.contains("nausea")) {
            return "Digestive";
        } else if (lowerName.contains("head") || lowerName.contains("dizzy") || lowerName.contains("neuro")) {
            return "Neurological";
        } else if (lowerName.contains("heart") || lowerName.contains("chest") || lowerName.contains("cardio")) {
            return "Cardiovascular";
        } else if (lowerName.contains("anxiety") || lowerName.contains("depress") || lowerName.contains("mood")) {
            return "Mental Health";
        } else {
            return "General";
        }
    }

    private SymptomTrackerResponse mapToResponse(SymptomTracker symptom) {
        try {
            SymptomTrackerResponse response = modelMapper.map(symptom, SymptomTrackerResponse.class);

            // Calculate derived fields
            response.setSeverityText(getSeverityText(symptom.getSeverity()));
            response.setSeverityBadgeColor(getSeverityBadgeColor(symptom.getSeverity()));
            response.setCategoryBadgeColor(getCategoryBadgeColor(symptom.getCategory()));
            response.setSevere(isSevere(symptom.getSeverity()));
            response.setRecent(isRecent(symptom.getRecordedAt()));
            response.setTimeAgo(getTimeAgo(symptom.getRecordedAt()));
            response.setFormattedRecordedAt(formatDateTime(symptom.getRecordedAt()));

            return response;
        } catch (Exception e) {
            log.error("Error mapping symptom to response for symptom ID: {}", symptom.getId(), e);
            throw new ServiceException("Failed to map symptom to response", e);
        }
    }

    private String getSeverityText(Integer severity) {
        if (severity == null) return "Unknown";
        return switch (severity) {
            case 1, 2 -> "Mild";
            case 3, 4 -> "Moderate";
            case 5, 6 -> "Moderate-Severe";
            case 7, 8 -> "Severe";
            case 9, 10 -> "Very Severe";
            default -> "Unknown";
        };
    }

    private String getSeverityBadgeColor(Integer severity) {
        if (severity == null) return "gray";
        return switch (severity) {
            case 1, 2 -> "green";
            case 3, 4 -> "yellow";
            case 5, 6 -> "orange";
            case 7, 8 -> "red";
            case 9, 10 -> "darkred";
            default -> "gray";
        };
    }

    private String getCategoryBadgeColor(String category) {
        if (category == null) return "gray";
        return switch (category.toLowerCase()) {
            case "pain" -> "red";
            case "respiratory" -> "blue";
            case "digestive" -> "green";
            case "neurological" -> "purple";
            case "cardiovascular" -> "pink";
            case "mental health" -> "teal";
            default -> "gray";
        };
    }

    private boolean isSevere(Integer severity) {
        return severity != null && severity >= 7;
    }

    private boolean isRecent(LocalDateTime recordedAt) {
        if (recordedAt == null) return false;
        return recordedAt.isAfter(LocalDateTime.now().minusHours(24));
    }

    private String getTimeAgo(LocalDateTime recordedAt) {
        if (recordedAt == null) return "";

        Duration duration = Duration.between(recordedAt, LocalDateTime.now());
        long minutes = duration.toMinutes();
        long hours = duration.toHours();
        long days = duration.toDays();

        if (minutes < 1) return "Just now";
        if (minutes < 60) return minutes + " minute" + (minutes > 1 ? "s" : "") + " ago";
        if (hours < 24) return hours + " hour" + (hours > 1 ? "s" : "") + " ago";
        if (days == 1) return "Yesterday";
        if (days < 7) return days + " days ago";
        if (days < 30) return (days / 7) + " week" + ((days / 7) > 1 ? "s" : "") + " ago";
        if (days < 365) return (days / 30) + " month" + ((days / 30) > 1 ? "s" : "") + " ago";
        return (days / 365) + " year" + ((days / 365) > 1 ? "s" : "") + " ago";
    }

    private String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) return "";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' hh:mm a");
        return dateTime.format(formatter);
    }

    public void clearSymptomCache(String patientId) {
        Objects.requireNonNull(cacheManager.getCache("patientSymptoms")).evict(patientId);
        Objects.requireNonNull(cacheManager.getCache("recentSymptoms")).evict(patientId);
        Objects.requireNonNull(cacheManager.getCache("symptomStats")).evict(patientId);
        Objects.requireNonNull(cacheManager.getCache("symptom")).clear();
        Objects.requireNonNull(cacheManager.getCache("symptomsByName")).clear();
        Objects.requireNonNull(cacheManager.getCache("symptomsBySeverity")).clear();
        Objects.requireNonNull(cacheManager.getCache("symptomsByCategory")).clear();
        Objects.requireNonNull(cacheManager.getCache("severeSymptoms")).clear();
    }
}
