package com.aarogya.payment_service.repository;

import com.aarogya.payment_service.models.LabPayment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LabPaymentRepository extends MongoRepository<LabPayment, String> {

    Optional<LabPayment> findByOrderId(String orderId);

    Optional<LabPayment> findByRazorpayOrderId(String razorpayOrderId);

    List<LabPayment> findByPatientIdAndStatus(String patientId, String status);

    List<LabPayment> findByStatusAndPaidAtBetween(String status, LocalDateTime startDate, LocalDateTime endDate);
}
