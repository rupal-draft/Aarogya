package com.aarogya.prescription_service.repository;

import com.aarogya.prescription_service.enums.PrescriptionStatus;
import com.aarogya.prescription_service.model.Prescription;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PrescriptionRepository extends MongoRepository<Prescription, String> {

    Optional<Prescription> findByAppointmentId(String appointmentId);

    List<Prescription> findByPatientId(String patientId);

    List<Prescription> findByDoctorId(String doctorId);

    List<Prescription> findByPatientIdAndStatus(String patientId, PrescriptionStatus status);

    Page<Prescription> findByDoctorId(String doctorId, Pageable pageable);

    @Query("{'patientId': ?0, 'status': 'ACTIVE', 'createdAt': {$gte: ?1}}")
    List<Prescription> findActivePrescriptionsAfterDate(String patientId, LocalDateTime date);
}