package com.aarogya.pharmacy_service.dto.cart;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartCreationDTO {

    @NotNull(message = "Patient Id is required")
    private String patientId;

    @NotEmpty(message = "Items are required")
    private List<CartItemDTO> items;
}
