package com.aarogya.prescription_service.model;

import com.aarogya.prescription_service.model.enums.PrescriptionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "prescriptions")
public class Prescription {

    @Id
    private String id;

    @Indexed
    private String appointmentId;

    @Indexed
    private String doctorId;

    @Indexed
    private String patientId;

    private String diagnosis;
    private String notes;
    private PrescriptionStatus status = PrescriptionStatus.ACTIVE;

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

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    private String patientFirstName;
    private String patientLastName;
    private String patientAge;
    private String patientGender;

    private String doctorFirstName;
    private String doctorLastName;
    private String doctorSpecialization;
    private String doctorLicenseNumber;
}
