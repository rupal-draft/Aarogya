package com.aarogya.notification_service.model;

import appointment_service.events.enums.AppointmentStatus;
import appointment_service.events.enums.FollowUpStatus;
import appointment_service.events.enums.NotificationType;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Document(collection = "appointment_notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentNotification {
    @Id
    private String id;

    @Indexed
    private String userId;

    @Indexed
    private String appointmentId;

    private String title;
    private String doctorName;
    private String patientName;
    private String doctorImageUrl;
    private String patientImageUrl;
    private LocalDate appointmentDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private AppointmentStatus status = AppointmentStatus.PENDING;
    private FollowUpStatus followUpStatus = FollowUpStatus.PENDING;
    private AppointmentStatus previousStatus;
    private String meetingLink;
    private String reason;
    private String notes;

    @Indexed
    private NotificationType type;

    @Indexed
    private boolean read;

    @CreatedDate
    @Indexed(expireAfter = "30d")
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
