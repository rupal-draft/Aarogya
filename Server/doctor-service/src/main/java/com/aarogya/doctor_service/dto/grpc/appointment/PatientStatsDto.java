package com.aarogya.doctor_service.dto.grpc.appointment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PatientStatsDto {
    private long totalPatients;
    private long newPatientsThisMonth;
    private long returningPatients;
}
