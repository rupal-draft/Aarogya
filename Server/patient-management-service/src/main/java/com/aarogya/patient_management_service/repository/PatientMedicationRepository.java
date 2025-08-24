package com.aarogya.patient_management_service.repository;

import com.aarogya.patient_management_service.model.PatientMedication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PatientMedicationRepository extends MongoRepository<PatientMedication, String> {

    Page<PatientMedication> findByPatientIdOrderByCreatedAtDesc(String patientId, Pageable pageable);

    List<PatientMedication> findByPatientIdAndStatus(String patientId, String status);

    Optional<PatientMedication> findByIdAndPatientId(String id, String patientId);

    boolean existsByIdAndPatientId(String id, String patientId);

    List<PatientMedication> findByPatientIdAndStatusAndEndDateAfter(String patientId, String status, LocalDate date);
}
