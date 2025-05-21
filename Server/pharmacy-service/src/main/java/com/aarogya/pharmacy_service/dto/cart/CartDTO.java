package com.aarogya.pharmacy_service.dto.cart;

import com.aarogya.pharmacy_service.dto.patient.UserResponseDto;
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
    private UserResponseDto patient;
    private List<CartItemDTO> items;
    private BigDecimal totalAmount;
}
