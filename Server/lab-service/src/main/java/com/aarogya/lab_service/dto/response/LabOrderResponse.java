package com.aarogya.lab_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LabOrderResponse {

    private String id;
    private String orderNumber;
    private String patientId;
    private String patientName;
    private String doctorId;
    private String doctorName;
    private List<OrderedTestResponse> orderedTests;
    private BigDecimal totalAmount;
    private LabOrder.OrderStatus status;
    private LabOrder.PaymentStatus paymentStatus;
    private String paymentId;
    private LocalDateTime scheduledDateTime;
    private String labLocation;
    private String specialInstructions;
    private String cancellationReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OrderedTestResponse {
        private String testId;
        private String testCode;
        private String testName;
        private BigDecimal price;
        private LabOrder.TestStatus status;
        private LocalDateTime sampleCollectedAt;
        private LocalDateTime resultExpectedAt;
    }
}
