package com.aarogya.patient_management_service.repository;

import com.aarogya.patient_management_service.model.DiseaseHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DiseaseHistoryRepository extends MongoRepository<DiseaseHistory, String> {

    Page<DiseaseHistory> findByPatientIdOrderByDiagnosisDateDesc(String patientId, Pageable pageable);

    List<DiseaseHistory> findByPatientIdAndStatus(String patientId, String status);

    List<DiseaseHistory> findByPatientIdAndIsChronicTrue(String patientId);

    Optional<DiseaseHistory> findByIdAndPatientId(String id, String patientId);

    boolean existsByIdAndPatientId(String diseaseId, String patientId);

    List<DiseaseHistory> findByPatientId(String patientId);
}
