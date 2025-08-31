package com.aarogya.doctor_service.models.avaibility;

import com.aarogya.doctor_service.enums.avaibility.RecurrenceType;
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

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

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

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class RecurrencePattern {
    @NotNull
    private RecurrenceType type; // DAILY, WEEKLY, MONTHLY, YEARLY

    private Integer interval;

    private List<DayOfWeek> daysOfWeek;

    private Integer dayOfMonth;

    private Integer month;

    @NotNull
    private LocalDate startDate;

    private LocalDate endDate;

    @Builder.Default
    private Integer occurrenceCount = null;
}