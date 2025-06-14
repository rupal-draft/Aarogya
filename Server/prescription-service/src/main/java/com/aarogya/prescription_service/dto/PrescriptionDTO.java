package com.aarogya.prescription_service.dto;

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
public class PrescriptionDTO {

    private String id;
    private String appointmentId;
    private String doctorId;
    private String patientId;
    private String diagnosis;
    private String notes;
    private String status;

    private LocalDateTime validFrom;
    private LocalDateTime validUntil;

    private String followUpInstructions;
    private LocalDateTime nextFollowUp;

    private String emergencyContact;
    private String emergencyInstructions;

    private String prescriptionNumber;
    private boolean isElectronic;
    private String pharmacyId;
    private String insuranceInfo;

    private String digitalSignature;
    private boolean isVerified;

    private Integer refillsAllowed;
    private Integer refillsUsed;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String patientFirstName;
    private String patientLastName;
    private String patientAge;
    private String patientGender;

    private String doctorFirstName;
    private String doctorLastName;
    private String doctorSpecialization;
    private String doctorLicenseNumber;

    private List<PrescriptionMedicineDTO> medicines;
}
