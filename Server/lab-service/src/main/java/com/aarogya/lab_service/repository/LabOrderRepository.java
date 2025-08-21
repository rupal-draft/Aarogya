package com.aarogya.lab_service.repository;

import com.aarogya.lab_service.enums.OrderStatus;
import com.aarogya.lab_service.models.LabOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LabOrderRepository extends MongoRepository<LabOrder, String> {

    Optional<LabOrder> findByOrderNumber(String orderNumber);

    Page<LabOrder> findByPatientIdOrderByCreatedAtDesc(String patientId, Pageable pageable);

    @Query("{'doctorId': ?0, 'status': {'$ne': 'CANCELLED'}}")
    Page<LabOrder> findByDoctorIdAndStatusNotCancelled(String doctorId, Pageable pageable);

    List<LabOrder> findByPatientIdAndStatusIn(String patientId, List<OrderStatus> statuses);

    @Query("{'patientId': ?0, 'createdAt': {'$gte': ?1, '$lte': ?2}}")
    List<LabOrder> findByPatientIdAndCreatedAtBetween(String patientId, LocalDateTime startDate, LocalDateTime endDate);

    @Query("{'status': ?0, 'scheduledDateTime': {'$gte': ?1, '$lte': ?2}}")
    List<LabOrder> findByStatusAndScheduledDateTimeBetween(OrderStatus status, LocalDateTime startDate, LocalDateTime endDate);

    long countByPatientIdAndStatus(String patientId, OrderStatus status);
}
