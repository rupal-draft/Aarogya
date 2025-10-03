package com.aarogya.lab_service.models;

import com.aarogya.lab_service.enums.OrderStatus;
import com.aarogya.lab_service.enums.PaymentStatus;
import com.aarogya.lab_service.enums.TestStatus;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "lab_orders")
public class LabOrder {
    @Id
    private String id;

    private String orderNumber;

    @Indexed
    private String patientId;

    @Indexed
    private String doctorId;

    private List<OrderedTest> orderedTests;
    private BigDecimal totalAmount;

    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING_PAYMENT;

    private PaymentStatus paymentStatus;

    @Builder.Default
    private String paymentId = "Not paid yet";

    private LocalDateTime scheduledDateTime;
    private String location;
    private String specialInstructions;
    private String cancellationReason;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class OrderedTest {
        private String testId;
        private String testCode;
        private String testName;
        private BigDecimal price;
        private TestStatus status = TestStatus.ORDERED;
        private LocalDateTime sampleCollectedAt;
        private LocalDateTime resultExpectedAt;
    }
}
