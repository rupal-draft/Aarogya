package com.aarogya.notification_service.dto;

import appointment_service.events.enums.AppointmentStatus;
import appointment_service.events.enums.FollowUpStatus;
import appointment_service.events.enums.NotificationType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class AppointmentNotificationDto {
    private String id;
    private String userId;

    private String appointmentId;

    private String title;
    private String doctorName;
    private String patientName;
    private String doctorImageUrl;
    private String patientImageUrl;
    private LocalDate appointmentDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private AppointmentStatus status;
    private FollowUpStatus followUpStatus;
    private AppointmentStatus previousStatus;
    private String meetingLink;
    private String reason;
    private String notes;

    private NotificationType type;

    private boolean read;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
