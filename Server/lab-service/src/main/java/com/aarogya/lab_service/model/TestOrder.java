package com.aarogya.lab_service.model;

import com.aarogya.lab_service.enums.OrderPriority;
import com.aarogya.lab_service.enums.OrderStatus;
import com.aarogya.lab_service.enums.PaymentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Document(collection = "test_orders")
@CompoundIndexes({
        @CompoundIndex(name = "patient_date_idx", def = "{'patientId': 1, 'orderDate': -1}"),
        @CompoundIndex(name = "doctor_date_idx", def = "{'doctorId': 1, 'orderDate': -1}"),
        @CompoundIndex(name = "status_priority_idx", def = "{'status': 1, 'priority': -1}")
})
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TestOrder {

    @Id
    private String id;

    @NotNull
    @Indexed
    private String patientId;

    @NotNull
    @Indexed
    private String doctorId;

    @NotNull
    private List<String> testIds;

    private OrderStatus status = OrderStatus.PENDING;

    private OrderPriority priority = OrderPriority.ROUTINE;

    private LocalDateTime orderDate;

    private LocalDateTime expectedCompletionDate;

    private String clinicalHistory;

    private String provisionalDiagnosis;

    private String specialInstructions;

    private BigDecimal totalAmount;

    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    private String paymentReference;

    private Boolean isHomeCollection = false;

    private String collectionAddress;

    private LocalDateTime preferredCollectionTime;

    private String patientInstructions;

    private Integer fastingHours;

    private Boolean testPreparationCompleted;

    private LocalDateTime estimatedResultTime;

    private Map<String, Object> additionalInfo;

    private String cancellationReason;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
