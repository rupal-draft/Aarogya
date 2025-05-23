package com.aarogya.doctor_service.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "doctor_metrics")
public class DoctorMetrics {

    @Id
    private String id;

    @Indexed
    private String doctorId;

    private LocalDate date;

    private Integer appointmentsCompleted;
    private Integer appointmentsCancelled;
    private Integer newPatients;
    private Integer returningPatients;
    private Double averageConsultationTime;
    private Double averageWaitTime;
    private Integer prescriptionsIssued;

    private Map<Integer, Integer> appointmentsByHour;

    private Map<String, Integer> patientsByGender;
    private Map<String, Integer> patientsByAgeGroup;

    private Integer ratingsReceived;
    private Double averageRating;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
