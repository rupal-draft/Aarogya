package com.aarogya.lab_service.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LabOrderConfirmationEvent {
    private String orderId;
    private String orderNumber;

    private String patientId;
    private String patientName;
    private String patientEmail;

    private String doctorId;
    private String doctorName;
    private String doctorEmail;

    private List<TestItem> tests;

    private BigDecimal totalAmount;
    private LocalDateTime scheduledDateTime;
    private String location;
    private String specialInstructions;

    private String orderStatus;
    private String paymentStatus;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TestItem {
        private String testId;
        private String testName;
        private BigDecimal price;
    }
}
