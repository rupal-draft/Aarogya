package com.aarogya.notification_service.controller;

import com.aarogya.notification_service.auth.UserContextHolder;
import com.aarogya.notification_service.dto.AppointmentNotificationDto;
import com.aarogya.notification_service.exceptions.NotificationProcessingException;
import com.aarogya.notification_service.service.AppointmentNotificationService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/appointments")
@RequiredArgsConstructor
@Validated
public class AppointmentNotificationController {

    private final AppointmentNotificationService notificationService;

    @GetMapping
    public ResponseEntity<Page<AppointmentNotificationDto>> getUserNotifications(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size) {

        return ResponseEntity.ok(notificationService.getUserAppointmentNotifications(UserContextHolder.getUserDetails().getUserId(), page, size));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount() {
        return ResponseEntity.ok(notificationService.getUnreadCount(UserContextHolder.getUserDetails().getUserId()));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable String id){
        notificationService.markNotificationAsRead(id, UserContextHolder.getUserDetails().getUserId());
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(new ErrorResponse(ex.getMessage()));
    }

    @ExceptionHandler(NotificationProcessingException.class)
    public ResponseEntity<ErrorResponse> handleNotificationProcessingException(NotificationProcessingException ex) {
        return ResponseEntity.internalServerError().body(new ErrorResponse("Failed to process notification"));
    }
}

@Getter
@AllArgsConstructor
class ErrorResponse {
    private String message;
    private final LocalDateTime timestamp = LocalDateTime.now();
}
