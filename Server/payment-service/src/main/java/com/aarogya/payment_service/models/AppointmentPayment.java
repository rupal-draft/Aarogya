package com.aarogya.payment_service.models;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "appointment_payments")
@CompoundIndex(def = "{'appointmentId': 1, 'status': 1}")
@CompoundIndex(def = "{'razorpayOrderId': 1}", unique = true)
@CompoundIndex(def = "{'razorpayPaymentId': 1}", unique = true)
public class AppointmentPayment {
    @Id
    private String id;

    @NotBlank
    @Indexed
    private String appointmentId;

    @NotBlank
    private String doctorId;

    @NotBlank
    private String patientId;

    @NotNull
    @Positive
    private Double amount;

    @NotBlank
    private String currency;

    @NotBlank
    private String status;

    @NotBlank
    private String razorpayOrderId;

    private String razorpayPaymentId;
    private String razorpaySignature;

    private String failureReason;
    private String refundReason;

    private Map<String, Object> razorpayResponse;
    private Map<String, Object> webhookPayload;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    private LocalDateTime paidAt;
    private LocalDateTime refundedAt;

    @Version
    private Long version;
}
