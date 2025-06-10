package com.aarogya.appointment_service.events;

import com.aarogya.appointment_service.events.enums.NotificationType;

import java.time.LocalDateTime;
import java.util.Map;

public class NotificationEvent {
    private NotificationType type;
    private String recipientEmail;
    private String recipientName;
    private String subject;
    private Map<String, Object> data;
    private LocalDateTime timestamp;

    public NotificationEvent() {
    }

    public NotificationEvent(NotificationType type, String recipientEmail, String recipientName, String subject, Map<String, Object> data, LocalDateTime timestamp) {
        this.type = type;
        this.recipientEmail = recipientEmail;
        this.recipientName = recipientName;
        this.subject = subject;
        this.data = data;
        this.timestamp = timestamp;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public Map<String, Object> getData() {
        return data;
    }

    public void setData(Map<String, Object> data) {
        this.data = data;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
