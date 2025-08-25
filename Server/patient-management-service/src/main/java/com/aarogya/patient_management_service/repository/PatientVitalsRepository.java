package com.aarogya.patient_management_service.repository;

import com.aarogya.patient_management_service.model.PatientVitals;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PatientVitalsRepository extends MongoRepository<PatientVitals, String> {

    Page<PatientVitals> findByPatientIdOrderByRecordedAtDesc(String patientId, Pageable pageable);

    PatientVitals findTopByPatientIdOrderByRecordedAtDesc(String patientId);

    List<PatientVitals> findByPatientIdAndRecordedAtBetween(String patientId, LocalDateTime startDate, LocalDateTime endDate);

    Optional<PatientVitals> findByIdAndPatientId(String id, String patientId);

    boolean existsByIdAndPatientId(String id, String patientId);

    List<PatientVitals> findByPatientId(String patientId);

    List<PatientVitals> findTop5ByPatientIdOrderByRecordedAtDesc(String patientId);
}
