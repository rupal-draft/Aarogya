package com.aarogya.patient_management_service.repository;

import com.aarogya.patient_management_service.model.PatientAllergy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientAllergyRepository extends MongoRepository<PatientAllergy, String> {

    Page<PatientAllergy> findByPatientIdOrderByDiagnosedDateDesc(String patientId, Pageable pageable);

    List<PatientAllergy> findByPatientIdAndSeverityIn(String patientId, List<String> severities);

    Optional<PatientAllergy> findByIdAndPatientId(String id, String patientId);

    boolean existsByIdAndPatientId(String id, String patientId);

    List<PatientAllergy> findByPatientIdAndIsActiveTrue(String patientId);
}
