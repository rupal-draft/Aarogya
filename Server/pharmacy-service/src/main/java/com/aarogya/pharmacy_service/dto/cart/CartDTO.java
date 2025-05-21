package com.aarogya.pharmacy_service.dto.cart;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartDTO {
    private String id;
    private String patientId;
    private List<CartItemDTO> items;
    private BigDecimal totalAmount;
}
