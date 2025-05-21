package com.aarogya.pharmacy_service.documents;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "carts")
@CompoundIndex(def = "{'patientId': 1}", unique = true)
public class Cart {

    @Id
    private String id;

    @NotBlank(message = "Patient ID is required")
    @Indexed(unique = true)
    private String patientId;

    private List<CartItem> items;

    @Indexed
    private LocalDateTime lastUpdated;
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class CartItem {
    @NotBlank(message = "Medicine ID is required")
    private String medicineId;

    @NotBlank(message = "Medicine name is required")
    private String medicineName;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    @NotNull(message = "Price is required")
    private BigDecimal price;
}
