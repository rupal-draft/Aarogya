package com.aarogya.email_service.exceptions;

public class EventKafkaException extends EventProcessingException {
    public EventKafkaException(String message, String eventType, String eventId, String topic) {
        super(message, "EVENT_KAFKA_001", eventType, eventId);
    }

    public EventKafkaException(String message, String eventType, String eventId, String topic, Throwable cause) {
        super(message, "EVENT_KAFKA_002", eventType, eventId, cause);
    }
}