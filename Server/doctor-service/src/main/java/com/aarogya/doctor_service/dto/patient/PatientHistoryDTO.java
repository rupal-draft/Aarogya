package com.aarogya.doctor_service.dto.patient;

import com.aarogya.doctor_service.dto.prescription.PrescriptionDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientHistoryDTO {
    private List<AppointmentDTO> appointments;
    private List<PrescriptionDTO> prescriptions;
    private PatientDTO patient;
}
