package com.aarogya.pharmacy_service.dto.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDTO {
    private String medicineId;
    private String medicineName;
    private Integer quantity;
    private BigDecimal price;
}
