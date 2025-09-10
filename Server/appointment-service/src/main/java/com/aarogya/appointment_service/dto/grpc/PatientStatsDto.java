package com.aarogya.appointment_service.dto.grpc;

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

    private long activePatientsThisMonth;
    private long patientsWithFollowUps;
    private long patientsWithMultipleVisitsThisMonth;
    private double averageVisitsPerPatient;
}
