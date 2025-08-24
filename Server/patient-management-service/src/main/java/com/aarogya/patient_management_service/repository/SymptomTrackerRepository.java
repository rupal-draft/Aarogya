package com.aarogya.patient_management_service.repository;

import com.aarogya.patient_management_service.model.SymptomTracker;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SymptomTrackerRepository extends MongoRepository<SymptomTracker, String> {

    Page<SymptomTracker> findByPatientIdOrderByRecordedAtDesc(String patientId, Pageable pageable);

    Optional<SymptomTracker> findByIdAndPatientId(String id, String patientId);

    Page<SymptomTracker> findByPatientIdAndSymptomNameContainingIgnoreCaseOrderByRecordedAtDesc(String patientId, String symptomName, Pageable pageable);

    Page<SymptomTracker> findByPatientIdAndSeverityBetweenOrderByRecordedAtDesc(String patientId, Integer minSeverity, Integer maxSeverity, Pageable pageable);

    Page<SymptomTracker> findByPatientIdAndRecordedAtAfterOrderByRecordedAtDesc(String patientId, LocalDateTime since, Pageable pageable);

    Page<SymptomTracker> findByPatientIdAndCategoryOrderByRecordedAtDesc(String patientId, String category, Pageable pageable);

    Page<SymptomTracker> findByPatientIdAndSeverityGreaterThanEqualOrderByRecordedAtDesc(String patientId, Integer minSeverity, Pageable pageable);

    List<SymptomTracker> findByPatientIdAndRecordedAtBetween(String patientId, LocalDateTime start, LocalDateTime end);

    @Query("{'patientId': ?0, 'recordedAt': {$gte: ?1, $lte: ?2}}")
    List<SymptomTracker> findSymptomsByDateRange(String patientId, LocalDateTime start, LocalDateTime end);

    @Query(value = "{'patientId': ?0}", sort = "{'recordedAt': -1}")
    List<SymptomTracker> findRecentSymptoms(String patientId, Pageable pageable);

    @Aggregation(pipeline = {
            "{'$match': {'patientId': ?0}}",
            "{'$group': {'_id': '$symptomName', 'count': {'$sum': 1}, 'avgSeverity': {'$avg': '$severity'}}}",
            "{'$sort': {'count': -1}}"
    })
    List<SymptomSummary> getSymptomSummary(String patientId);

    interface SymptomSummary {
        String getSymptomName();
        Long getCount();
        Double getAvgSeverity();
    }
}