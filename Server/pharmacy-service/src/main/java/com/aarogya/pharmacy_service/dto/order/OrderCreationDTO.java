package com.aarogya.pharmacy_service.dto.order;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderCreationDTO {
    @NotBlank
    private String patientId;

    @NotEmpty
    private List<OrderItemCreationDTO> items;

    @NotBlank
    private String shippingAddress;

    @NotBlank
    private String paymentMethod;
}
