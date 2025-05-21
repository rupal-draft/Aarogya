package com.aarogya.pharmacy_service.dto.medicine;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicineStockUpdateDTO {
    @NotNull
    @Min(0)
    private Integer stockQuantity;
}
