package com.aarogya.patient_management_service.repository;

import com.aarogya.patient_management_service.model.MedicalHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicalHistoryRepository extends MongoRepository<MedicalHistory, String> {

    Page<MedicalHistory> findByPatientIdOrderByDiagnosisDateDesc(String patientId, Pageable pageable);

    List<MedicalHistory> findByPatientIdAndActiveTrue(String patientId);

    List<MedicalHistory> findByPatientIdAndConditionNameContainingIgnoreCase(String patientId, String query);

    Optional<MedicalHistory> findByIdAndPatientId(String id, String patientId);

    boolean existsByIdAndPatientId(String id, String patientId);

    List<MedicalHistory> findByPatientId(String patientId);
}
