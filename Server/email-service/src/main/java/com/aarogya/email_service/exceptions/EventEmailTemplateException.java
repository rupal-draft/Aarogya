package com.aarogya.email_service.exceptions;

public class EventEmailTemplateException extends EventProcessingException {
    public EventEmailTemplateException(String message, String eventType, String eventId, String templateName) {
        super(message, "EVENT_TEMPLATE_001", eventType, eventId);
    }

    public EventEmailTemplateException(String message, String eventType, String eventId, String templateName, Throwable cause) {
        super(message, "EVENT_TEMPLATE_002", eventType, eventId, cause);
    }
}
