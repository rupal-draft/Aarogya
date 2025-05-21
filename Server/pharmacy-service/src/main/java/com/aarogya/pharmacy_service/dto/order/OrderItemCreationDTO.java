package com.aarogya.pharmacy_service.dto.order;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemCreationDTO {
    @NotBlank
    private String medicineId;

    @NotNull
    @Min(1)
    private Integer quantity;
}
