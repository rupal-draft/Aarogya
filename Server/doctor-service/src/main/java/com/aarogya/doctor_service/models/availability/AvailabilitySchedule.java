package com.aarogya.doctor_service.models.availability;

import com.aarogya.doctor_service.enums.availability.DayOfWeek;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "availability_schedules")
@CompoundIndex(def = "{'doctorId': 1, 'isActive': 1}", unique = true)
public class AvailabilitySchedule {
    @Id
    private String id;

    @NotBlank
    @Indexed(unique = true)
    private String doctorId;

    @NotNull
    @Builder.Default
    private Map<DayOfWeek, DailySchedule> weeklySchedule = Map.of();

    @NotNull
    @Builder.Default
    private List<RecurringUnavailability> recurringUnavailability = List.of();

    @NotNull
    @Builder.Default
    private Integer defaultSlotDurationMinutes = 30;

    @NotNull
    @Builder.Default
    private Integer defaultMaxPatientsPerSlot = 1;

    @NotNull
    @Builder.Default
    private Integer bookingLeadTimeHours = 24;

    @NotNull
    @Builder.Default
    private Integer maxBookingDaysInAdvance = 90;

    @NotNull
    @Builder.Default
    private Integer minCancellationNoticeHours = 2;

    @Builder.Default
    private Boolean isActive = true;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Version
    private Long version;
}

