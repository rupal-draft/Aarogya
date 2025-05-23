package com.aarogya.doctor_service.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyMetricsDTO {
    private LocalDate date;
    private Integer appointmentsCompleted;
    private Integer appointmentsCancelled;
    private Double averageRating;
    private Integer ratingsReceived;
}
