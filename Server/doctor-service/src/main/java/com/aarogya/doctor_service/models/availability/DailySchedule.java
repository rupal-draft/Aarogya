package com.aarogya.doctor_service.models.availability;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailySchedule {
    @NotNull
    @Builder.Default
    private Boolean isAvailable = true;

    private String reasonForUnavailability;

    @NotNull
    @Builder.Default
    private List<TimeRange> availableSlots = List.of();

    @Builder.Default
    private Integer slotDurationMinutes = 30;

    @Builder.Default
    private Integer maxPatientsPerSlot = 1;
}
