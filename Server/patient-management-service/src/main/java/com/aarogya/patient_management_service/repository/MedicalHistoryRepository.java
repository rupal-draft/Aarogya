package com.aarogya.patient_management_service.repository;

import com.aarogya.patient_management_service.model.MedicalHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalHistoryRepository extends MongoRepository<MedicalHistory, String> {

    Page<MedicalHistory> findByPatientIdOrderByDiagnosisDateDesc(String patientId, Pageable pageable);

    List<MedicalHistory> findByPatientIdAndIsActiveTrue(String patientId);

    @Query("{'patientId': ?0, 'category': ?1}")
    List<MedicalHistory> findByPatientIdAndCategory(String patientId, String category);

    @Query("{'patientId': ?0, 'conditionName': {$regex: ?1, $options: 'i'}}")
    List<MedicalHistory> findByPatientIdAndConditionNameContaining(String patientId, String conditionName);

    long countByPatientIdAndIsActiveTrue(String patientId);
}
