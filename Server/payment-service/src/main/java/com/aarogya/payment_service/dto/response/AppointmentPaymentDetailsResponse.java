package com.aarogya.payment_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentPaymentDetailsResponse {
    private String paymentId;
    private String appointmentId;
    private String doctorId;
    private String patientId;
    private Double amount;
    private String currency;
    private String status;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String failureReason;
    private LocalDateTime createdAt;
    private LocalDateTime paidAt;
    private LocalDateTime updatedAt;
}
