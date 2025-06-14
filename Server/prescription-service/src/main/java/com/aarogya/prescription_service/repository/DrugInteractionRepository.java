package com.aarogya.prescription_service.repository;

import com.aarogya.prescription_service.model.DrugInteraction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DrugInteractionRepository extends MongoRepository<DrugInteraction, String> {

    List<DrugInteraction> findByPatientIdAndStatus(String patientId, String status);

    List<DrugInteraction> findByPatientIdAndStatusAndSeverity(String patientId, String status, String severity);

    @Query("{ $or: [ { 'drug1': ?0, 'drug2': ?1 }, { 'drug1': ?1, 'drug2': ?0 } ] }")
    List<DrugInteraction> findByDrug1AndDrug2(String drug1, String drug2);

    List<DrugInteraction> findByPrescriptionId(String prescriptionId);

    @Query("{ 'detectedAt': { $gte: ?0, $lte: ?1 } }")
    List<DrugInteraction> findByDetectedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    long countByPatientIdAndStatus(String patientId, String status);

    long countBySeverityAndStatus(String severity, String status);
}
