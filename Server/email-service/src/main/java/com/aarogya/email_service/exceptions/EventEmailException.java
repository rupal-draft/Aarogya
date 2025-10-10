package com.aarogya.email_service.exceptions;

public class EventEmailException extends EventProcessingException {
    public EventEmailException(String message, String eventType, String eventId, String email) {
        super(message, "EVENT_EMAIL_001", eventType, eventId);
    }

    public EventEmailException(String message, String eventType, String eventId, String email, Throwable cause) {
        super(message, "EVENT_EMAIL_002", eventType, eventId, cause);
    }
}
