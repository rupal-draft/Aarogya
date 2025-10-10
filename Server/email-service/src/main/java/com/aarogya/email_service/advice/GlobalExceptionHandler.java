package com.aarogya.email_service.advice;

import com.aarogya.email_service.exceptions.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(EventProcessingException.class)
    public ResponseEntity<ErrorResponse> handleEventProcessingException(EventProcessingException ex) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .errorCode(ex.getErrorCode())
                .message(ex.getMessage())
                .timestamp(ex.getTimestamp())
                .details(buildErrorDetails(ex))
                .build();

        HttpStatus status = determineHttpStatus(ex);
        logErrorBasedOnType(ex, status);

        return ResponseEntity.status(status).body(errorResponse);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        log.error("Unexpected error occurred: {}", ex.getMessage(), ex);

        ErrorResponse errorResponse = ErrorResponse.builder()
                .errorCode("UNKNOWN_ERROR_001")
                .message("An unexpected error occurred")
                .timestamp(Instant.now())
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    private HttpStatus determineHttpStatus(EventProcessingException ex) {
        if (ex instanceof EventValidationException) {
            return HttpStatus.BAD_REQUEST;
        } else if (ex instanceof EventEmailException || ex instanceof EventEmailTemplateException) {
            return HttpStatus.INTERNAL_SERVER_ERROR;
        } else if (ex instanceof EventKafkaException) {
            return HttpStatus.SERVICE_UNAVAILABLE;
        } else {
            return HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }

    private void logErrorBasedOnType(EventProcessingException ex, HttpStatus status) {
        if (status.is4xxClientError()) {
            log.warn("Client error for {} event {}: {}", ex.getEventType(), ex.getEventId(), ex.getMessage());
        } else {
            log.error("Server error for {} event {}: {}", ex.getEventType(), ex.getEventId(), ex.getMessage(), ex);
        }
    }

    private Map<String, Object> buildErrorDetails(EventProcessingException ex) {
        Map<String, Object> details = new HashMap<>();
        details.put("eventType", ex.getEventType());
        details.put("eventId", ex.getEventId());
        details.put("timestamp", ex.getTimestamp().toString());

        switch (ex) {
            case EventValidationException validationEx -> {
                details.put("fieldName", validationEx.getFieldName());
                details.put("invalidValue", validationEx.getInvalidValue());
            }
            case EventEmailException eventEmailException -> details.put("errorCategory", "EMAIL_SENDING");
            case EventEmailTemplateException eventEmailTemplateException ->
                    details.put("errorCategory", "TEMPLATE_PROCESSING");
            case EventKafkaException eventKafkaException -> details.put("errorCategory", "KAFKA_PROCESSING");
            default -> {
            }
        }

        return details;
    }
}
