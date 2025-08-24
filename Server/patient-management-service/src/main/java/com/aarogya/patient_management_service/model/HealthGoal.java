package com.aarogya.patient_management_service.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "health_goals")
public class HealthGoal {

    @Id
    private String id;

    @Indexed
    @NotBlank(message = "Patient ID is required")
    private String patientId;

    @NotBlank(message = "Goal type is required")
    private String goalType;

    @NotBlank(message = "Goal description is required")
    private String description;

    private BigDecimal targetValue;

    private BigDecimal currentValue;

    private String unit;

    @NotNull(message = "Target date is required")
    private LocalDate targetDate;

    @Indexed
    @Builder.Default
    private String status = "ACTIVE";

    private String notes;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
