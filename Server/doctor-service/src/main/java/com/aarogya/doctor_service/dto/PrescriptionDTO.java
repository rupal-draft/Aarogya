package com.aarogya.doctor_service.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionDTO {
    private String id;
    private String appointmentId;
    private String doctorId;
    private String patientId;
    private String diagnosis;
    private String notes;
    private List<PrescriptionMedicineDTO> medicines;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
