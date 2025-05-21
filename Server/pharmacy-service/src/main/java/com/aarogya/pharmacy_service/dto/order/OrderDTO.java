package com.aarogya.pharmacy_service.dto.order;

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
public class OrderDTO {
    private String id;
    private String patientId;
    private String patientName;
    private List<OrderItemDTO> items;
    private BigDecimal totalAmount;
    private String status;
    private String shippingAddress;
    private String paymentMethod;
    private LocalDateTime orderDate;
    private LocalDateTime updatedAt;
}
