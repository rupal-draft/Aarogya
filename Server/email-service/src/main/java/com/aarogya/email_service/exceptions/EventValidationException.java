package com.aarogya.email_service.exceptions;

import lombok.Getter;

@Getter
public class EventValidationException extends EventProcessingException {
    private final String fieldName;
    private final Object invalidValue;

    public EventValidationException(String message, String eventType, String eventId, String fieldName, Object invalidValue) {
        super(message, "EVENT_VALIDATION_001", eventType, eventId);
        this.fieldName = fieldName;
        this.invalidValue = invalidValue;
    }

    public EventValidationException(String message, String eventType, String eventId, String fieldName, Object invalidValue, Throwable cause) {
        super(message, "EVENT_VALIDATION_002", eventType, eventId, cause);
        this.fieldName = fieldName;
        this.invalidValue = invalidValue;
    }

}
