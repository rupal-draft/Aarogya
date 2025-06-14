package com.aarogya.prescription_service.repository;

import com.aarogya.prescription_service.model.Prescription;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PrescriptionRepository extends MongoRepository<Prescription, String> {

    Page<Prescription> findByDoctorIdOrderByCreatedAtDesc(String doctorId, Pageable pageable);

    Page<Prescription> findByPatientIdOrderByCreatedAtDesc(String patientId, Pageable pageable);

    List<Prescription> findByAppointmentId(String appointmentId);

    Optional<Prescription> findByPrescriptionNumber(String prescriptionNumber);

    List<Prescription> findByDoctorIdAndPatientIdOrderByCreatedAtDesc(String doctorId, String patientId);

    @Query("{ 'doctorId': ?0, 'createdAt': { $gte: ?1, $lte: ?2 } }")
    List<Prescription> findByDoctorIdAndDateRange(String doctorId, LocalDateTime startDate, LocalDateTime endDate);

    @Query("{ 'patientId': ?0, 'createdAt': { $gte: ?1, $lte: ?2 } }")
    List<Prescription> findByPatientIdAndDateRange(String patientId, LocalDateTime startDate, LocalDateTime endDate);

    @Query("{ 'status': ?0, 'validUntil': { $lt: ?1 } }")
    List<Prescription> findExpiredPrescriptions(String status, LocalDateTime currentDate);

    @Query("{ 'nextFollowUp': { $gte: ?0, $lte: ?1 } }")
    List<Prescription> findPrescriptionsWithFollowUpDue(LocalDateTime startDate, LocalDateTime endDate);

    long countByDoctorIdAndCreatedAtBetween(String doctorId, LocalDateTime startDate, LocalDateTime endDate);

    long countByPatientIdAndCreatedAtBetween(String patientId, LocalDateTime startDate, LocalDateTime endDate);

    @Aggregation(pipeline = {
            "{ $match: { doctorId: ?0, createdAt: { $gte: ?1, $lte: ?2 } } }",
            "{ $group: { " +
                    "_id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, " +
                    "count: { $sum: 1 } " +
                    "} }",
            "{ $sort: { _id: 1 } }"
    })
    List<DailyPrescriptionCount> getDailyPrescriptionCounts(String doctorId, LocalDateTime startDate, LocalDateTime endDate);

    interface DailyPrescriptionCount {
        String getId();
        Integer getCount();
    }

    @Aggregation(pipeline = {
            "{ $match: { doctorId: ?0, createdAt: { $gte: ?1, $lte: ?2 } } }",
            "{ $group: { " +
                    "_id: '$diagnosis', " +
                    "count: { $sum: 1 } " +
                    "} }",
            "{ $sort: { count: -1 } }",
            "{ $limit: 10 }"
    })
    List<DiagnosisCount> getTopDiagnoses(String doctorId, LocalDateTime startDate, LocalDateTime endDate);

    interface DiagnosisCount {
        String getId();
        Integer getCount();
    }

    @Query("{ 'refillsAllowed': { $gt: '$refillsUsed' }, 'status': 'ACTIVE' }")
    List<Prescription> findPrescriptionsWithRefillsAvailable();

    @Query("{ 'isElectronic': true, 'pharmacyId': ?0 }")
    List<Prescription> findElectronicPrescriptionsByPharmacy(String pharmacyId);
}
