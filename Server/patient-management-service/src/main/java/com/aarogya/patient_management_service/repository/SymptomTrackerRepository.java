package com.aarogya.patient_management_service.repository;

import com.aarogya.patient_management_service.model.SymptomTracker;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SymptomTrackerRepository extends MongoRepository<SymptomTracker, String> {

    List<SymptomTracker> findByPatientIdOrderByRecordedAtDesc(String patientId);

    Page<SymptomTracker> findByPatientId(String patientId, Pageable pageable);

    @Query("{'patientId': ?0, 'recordedAt': {$gte: ?1, $lte: ?2}}")
    List<SymptomTracker> findByPatientIdAndRecordedAtBetween(String patientId, LocalDateTime startDate, LocalDateTime endDate);

    @Query("{'patientId': ?0, 'symptomName': {$regex: ?1, $options: 'i'}}")
    List<SymptomTracker> findByPatientIdAndSymptomNameContainingIgnoreCase(String patientId, String symptomName);

    @Query("{'patientId': ?0, 'severity': {$gte: ?1}}")
    List<SymptomTracker> findByPatientIdAndSeverityGreaterThanEqual(String patientId, Integer severity);
}