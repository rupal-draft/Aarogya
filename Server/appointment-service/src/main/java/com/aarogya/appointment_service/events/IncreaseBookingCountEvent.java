package com.aarogya.appointment_service.events;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncreaseBookingCountEvent {
    private String doctorId;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
}
