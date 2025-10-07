package com.aarogya.patient_management_service.service.implementations;

import com.aarogya.patient_management_service.annotations.EvictPatientCaches;
import com.aarogya.patient_management_service.dto.request.CreateHealthGoalRequest;
import com.aarogya.patient_management_service.dto.request.UpdateHealthGoalRequest;
import com.aarogya.patient_management_service.dto.response.HealthGoalResponse;
import com.aarogya.patient_management_service.dto.response.HealthGoalStatsResponse;
import com.aarogya.patient_management_service.exceptions.ResourceNotFoundException;
import com.aarogya.patient_management_service.exceptions.ServiceException;
import com.aarogya.patient_management_service.model.HealthGoal;
import com.aarogya.patient_management_service.repository.HealthGoalRepository;
import com.aarogya.patient_management_service.service.HealthGoalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HealthGoalServiceImpl implements HealthGoalService {

    private static final String HEALTH_GOAL_NOT_FOUND = "Health goal not found with ID: %s for patient: %s";
    private static final List<String> VALID_STATUSES = Arrays.asList("ACTIVE", "COMPLETED", "PAUSED", "CANCELLED");
    private static final List<String> VALID_PRIORITIES = Arrays.asList("HIGH", "MEDIUM", "LOW");

    private final HealthGoalRepository healthGoalRepository;
    private final ModelMapper modelMapper;
    private final CacheManager cacheManager;

    @Override
    @Cacheable(value = "patientHealthGoals", key = "#patientId + '_' + #pageable.pageNumber + '_' + #pageable.pageSize + '_' + #pageable.sort")
    public Page<HealthGoalResponse> getPatientHealthGoals(String patientId, Pageable pageable) {
        try {
            log.info("Fetching health goals for patient: {}, page: {}", patientId, pageable.getPageNumber());
            Page<HealthGoal> goals = healthGoalRepository.findByPatientIdOrderByCreatedAtDesc(patientId, pageable);
            log.info("Found {} health goals for patient: {}", goals.getTotalElements(), patientId);
            return goals.map(this::mapToResponse);
        } catch (DataAccessException e) {
            log.error("Database error while fetching health goals for patient: {}", patientId, e);
            throw new ServiceException("Failed to fetch health goals due to database error", e);
        }
    }

    @Override
    @Cacheable(value = "healthGoal", key = "#patientId + '_' + #goalId")
    public HealthGoalResponse getHealthGoal(String patientId, String goalId) {
        try {
            log.info("Fetching health goal {} for patient: {}", goalId, patientId);
            HealthGoal goal = healthGoalRepository.findByIdAndPatientId(goalId, patientId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            String.format(HEALTH_GOAL_NOT_FOUND, goalId, patientId)));
            return mapToResponse(goal);
        } catch (DataAccessException e) {
            log.error("Database error while fetching health goal {} for patient: {}", goalId, patientId, e);
            throw new ServiceException("Failed to fetch health goal due to database error", e);
        }
    }

    @Override
    @Cacheable(value = "activeHealthGoals", key = "#patientId + '_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<HealthGoalResponse> getActiveGoals(String patientId, Pageable pageable) {
        try {
            log.info("Fetching active health goals for patient: {}", patientId);
            return healthGoalRepository.findByPatientIdAndStatusOrderByTargetDateAsc(patientId, "ACTIVE", pageable)
                    .map(this::mapToResponse);
        } catch (DataAccessException e) {
            log.error("Database error while fetching active health goals for patient: {}", patientId, e);
            throw new ServiceException("Failed to fetch active health goals due to database error", e);
        }
    }

    @Override
    @Cacheable(value = "healthGoalsByType", key = "#patientId + '_' + #goalType + '_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<HealthGoalResponse> getGoalsByType(String patientId, String goalType, Pageable pageable) {
        try {
            log.info("Fetching health goals by type {} for patient: {}", goalType, patientId);
            return healthGoalRepository.findByPatientIdAndGoalTypeOrderByCreatedAtDesc(patientId, goalType, pageable)
                    .map(this::mapToResponse);
        } catch (DataAccessException e) {
            log.error("Database error while fetching health goals by type {} for patient: {}", goalType, patientId, e);
            throw new ServiceException("Failed to fetch health goals by type due to database error", e);
        }
    }

    @Override
    @Cacheable(value = "healthGoalsByPriority", key = "#patientId + '_' + #priority + '_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<HealthGoalResponse> getGoalsByPriority(String patientId, String priority, Pageable pageable) {
        try {
            log.info("Fetching health goals by priority {} for patient: {}", priority, patientId);
            return healthGoalRepository.findByPatientIdAndPriorityOrderByTargetDateAsc(patientId, priority, pageable)
                    .map(this::mapToResponse);
        } catch (DataAccessException e) {
            log.error("Database error while fetching health goals by priority {} for patient: {}", priority, patientId, e);
            throw new ServiceException("Failed to fetch health goals by priority due to database error", e);
        }
    }

    @Override
    @Cacheable(value = "overdueHealthGoals", key = "#patientId + '_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<HealthGoalResponse> getOverdueGoals(String patientId, Pageable pageable) {
        try {
            log.info("Fetching overdue health goals for patient: {}", patientId);
            LocalDate today = LocalDate.now();
            return healthGoalRepository.findOverdueGoals(patientId, today, pageable)
                    .map(this::mapToResponse);
        } catch (DataAccessException e) {
            log.error("Database error while fetching overdue health goals for patient: {}", patientId, e);
            throw new ServiceException("Failed to fetch overdue health goals due to database error", e);
        }
    }

    @Override
    @Cacheable(value = "healthGoalsByStatus", key = "#patientId + '_' + #status + '_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<HealthGoalResponse> getGoalsByStatus(String patientId, String status, Pageable pageable) {
        try {
            log.info("Fetching health goals by status {} for patient: {}", status, patientId);
            return healthGoalRepository.findByPatientIdAndStatus(patientId, status, pageable)
                    .map(this::mapToResponse);
        } catch (DataAccessException e) {
            log.error("Database error while fetching health goals by status {} for patient: {}", status, patientId, e);
            throw new ServiceException("Failed to fetch health goals by status due to database error", e);
        }
    }

    @Override
    @Transactional
    @EvictPatientCaches
    public HealthGoalResponse createHealthGoal(String patientId, CreateHealthGoalRequest request) {
        try {
            log.info("Creating health goal for patient: {}", patientId);

            validateCreateRequest(request);

            HealthGoal goal = HealthGoal.builder()
                    .patientId(patientId)
                    .goalType(request.getGoalType().trim())
                    .title(request.getTitle() != null ? request.getTitle().trim() : generateTitle(request))
                    .description(request.getDescription().trim())
                    .targetValue(request.getTargetValue() != null ? request.getTargetValue() : BigDecimal.ZERO)
                    .currentValue(request.getCurrentValue() != null ? request.getCurrentValue() : BigDecimal.ZERO)
                    .unit(request.getUnit() != null ? request.getUnit().trim() : "")
                    .targetDate(request.getTargetDate())
                    .priority(request.getPriority() != null ? request.getPriority().toUpperCase() : "MEDIUM")
                    .status("ACTIVE")
                    .notes(request.getNotes() != null ? request.getNotes().trim() : "")
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            HealthGoal savedGoal = healthGoalRepository.save(goal);
            log.info("Health goal created successfully with ID: {}", savedGoal.getId());
            return mapToResponse(savedGoal);
        } catch (DataAccessException e) {
            log.error("Database error while creating health goal for patient: {}", patientId, e);
            throw new ServiceException("Failed to create health goal due to database error", e);
        } catch (IllegalArgumentException e) {
            log.error("Validation error while creating health goal for patient: {}", patientId, e);
            throw new ServiceException(e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    @EvictPatientCaches
    public HealthGoalResponse updateHealthGoal(String patientId, String goalId, UpdateHealthGoalRequest request) {
        try {
            log.info("Updating health goal {} for patient: {}", goalId, patientId);

            validateUpdateRequest(request);

            HealthGoal goal = healthGoalRepository.findByIdAndPatientId(goalId, patientId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            String.format(HEALTH_GOAL_NOT_FOUND, goalId, patientId)));

            if (request.getGoalType() != null) goal.setGoalType(request.getGoalType().trim());
            if (request.getTitle() != null) goal.setTitle(request.getTitle().trim());
            if (request.getDescription() != null) goal.setDescription(request.getDescription().trim());
            if (request.getTargetValue() != null) goal.setTargetValue(request.getTargetValue());
            if (request.getCurrentValue() != null) goal.setCurrentValue(request.getCurrentValue());
            if (request.getUnit() != null) goal.setUnit(request.getUnit().trim());
            if (request.getTargetDate() != null) goal.setTargetDate(request.getTargetDate());
            if (request.getPriority() != null) goal.setPriority(request.getPriority().toUpperCase());
            if (request.getStatus() != null) goal.setStatus(request.getStatus().toUpperCase());
            if (request.getNotes() != null) goal.setNotes(request.getNotes().trim());

            goal.setUpdatedAt(LocalDateTime.now());

            HealthGoal updatedGoal = healthGoalRepository.save(goal);
            log.info("Health goal {} updated successfully", goalId);
            return mapToResponse(updatedGoal);
        } catch (DataAccessException e) {
            log.error("Database error while updating health goal {} for patient: {}", goalId, patientId, e);
            throw new ServiceException("Failed to update health goal due to database error", e);
        } catch (IllegalArgumentException e) {
            log.error("Validation error while updating health goal {} for patient: {}", goalId, patientId, e);
            throw new ServiceException(e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    @EvictPatientCaches
    public HealthGoalResponse partialUpdateHealthGoal(String patientId, String goalId, UpdateHealthGoalRequest request) {
        try {
            log.info("Partially updating health goal {} for patient: {}", goalId, patientId);

            HealthGoal goal = healthGoalRepository.findByIdAndPatientId(goalId, patientId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            String.format(HEALTH_GOAL_NOT_FOUND, goalId, patientId)));

            if (request.getGoalType() != null) {
                validateGoalType(request.getGoalType());
                goal.setGoalType(request.getGoalType().trim());
            }
            if (request.getTitle() != null) goal.setTitle(request.getTitle().trim());
            if (request.getDescription() != null) goal.setDescription(request.getDescription().trim());
            if (request.getTargetValue() != null) goal.setTargetValue(request.getTargetValue());
            if (request.getCurrentValue() != null) goal.setCurrentValue(request.getCurrentValue());
            if (request.getUnit() != null) goal.setUnit(request.getUnit().trim());
            if (request.getTargetDate() != null) goal.setTargetDate(request.getTargetDate());
            if (request.getPriority() != null) {
                validatePriority(request.getPriority());
                goal.setPriority(request.getPriority().toUpperCase());
            }
            if (request.getStatus() != null) {
                validateStatus(request.getStatus());
                goal.setStatus(request.getStatus().toUpperCase());
            }
            if (request.getNotes() != null) goal.setNotes(request.getNotes().trim());

            goal.setUpdatedAt(LocalDateTime.now());

            HealthGoal updatedGoal = healthGoalRepository.save(goal);
            log.info("Health goal {} partially updated successfully", goalId);
            return mapToResponse(updatedGoal);
        } catch (DataAccessException e) {
            log.error("Database error while partially updating health goal {} for patient: {}", goalId, patientId, e);
            throw new ServiceException("Failed to partially update health goal due to database error", e);
        }
    }

    @Override
    @Transactional
    @EvictPatientCaches
    public HealthGoalResponse updateProgress(String patientId, String goalId, BigDecimal currentValue) {
        try {
            log.info("Updating progress for health goal {} for patient: {}", goalId, patientId);

            validateProgressValue(currentValue);

            HealthGoal goal = healthGoalRepository.findByIdAndPatientId(goalId, patientId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            String.format(HEALTH_GOAL_NOT_FOUND, goalId, patientId)));

            goal.setCurrentValue(currentValue);
            goal.setUpdatedAt(LocalDateTime.now());

            // Auto-update status based on progress
            updateGoalStatusBasedOnProgress(goal);

            HealthGoal updatedGoal = healthGoalRepository.save(goal);
            log.info("Progress updated for health goal {}", goalId);
            return mapToResponse(updatedGoal);
        } catch (DataAccessException e) {
            log.error("Database error while updating progress for health goal {} for patient: {}", goalId, patientId, e);
            throw new ServiceException("Failed to update progress due to database error", e);
        } catch (IllegalArgumentException e) {
            log.error("Validation error while updating progress for health goal {} for patient: {}", goalId, patientId, e);
            throw new ServiceException(e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    @EvictPatientCaches
    public HealthGoalResponse addToProgress(String patientId, String goalId, BigDecimal increment) {
        try {
            log.info("Adding {} to progress for health goal {} for patient: {}", increment, goalId, patientId);

            validateProgressValue(increment);

            HealthGoal goal = healthGoalRepository.findByIdAndPatientId(goalId, patientId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            String.format(HEALTH_GOAL_NOT_FOUND, goalId, patientId)));

            BigDecimal newCurrentValue = goal.getCurrentValue().add(increment);
            goal.setCurrentValue(newCurrentValue);
            goal.setUpdatedAt(LocalDateTime.now());

            // Auto-update status based on progress
            updateGoalStatusBasedOnProgress(goal);

            HealthGoal updatedGoal = healthGoalRepository.save(goal);
            log.info("Progress incremented for health goal {}", goalId);
            return mapToResponse(updatedGoal);
        } catch (DataAccessException e) {
            log.error("Database error while adding to progress for health goal {} for patient: {}", goalId, patientId, e);
            throw new ServiceException("Failed to add to progress due to database error", e);
        } catch (IllegalArgumentException e) {
            log.error("Validation error while adding to progress for health goal {} for patient: {}", goalId, patientId, e);
            throw new ServiceException(e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    @EvictPatientCaches
    public HealthGoalResponse updateStatus(String patientId, String goalId, String status) {
        try {
            log.info("Updating status for health goal {} for patient: {}", goalId, patientId);

            validateStatus(status);

            HealthGoal goal = healthGoalRepository.findByIdAndPatientId(goalId, patientId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            String.format(HEALTH_GOAL_NOT_FOUND, goalId, patientId)));

            goal.setStatus(status.toUpperCase());
            goal.setUpdatedAt(LocalDateTime.now());

            HealthGoal updatedGoal = healthGoalRepository.save(goal);
            log.info("Status updated for health goal {}", goalId);
            return mapToResponse(updatedGoal);
        } catch (DataAccessException e) {
            log.error("Database error while updating status for health goal {} for patient: {}", goalId, patientId, e);
            throw new ServiceException("Failed to update status due to database error", e);
        } catch (IllegalArgumentException e) {
            log.error("Validation error while updating status for health goal {} for patient: {}", goalId, patientId, e);
            throw new ServiceException(e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    @EvictPatientCaches
    public void deleteHealthGoal(String patientId, String goalId) {
        try {
            log.info("Soft deleting health goal {} for patient: {}", goalId, patientId);

            HealthGoal goal = healthGoalRepository.findByIdAndPatientId(goalId, patientId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            String.format(HEALTH_GOAL_NOT_FOUND, goalId, patientId)));

            goal.setStatus("CANCELLED");
            goal.setUpdatedAt(LocalDateTime.now());
            healthGoalRepository.save(goal);

            log.info("Health goal {} soft deleted successfully", goalId);
        } catch (DataAccessException e) {
            log.error("Database error while deleting health goal {} for patient: {}", goalId, patientId, e);
            throw new ServiceException("Failed to delete health goal due to database error", e);
        }
    }

    @Override
    @Cacheable(value = "healthGoalStats", key = "#patientId")
    public HealthGoalStatsResponse getHealthGoalStats(String patientId) {
        try {
            log.info("Fetching health goal stats for patient: {}", patientId);

            int totalGoals = healthGoalRepository.countByPatientIdAndStatus(patientId, "ACTIVE");
            int completedGoals = healthGoalRepository.countByPatientIdAndStatus(patientId, "COMPLETED");
            List<HealthGoal> overdueGoals = healthGoalRepository.findByPatientIdAndStatusAndTargetDateBefore(
                    patientId, "ACTIVE", LocalDate.now());

            return HealthGoalStatsResponse.builder()
                    .totalGoals(totalGoals)
                    .completedGoals(completedGoals)
                    .activeGoals(totalGoals - completedGoals)
                    .overdueGoals(overdueGoals.size())
                    .completionRate(totalGoals > 0 ? (completedGoals * 100.0 / totalGoals) : 0)
                    .build();
        } catch (DataAccessException e) {
            log.error("Database error while fetching health goal stats for patient: {}", patientId, e);
            throw new ServiceException("Failed to fetch health goal stats due to database error", e);
        }
    }

    private void updateGoalStatusBasedOnProgress(HealthGoal goal) {
        if (goal.getTargetValue() != null && goal.getTargetValue().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal progress = goal.getCurrentValue().divide(goal.getTargetValue(), 2, RoundingMode.HALF_UP);
            if (progress.compareTo(BigDecimal.ONE) >= 0 && !"COMPLETED".equals(goal.getStatus())) {
                goal.setStatus("COMPLETED");
            } else if (progress.compareTo(new BigDecimal("0.8")) >= 0 && "ACTIVE".equals(goal.getStatus())) {
                goal.setStatus("NEAR_COMPLETION");
            }
        }
    }

    private String generateTitle(CreateHealthGoalRequest request) {
        return request.getGoalType() + " Goal - " + request.getTargetDate().format(DateTimeFormatter.ofPattern("MMM yyyy"));
    }

    private void validateCreateRequest(CreateHealthGoalRequest request) {
        validateGoalType(request.getGoalType());
        validateDescription(request.getDescription());
        validateTargetDate(request.getTargetDate());

        if (request.getTargetValue() != null) {
            validateTargetValue(request.getTargetValue());
        }
        if (request.getPriority() != null) {
            validatePriority(request.getPriority());
        }
    }

    private void validateUpdateRequest(UpdateHealthGoalRequest request) {
        if (request.getGoalType() != null) validateGoalType(request.getGoalType());
        if (request.getDescription() != null) validateDescription(request.getDescription());
        if (request.getTargetDate() != null) validateTargetDate(request.getTargetDate());
        if (request.getTargetValue() != null) validateTargetValue(request.getTargetValue());
        if (request.getPriority() != null) validatePriority(request.getPriority());
        if (request.getStatus() != null) validateStatus(request.getStatus());
    }

    private void validateGoalType(String goalType) {
        if (goalType == null || goalType.trim().isEmpty()) {
            throw new IllegalArgumentException("Goal type is required");
        }
        if (goalType.trim().length() > 50) {
            throw new IllegalArgumentException("Goal type cannot exceed 50 characters");
        }
    }

    private void validateDescription(String description) {
        if (description == null || description.trim().isEmpty()) {
            throw new IllegalArgumentException("Description is required");
        }
        if (description.trim().length() > 500) {
            throw new IllegalArgumentException("Description cannot exceed 500 characters");
        }
    }

    private void validateTargetDate(LocalDate targetDate) {
        if (targetDate == null) {
            throw new IllegalArgumentException("Target date is required");
        }
        if (targetDate.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Target date cannot be in the past");
        }
    }

    private void validateTargetValue(BigDecimal targetValue) {
        if (targetValue.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Target value cannot be negative");
        }
    }

    private void validateProgressValue(BigDecimal value) {
        if (value == null) {
            throw new IllegalArgumentException("Progress value cannot be null");
        }
        if (value.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Progress value cannot be negative");
        }
    }

    private void validatePriority(String priority) {
        if (priority != null && !VALID_PRIORITIES.contains(priority.toUpperCase())) {
            throw new IllegalArgumentException("Invalid priority. Must be one of: " + VALID_PRIORITIES);
        }
    }

    private void validateStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            throw new IllegalArgumentException("Status cannot be null or empty");
        }
        if (!VALID_STATUSES.contains(status.toUpperCase())) {
            throw new IllegalArgumentException("Invalid status. Must be one of: " + VALID_STATUSES);
        }
    }

    private HealthGoalResponse mapToResponse(HealthGoal goal) {
        try {
            HealthGoalResponse response = modelMapper.map(goal, HealthGoalResponse.class);

            // Calculate derived fields
            response.setProgressPercentage(calculateProgressPercentage(goal));
            response.setDaysRemaining(calculateDaysRemaining(goal));
            response.setOverdue(isOverdue(goal));
            response.setCompleted(isCompleted(goal));
            response.setProgressText(getProgressText(response.getProgressPercentage()));

            return response;
        } catch (Exception e) {
            log.error("Error mapping health goal to response for goal ID: {}", goal.getId(), e);
            throw new ServiceException("Failed to map health goal to response", e);
        }
    }

    private double calculateProgressPercentage(HealthGoal goal) {
        if (goal.getTargetValue() == null || goal.getTargetValue().compareTo(BigDecimal.ZERO) == 0) {
            return 0;
        }
        try {
            BigDecimal percentage = goal.getCurrentValue()
                    .divide(goal.getTargetValue(), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
            return Math.min(100, percentage.doubleValue());
        } catch (ArithmeticException e) {
            return 0;
        }
    }

    private long calculateDaysRemaining(HealthGoal goal) {
        if (goal.getTargetDate() == null) return 0;
        return ChronoUnit.DAYS.between(LocalDate.now(), goal.getTargetDate());
    }

    private boolean isOverdue(HealthGoal goal) {
        return goal.getTargetDate() != null &&
                goal.getTargetDate().isBefore(LocalDate.now()) &&
                !"COMPLETED".equalsIgnoreCase(goal.getStatus());
    }

    private boolean isCompleted(HealthGoal goal) {
        return "COMPLETED".equalsIgnoreCase(goal.getStatus());
    }

    private String getProgressText(double progressPercentage) {
        if (progressPercentage >= 100) return "Goal Achieved!";
        if (progressPercentage >= 75) return "Almost There!";
        if (progressPercentage >= 50) return "Good Progress";
        if (progressPercentage >= 25) return "Getting Started";
        return "Just Started";
    }

    public void clearHealthGoalCache(String patientId) {
        Objects.requireNonNull(cacheManager.getCache("patientHealthGoals")).evict(patientId);
        Objects.requireNonNull(cacheManager.getCache("activeHealthGoals")).evict(patientId);
        Objects.requireNonNull(cacheManager.getCache("healthGoalStats")).evict(patientId);
        Objects.requireNonNull(cacheManager.getCache("healthGoal")).clear();
        Objects.requireNonNull(cacheManager.getCache("healthGoalsByType")).clear();
        Objects.requireNonNull(cacheManager.getCache("healthGoalsByPriority")).clear();
        Objects.requireNonNull(cacheManager.getCache("overdueHealthGoals")).clear();
        Objects.requireNonNull(cacheManager.getCache("healthGoalsByStatus")).clear();
    }
}
