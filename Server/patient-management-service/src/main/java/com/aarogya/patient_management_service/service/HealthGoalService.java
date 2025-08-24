package com.aarogya.patient_management_service.service;

import com.aarogya.patient_management_service.dto.request.CreateHealthGoalRequest;
import com.aarogya.patient_management_service.dto.request.UpdateHealthGoalRequest;
import com.aarogya.patient_management_service.dto.response.HealthGoalResponse;
import com.aarogya.patient_management_service.dto.response.HealthGoalStatsResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;

public interface HealthGoalService {

    Page<HealthGoalResponse> getPatientHealthGoals(String patientId, Pageable pageable);

    HealthGoalResponse getHealthGoal(String patientId, String goalId);

    Page<HealthGoalResponse> getActiveGoals(String patientId, Pageable pageable);

    Page<HealthGoalResponse> getGoalsByType(String patientId, String goalType, Pageable pageable);

    Page<HealthGoalResponse> getGoalsByPriority(String patientId, String priority, Pageable pageable);

    Page<HealthGoalResponse> getOverdueGoals(String patientId, Pageable pageable);

    Page<HealthGoalResponse> getGoalsByStatus(String patientId, String status, Pageable pageable);

    HealthGoalResponse createHealthGoal(String patientId, CreateHealthGoalRequest request);

    HealthGoalResponse updateHealthGoal(String patientId, String goalId, UpdateHealthGoalRequest request);

    HealthGoalResponse partialUpdateHealthGoal(String patientId, String goalId, UpdateHealthGoalRequest request);

    HealthGoalResponse updateProgress(String patientId, String goalId, BigDecimal currentValue);

    HealthGoalResponse addToProgress(String patientId, String goalId, BigDecimal increment);

    HealthGoalResponse updateStatus(String patientId, String goalId, String status);

    void deleteHealthGoal(String patientId, String goalId);

    HealthGoalStatsResponse getHealthGoalStats(String patientId);
}
