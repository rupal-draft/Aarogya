package com.aarogya.appointment_service.events;

import com.aarogya.appointment_service.models.enums.AppointmentStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentNotificationData {
    private String appointmentId;
    private String doctorName;
    private String patientName;
    private LocalDate appointmentDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private AppointmentStatus status;
    private AppointmentStatus previousStatus;
    private String meetingLink;
    private String reason;
    private String notes;
}
