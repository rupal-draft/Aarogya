package com.aarogya.email_service.exceptions;

import lombok.Getter;

import java.time.Instant;

@Getter
public class EventProcessingException extends RuntimeException {
    private final String errorCode;
    private final String eventType;
    private final String eventId;
    private final Instant timestamp;

    public EventProcessingException(String message, String errorCode, String eventType, String eventId) {
        super(message);
        this.errorCode = errorCode;
        this.eventType = eventType;
        this.eventId = eventId;
        this.timestamp = Instant.now();
    }

    public EventProcessingException(String message, String errorCode, String eventType, String eventId, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.eventType = eventType;
        this.eventId = eventId;
        this.timestamp = Instant.now();
    }

}
