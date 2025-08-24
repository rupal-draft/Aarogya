package com.aarogya.patient_management_service.repository;

import com.aarogya.patient_management_service.model.EmergencyContact;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface EmergencyContactRepository extends MongoRepository<EmergencyContact, String> {

    List<EmergencyContact> findByPatientIdAndIsActiveTrueOrderByIsPrimaryDescContactNameAsc(String patientId);

    Optional<EmergencyContact> findByIdAndPatientId(String id, String patientId);

    Optional<EmergencyContact> findByPatientIdAndIsPrimaryTrueAndIsActiveTrue(String patientId);

    List<EmergencyContact> findByPatientIdAndRelationship(String patientId, String relationship);

    boolean existsByPatientIdAndContactNameAndIsActiveTrue(String patientId, String contactName);

    int countByPatientIdAndIsActiveTrue(String patientId);
}
