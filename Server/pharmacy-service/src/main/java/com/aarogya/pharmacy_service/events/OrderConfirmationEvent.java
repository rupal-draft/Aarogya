package com.aarogya.pharmacy_service.events;

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
public class OrderConfirmationEvent {

    private String orderId;
    private String patientId;
    private String patientName;
    private String patientEmail;

    private BigDecimal totalAmount;
    private String paymentMethod;
    private String paymentId;
    private String shippingAddress;
    private LocalDateTime orderDate;
    private String orderStatus;

    private List<OrderItem> items;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItem {
        private String medicineId;
        private String medicineName;
        private String medicineImage;
        private Integer quantity;
        private BigDecimal price;
    }
}
