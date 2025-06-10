package com.aarogya.doctor_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoctorMetricsDTO {
    private String id;

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

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
