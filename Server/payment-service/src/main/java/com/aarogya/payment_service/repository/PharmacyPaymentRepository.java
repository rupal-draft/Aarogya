package com.aarogya.payment_service.repository;

import com.aarogya.payment_service.models.PharmacyPayment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PharmacyPaymentRepository extends MongoRepository<PharmacyPayment, String> {

    Optional<PharmacyPayment> findByRazorpayOrderId(String razorpayOrderId);

    Optional<PharmacyPayment> findByRazorpayPaymentId(String razorpayPaymentId);

    Optional<PharmacyPayment> findByOrderId(String orderId);

    List<PharmacyPayment> findByOrderIdAndStatus(String orderId, String status);

    List<PharmacyPayment> findByPatientId(String patientId);

    @Query("{'createdAt': {$gte: ?0, $lte: ?1}}")
    List<PharmacyPayment> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    Long countByStatus(String status);
}
