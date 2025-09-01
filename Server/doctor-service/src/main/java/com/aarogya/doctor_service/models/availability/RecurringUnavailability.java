package com.aarogya.doctor_service.models.availability;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "recurring_unavailability")
@CompoundIndex(def = "{'doctorId': 1, 'isActive': 1}")
public class RecurringUnavailability {
    @Id
    private String id;

    @NotBlank
    private String doctorId;

    @NotBlank
    private String title;

    private String description;

    @NotNull
    private RecurrencePattern recurrencePattern;

    @NotNull
    private TimeRange timeRange;

    @Builder.Default
    private Boolean isAllDay = false;

    @Builder.Default
    private Boolean isActive = true;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}

