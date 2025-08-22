package com.aarogya.lab_service.repository;

import com.aarogya.lab_service.models.LabResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LabResultRepository extends MongoRepository<LabResult, String> {

    Optional<LabResult> findByOrderIdAndTestId(String orderId, String testId);

    List<LabResult> findByOrderId(String orderId);

    Page<LabResult> findByPatientIdOrderByResultGeneratedAtDesc(String patientId, Pageable pageable);

    @Query("{'doctorId': ?0, 'isVerified': true}")
    Page<LabResult> findByDoctorIdAndIsVerifiedTrue(String doctorId, Pageable pageable);

    @Query("{'patientId': ?0, 'resultGeneratedAt': {'$gte': ?1, '$lte': ?2}}")
    List<LabResult> findByPatientIdAndResultGeneratedAtBetween(String patientId, LocalDateTime startDate, LocalDateTime endDate);

    @Query("{'isCritical': true, 'isDoctorNotified': false}")
    List<LabResult> findCriticalResultsNotNotified();

    @Query("{'patientId': ?0, 'overallResult': ?1}")
    List<LabResult> findByPatientIdAndOverallResult(String patientId, String overallResult);

    long countByPatientIdAndOverallResult(String patientId, String overallResult);

    Page<LabResult> findByIsVerifiedFalse(Pageable pageable);

    @Query("{'labTechnicianId': ?0, 'isVerified': false}")
    List<LabResult> findByLabTechnicianIdAndIsVerifiedFalse(String technicianId);
}
