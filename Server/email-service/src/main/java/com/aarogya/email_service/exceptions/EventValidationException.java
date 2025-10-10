package com.aarogya.email_service.exceptions;

import lombok.Getter;

@Getter
public class EventValidationException extends OtpServiceException {

    private final String eventType;
    private final Object invalidEvent;

    public EventValidationException(String eventType, Object invalidEvent, String validationMessage) {
        super(String.format("Event validation failed for %s: %s", eventType, validationMessage),
                "OTP_EVENT_001");
        this.eventType = eventType;
        this.invalidEvent = invalidEvent;
    }

    public EventValidationException(String eventType, Object invalidEvent, String validationMessage, Throwable cause) {
        super(String.format("Event validation failed for %s: %s", eventType, validationMessage),
                cause, "OTP_EVENT_002");
        this.eventType = eventType;
        this.invalidEvent = invalidEvent;
    }

}