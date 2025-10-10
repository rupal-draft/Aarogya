package com.aarogya.appointment_service.events;

import com.aarogya.appointment_service.enums.AppointmentStatus;
import com.aarogya.appointment_service.enums.AppointmentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AppointmentConfirmationEvent {
    private String appointmentId;
    private LocalDate appointmentDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private AppointmentType type;
    private Boolean isVirtual;
    private String meetingLink;
    private AppointmentStatus status;
    private Double consultationFee;
    private String currency;

    private String doctorId;
    private String doctorName;
    private String doctorSpecialization;
    private String doctorEmail;
    private String doctorImageUrl;

    private String patientId;
    private String patientName;
    private String patientEmail;
    private String patientGender;
    private LocalDate patientDob;
}
