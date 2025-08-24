package com.aarogya.patient_management_service.repository;

import com.aarogya.patient_management_service.model.PatientMedication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PatientMedicationRepository extends MongoRepository<PatientMedication, String> {

    Page<PatientMedicationRepository> findByPatientIdOrderByStartDateDesc(String patientId, Pageable pageable);

    List<PatientMedication> findByPatientIdAndStatus(String patientId, String status);

    @Query("{'patientId': ?0, 'medicationType': ?1}")
    List<PatientMedication> findByPatientIdAndMedicationType(String patientId, String medicationType);

    @Query("{'patientId': ?0, 'reminderEnabled': true, 'status': 'Active'}")
    List<PatientMedication> findActiveReminders(String patientId);

    @Query("{'patientId': ?0, 'endDate': {$gte: ?1}, 'status': 'Active'}")
    List<PatientMedication> findExpiringMedications(String patientId, LocalDate date);

    long countByPatientIdAndStatus(String patientId, String status);
}
