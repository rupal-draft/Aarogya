package com.aarogya.doctor_service.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "doctor_ratings")
@CompoundIndex(name = "doctor_patient_appointment_idx", def = "{'doctorId': 1, 'patientId': 1, 'appointmentId': 1}", unique = true)
public class DoctorRating {

    @Id
    private String id;

    private String doctorId;
    private String patientId;
    private String appointmentId;
    private Integer rating;
    private String review;

    @CreatedDate
    private LocalDateTime createdAt;
}
