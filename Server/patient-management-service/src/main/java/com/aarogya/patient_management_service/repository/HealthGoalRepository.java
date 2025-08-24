package com.aarogya.patient_management_service.repository;

import com.aarogya.patient_management_service.model.HealthGoal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface HealthGoalRepository extends MongoRepository<HealthGoal, String> {

    Page<HealthGoal> findByPatientIdOrderByCreatedAtDesc(String patientId, Pageable pageable);

    Optional<HealthGoal> findByIdAndPatientId(String id, String patientId);

    Page<HealthGoal> findByPatientIdAndStatusOrderByTargetDateAsc(String patientId, String status, Pageable pageable);

    Page<HealthGoal> findByPatientIdAndGoalTypeOrderByCreatedAtDesc(String patientId, String goalType, Pageable pageable);

    Page<HealthGoal> findByPatientIdAndPriorityOrderByTargetDateAsc(String patientId, String priority, Pageable pageable);

    List<HealthGoal> findByPatientIdAndStatusAndTargetDateBefore(String patientId, String status, LocalDate targetDate);

    Page<HealthGoal> findByPatientIdAndStatus(String patientId, String status, Pageable pageable);

    int countByPatientIdAndStatus(String patientId, String status);

    @Query("{'patientId': ?0, 'targetDate': {$lte: ?2}, 'status': {$ne: 'COMPLETED'}}")
    Page<HealthGoal> findOverdueGoals(String patientId, LocalDate currentDate, Pageable pageable);
}
