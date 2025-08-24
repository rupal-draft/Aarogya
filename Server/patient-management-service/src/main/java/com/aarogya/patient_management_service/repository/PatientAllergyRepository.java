package com.aarogya.patient_management_service.repository;

import com.aarogya.patient_management_service.model.PatientAllergy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientAllergyRepository extends MongoRepository<PatientAllergy, String> {

    Page<PatientAllergy> findByPatientIdOrderByDiagnosedDateDesc(String patientId, Pageable pageable);

    List<PatientAllergy> findByPatientIdAndIsActiveTrue(String patientId);

    @Query("{'patientId': ?0, 'severity': ?1}")
    List<PatientAllergy> findByPatientIdAndSeverity(String patientId, String severity);

    @Query("{'patientId': ?0, 'allergyType': ?1}")
    List<PatientAllergy> findByPatientIdAndAllergyType(String patientId, String allergyType);

    long countByPatientIdAndSeverityIn(String patientId, List<String> severities);
}
