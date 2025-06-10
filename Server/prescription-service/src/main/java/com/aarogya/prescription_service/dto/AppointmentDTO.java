package com.aarogya.prescription_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentDTO {
    private String id;
    private LocalDate appointmentDate;
    private String reason;
    private List<String> symptoms;
    private String notes;
    private String doctorNotes;
    private Integer priority;
    private DoctorResponseDTO doctor;
    private PatientResponseDTO patientDetails;
}
