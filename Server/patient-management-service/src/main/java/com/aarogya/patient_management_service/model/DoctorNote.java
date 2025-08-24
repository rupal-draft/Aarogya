package com.aarogya.patient_management_service.model;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "doctor_notes")
public class DoctorNote {

    @Id
    private String id;

    @NotBlank(message = "Patient ID is required")
    private String patientId;

    @NotBlank(message = "Doctor ID is required")
    private String doctorId;

    private String appointmentId;

    @NotBlank(message = "Note type is required")
    private String noteType;

    @NotBlank(message = "Notes are required")
    private String notes;

    private String priority;

    private boolean isPrivate;

    @CreatedDate
    private LocalDateTime createdAt;
}
