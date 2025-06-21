package com.aarogya.notification_service.exceptions;

public class NotificationProcessingException extends RuntimeException {

    public NotificationProcessingException(String message, Exception cause) {
        super(message, cause);
    }

    public NotificationProcessingException(String message) {
        super(message);
    }

    public NotificationProcessingException(Exception cause) {
        super(cause);
    }

    public NotificationProcessingException() {
        super("An error occurred while processing the notification.");
    }
}

