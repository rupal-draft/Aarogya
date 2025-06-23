package com.aarogya.email_service.exceptions;

public class TemplateProcessingException extends RuntimeException {
    public TemplateProcessingException(String message, Throwable cause) {
        super(message, cause);
    }
}
