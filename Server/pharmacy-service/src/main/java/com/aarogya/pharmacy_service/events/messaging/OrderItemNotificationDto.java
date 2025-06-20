package com.aarogya.pharmacy_service.events.messaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemNotificationDto {
    private String medicineId;
    private String medicineName;
    private String medicineImage;
    private Integer quantity;
    private BigDecimal price;
}
