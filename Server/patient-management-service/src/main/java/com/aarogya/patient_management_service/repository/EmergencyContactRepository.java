package com.aarogya.patient_management_service.repository;

import com.aarogya.patient_management_service.model.EmergencyContact;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmergencyContactRepository extends MongoRepository<EmergencyContact, String> {

    List<EmergencyContact> findByPatientIdAndIsActiveTrue(String patientId);

    Optional<EmergencyContact> findByPatientIdAndIsPrimaryTrue(String patientId);

    List<EmergencyContact> findByPatientIdOrderByIsPrimaryDescCreatedAtAsc(String patientId);

    long countByPatientIdAndIsActiveTrue(String patientId);
}
