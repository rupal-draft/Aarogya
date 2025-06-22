package com.aarogya.pharmacy_service.events.messaging;

import com.aarogya.pharmacy_service.events.enums.NotificationOrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderNotificationDto {
    private String orderId;
    private BigDecimal totalAmount;
    private NotificationOrderStatus status;
    private LocalDateTime orderDate;
    private List<OrderItemNotificationDto> orderItems;
}
