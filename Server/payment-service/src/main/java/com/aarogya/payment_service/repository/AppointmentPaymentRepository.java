package com.aarogya.payment_service.repository;

import com.aarogya.payment_service.models.AppointmentPayment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentPaymentRepository extends MongoRepository<AppointmentPayment, String> {

    Optional<AppointmentPayment> findByRazorpayOrderId(String razorpayOrderId);

    Optional<AppointmentPayment> findByRazorpayPaymentId(String razorpayPaymentId);

    Optional<AppointmentPayment> findByAppointmentId(String appointmentId);

    List<AppointmentPayment> findByAppointmentIdAndStatus(String appointmentId, String status);

    List<AppointmentPayment> findByPatientId(String patientId);

    List<AppointmentPayment> findByDoctorId(String doctorId);

    @Query("{'createdAt': {$gte: ?0, $lte: ?1}}")
    List<AppointmentPayment> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    Long countByStatus(String status);
}
