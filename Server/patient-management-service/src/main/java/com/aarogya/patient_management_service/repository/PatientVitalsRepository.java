package com.aarogya.patient_management_service.repository;

import com.aarogya.patient_management_service.model.PatientVitals;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PatientVitalsRepository extends MongoRepository<PatientVitals, String> {

    Page<PatientVitals> findByPatientIdOrderByRecordedAtDesc(String patientId, Pageable pageable);

    @Query("{'patientId': ?0, 'recordedAt': {$gte: ?1, $lte: ?2}}")
    List<PatientVitals> findByPatientIdAndDateRange(String patientId, LocalDateTime startDate, LocalDateTime endDate);

    @Query("{'patientId': ?0, 'recordedByType': ?1}")
    List<PatientVitals> findByPatientIdAndRecordedByType(String patientId, String recordedByType);

    PatientVitals findTopByPatientIdOrderByRecordedAtDesc(String patientId);

    long countByPatientId(String patientId);
}
