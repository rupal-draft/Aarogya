package com.aarogya.appointment_service.dto.grpc;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentCountByDateDto {
    private LocalDate date;
    private Long count;
}
