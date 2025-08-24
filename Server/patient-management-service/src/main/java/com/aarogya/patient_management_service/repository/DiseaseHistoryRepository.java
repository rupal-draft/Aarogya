package com.aarogya.patient_management_service.repository;

import com.aarogya.patient_management_service.model.DiseaseHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DiseaseHistoryRepository extends MongoRepository<DiseaseHistory, String> {

    List<DiseaseHistory> findByPatientIdOrderByDiagnosisDateDesc(String patientId);

    List<DiseaseHistory> findByPatientIdAndStatus(String patientId, String status);

    List<DiseaseHistory> findByPatientIdAndIsChronicTrue(String patientId);

    List<DiseaseHistory> findByPatientIdAndIsHereditaryTrue(String patientId);

    Page<DiseaseHistory> findByPatientId(String patientId, Pageable pageable);

    @Query("{'patientId': ?0, 'diseaseName': {$regex: ?1, $options: 'i'}}")
    List<DiseaseHistory> findByPatientIdAndDiseaseNameContainingIgnoreCase(String patientId, String diseaseName);

    long countByPatientIdAndStatus(String patientId, String status);

    @Query("{'patientId': ?0, 'diagnosisDate': {$gte: ?1, $lte: ?2}}")
    List<DiseaseHistory> findByPatientIdAndDiagnosisDateBetween(String patientId, LocalDate startDate, LocalDate endDate);
}
