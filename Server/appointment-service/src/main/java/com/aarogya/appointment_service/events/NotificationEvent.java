package com.aarogya.appointment_service.events;

import com.aarogya.appointment_service.events.enums.NotificationType;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationEvent {
    private NotificationType type;
    private String recipientEmail;
    private String recipientName;
    private String subject;
    private Map<String, Object> data;
    private LocalDateTime timestamp;
}
