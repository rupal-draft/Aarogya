package com.aarogya.doctor_service.dto.grpc.appointment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoctorPatientAppointmentStats {
    private AppointmentStatsDto appointmentStatsDto;
    private PatientStatsDto patientStatsDto;
}
