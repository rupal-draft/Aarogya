package com.aarogya.pharmacy_service.documents;

import com.aarogya.pharmacy_service.documents.enums.OrderStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
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
@Document(collection = "orders")
@CompoundIndex(def = "{'status': 1}", unique = true)
public class Order {


    @Id
    private String id;

    @NotBlank(message = "Patient ID is required")
    @Indexed
    private String patientId;

    @NotEmpty(message = "Order items cannot be empty")
    private List<OrderItem> items;

    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.01", message = "Total amount must be greater than 0")
    private BigDecimal totalAmount;

    @NotNull(message = "Order status is required")
    private OrderStatus status;

    private String shippingAddress;

    private String paymentMethod;

    @Indexed
    private LocalDateTime orderDate;

    @Indexed
    private LocalDateTime updatedAt;

    @Version
    private Long version;
}

