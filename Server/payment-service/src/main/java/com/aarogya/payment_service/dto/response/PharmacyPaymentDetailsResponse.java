package com.aarogya.payment_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PharmacyPaymentDetailsResponse {
    private String paymentId;
    private String orderId;
    private String patientId;
    private String patientName;
    private BigDecimal amount;
    private String currency;
    private String status;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String failureReason;
    private LocalDateTime createdAt;
    private LocalDateTime paidAt;
    private LocalDateTime updatedAt;
}
