package com.aarogya.notification_service.advices;

import com.aarogya.notification_service.exceptions.NotificationNotFoundException;
import com.aarogya.notification_service.exceptions.UnauthorizedAccessException;
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

    @ExceptionHandler(NotificationNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleResourceNotFoundException(NotificationNotFoundException exception) {
        log.error("Notification not found: {}", exception.getMessage());
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setStatus(HttpStatus.NOT_FOUND)
                .setMessage(exception.getLocalizedMessage())
                .build();
        return buildErrorResponseEntity(apiError);
    }

    @ExceptionHandler(UnauthorizedAccessException.class)
    public ResponseEntity<ApiResponse<?>> handleForbiddenAccess (UnauthorizedAccessException exception) {
        log.error("Access forbidden: {}", exception.getMessage());
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
