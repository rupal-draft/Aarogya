package com.aarogya.prescription_service.repository;

import com.aarogya.prescription_service.model.PrescriptionHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PrescriptionHistoryRepository extends MongoRepository<PrescriptionHistory, String> {

    Page<PrescriptionHistory> findByPrescriptionIdOrderByTimestampDesc(String prescriptionId, Pageable pageable);

    List<PrescriptionHistory> findByPatientIdOrderByTimestampDesc(String patientId);

    List<PrescriptionHistory> findByDoctorIdOrderByTimestampDesc(String doctorId);

    List<PrescriptionHistory> findByAction(String action);

    @Query("{ 'timestamp': { $gte: ?0, $lte: ?1 } }")
    List<PrescriptionHistory> findByTimestampBetween(LocalDateTime startDate, LocalDateTime endDate);

    @Query("{ 'prescriptionId': ?0, 'action': ?1 }")
    List<PrescriptionHistory> findByPrescriptionIdAndAction(String prescriptionId, String action);

    long countByPrescriptionId(String prescriptionId);
}
