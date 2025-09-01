package com.aarogya.doctor_service.models.availability;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimeSlot {
    @NotNull
    private LocalTime startTime;

    @NotNull
    private LocalTime endTime;

    @Builder.Default
    private Integer bookedCount = 0;

    @Builder.Default
    private Integer availableSlots = 1;

    @Builder.Default
    private Boolean isAvailable = true;

    private String reasonForUnavailability;

    public TimeSlot(LocalTime startTime, LocalTime endTime) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.bookedCount = 0;
        this.availableSlots = 1;
        this.isAvailable = true;
    }
}

