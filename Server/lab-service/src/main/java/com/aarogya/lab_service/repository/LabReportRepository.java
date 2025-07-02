package com.aarogya.lab_service.repository;

import com.aarogya.lab_service.enums.ReportStatus;
import com.aarogya.lab_service.model.LabReport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LabReportRepository extends MongoRepository<LabReport, String> {

    Page<LabReport> findByPatientIdOrderByReportDateDesc(String patientId, Pageable pageable);

    Page<LabReport> findByDoctorIdOrderByReportDateDesc(String doctorId, Pageable pageable);

    Page<LabReport> findByStatusOrderByReportDateDesc(ReportStatus status, Pageable pageable);

    Optional<LabReport> findByOrderId(String orderId);

    Optional<LabReport> findByReportNumber(String reportNumber);

    List<LabReport> findByReportDateBetweenOrderByReportDateDesc(LocalDateTime startDate, LocalDateTime endDate);

    @Query("{ 'status': { $in: ['DRAFT', 'PENDING_REVIEW'] } }")
    List<LabReport> findPendingReports();

    @Query("{ 'criticalValues': { $exists: true, $ne: [] } }")
    List<LabReport> findReportsWithCriticalValues();

    long countByStatus(ReportStatus status);

    long countByPatientId(String patientId);
}
