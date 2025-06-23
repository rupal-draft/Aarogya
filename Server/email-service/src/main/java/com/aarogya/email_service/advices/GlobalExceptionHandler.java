package com.aarogya.email_service.advices;

import com.aarogya.email_service.exceptions.EmailNotFoundException;
import com.aarogya.email_service.exceptions.EmailSendingException;
import com.aarogya.email_service.exceptions.RateLimitExceededException;
import com.aarogya.email_service.exceptions.TemplateProcessingException;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(EmailNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleEmailNotFoundException(EmailNotFoundException exception) {
        log.error("Email not found: {}", exception.getMessage());
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setStatus(HttpStatus.NOT_FOUND)
                .setMessage(exception.getLocalizedMessage())
                .build();
        return buildErrorResponseEntity(apiError);
    }

    @ExceptionHandler(EmailSendingException.class)
    public ResponseEntity<ApiResponse<?>> handleEmailSendingException (EmailSendingException exception) {
        log.error("Sending email failed: {}", exception.getMessage());
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setStatus(HttpStatus.FORBIDDEN)
                .setMessage(exception.getLocalizedMessage())
                .build();
        return buildErrorResponseEntity(apiError);
    }

    @ExceptionHandler(RateLimitExceededException.class)
    public ResponseEntity<ApiResponse<?>> handleRateLimitExceededException (RateLimitExceededException exception) {
        log.error("Rate limit exceeded: {}", exception.getMessage());
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setStatus(HttpStatus.FORBIDDEN)
                .setMessage(exception.getLocalizedMessage())
                .build();
        return buildErrorResponseEntity(apiError);
    }

    @ExceptionHandler(TemplateProcessingException.class)
    public ResponseEntity<ApiResponse<?>> handleTemplateProcessingException (TemplateProcessingException exception) {
        log.error("Template processing failed: {}", exception.getMessage());
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setStatus(HttpStatus.FORBIDDEN)
                .setMessage(exception.getLocalizedMessage())
                .build();
        return buildErrorResponseEntity(apiError);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<?>> handleMethodArgumentNotValidException(MethodArgumentNotValidException exception) {
        List<String> errors = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.toList());

        log.error("Validation failed: {}", errors);
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setStatus(HttpStatus.BAD_REQUEST)
                .setMessage("Input validation failed!")
                .setSubErrors(errors)
                .build();
        return buildErrorResponseEntity(apiError);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<?>> handleConstraintViolationException(ConstraintViolationException exception) {
        List<String> errors = exception.getConstraintViolations()
                .stream()
                .map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
                .collect(Collectors.toList());

        log.error("Constraint violation: {}", errors);
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setStatus(HttpStatus.BAD_REQUEST)
                .setMessage("Constraint validation failed!")
                .setSubErrors(errors)
                .build();
        return buildErrorResponseEntity(apiError);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleInternalServerErrorException(Exception exception) {
        log.error("Internal server error: {}", exception.getMessage(), exception);
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setStatus(HttpStatus.INTERNAL_SERVER_ERROR)
                .setMessage("An unexpected error occurred. Please try again later.")
                .build();
        return buildErrorResponseEntity(apiError);
    }

    private ResponseEntity<ApiResponse<?>> buildErrorResponseEntity(ApiError apiError) {
        return new ResponseEntity<>(ApiResponse.error(apiError), apiError.getHttpStatus());
    }
}
