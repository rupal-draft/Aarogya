package com.aarogya.notification_service.enums;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.STRING)
public enum NotificationType {
    APPOINTMENT_REQUEST,
    APPOINTMENT_STATUS_UPDATE,
    EMERGENCY_APPOINTMENT,
    FOLLOW_UP_SCHEDULED,
    FOLLOW_UP_STATUS_UPDATE,

    POST_CREATED,
    POST_LIKED,
    POST_COMMENTED,

    ORDER_CREATED,
    ORDER_STATUS_UPDATE
}
