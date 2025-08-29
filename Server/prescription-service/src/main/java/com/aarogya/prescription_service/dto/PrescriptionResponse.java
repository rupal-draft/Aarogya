package com.aarogya.prescription_service.dto;

import com.aarogya.prescription_service.enums.PrescriptionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionResponse {
    private String id;
    private String appointmentId;
    private String patientId;
    private String doctorId;
    private String diagnosis;
    private String notes;
    private List<PrescribedMedicineResponse> medicines;
    private PrescriptionStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
