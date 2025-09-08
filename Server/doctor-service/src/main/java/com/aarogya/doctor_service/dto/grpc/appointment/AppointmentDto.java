package com.aarogya.doctor_service.dto.grpc.appointment;

import com.aarogya.doctor_service.dto.grpc.auth.DoctorResponseDTO;
import com.aarogya.doctor_service.dto.grpc.auth.PatientResponseDTO;
import com.aarogya.doctor_service.enums.grpc.AppointmentStatus;
import com.aarogya.doctor_service.enums.grpc.AppointmentType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentDto {

    private String id;
    private LocalDate appointmentDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private AppointmentStatus status;
    private AppointmentType type;
    private String reason;
    private List<String> symptoms;
    private String notes;
    private String doctorNotes;
    private Integer priority;
    private String meetingLink;
    private Boolean isVirtual;
    private String cancellationReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private DoctorResponseDTO doctor;
    private PatientResponseDTO patientDetails;
}
