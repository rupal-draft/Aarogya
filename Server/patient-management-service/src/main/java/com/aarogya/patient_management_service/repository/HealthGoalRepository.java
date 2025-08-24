package com.aarogya.patient_management_service.repository;

import com.aarogya.patient_management_service.model.HealthGoal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HealthGoalRepository extends MongoRepository<HealthGoal, String> {

    Page<HealthGoal> findByPatientIdOrderByCreatedAtDesc(String patientId, Pageable pageable);

    List<HealthGoal> findByPatientIdAndStatus(String patientId, String status);

    @Query("{'patientId': ?0, 'goalType': ?1}")
    List<HealthGoal> findByPatientIdAndGoalType(String patientId, String goalType);

    @Query("{'patientId': ?0, 'targetDate': {$lte: ?1}, 'status': 'ACTIVE'}")
    List<HealthGoal> findOverdueGoals(String patientId, LocalDate currentDate);

    long countByPatientIdAndStatus(String patientId, String status);
}
