package com.aarogya.pharmacy_service.documents;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "carts")
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

