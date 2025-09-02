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
public class AppointmentPaymentResponse {
    private String paymentId;
    private String appointmentId;
    private String razorpayOrderId;
    private String razorpayKey;
    private Double amount;
    private String currency;
    private String status;
    private LocalDateTime createdAt;
}

