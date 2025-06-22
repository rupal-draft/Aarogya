package com.aarogya.notification_service.model.notifications;

import com.aarogya.notification_service.model.BaseNotification;
import lombok.*;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Document(collection = "appointment_notifications")
public class AppointmentNotification extends BaseNotification {
    @Indexed
    private String appointmentId;

    private String doctorName;
    private String patientName;
    private String doctorImage;
    private String patientImage;

    @Indexed
    private LocalDate appointmentDate;

    private LocalTime startTime;
    private LocalTime endTime;
    private String appointmentStatus;
    private String previousStatus;
    private String meetingLink;
    private String reason;
    private String notes;

    private String followUpId;
    private String originalAppointmentId;
    private LocalDate recommendedDate;
    private String followUpStatus;
    private Integer urgencyLevel;
}
