package com.aarogya.notification_service.controller;

import com.aarogya.notification_service.auth.UserContextHolder;
import com.aarogya.notification_service.dto.NotificationResponseDTO;
import com.aarogya.notification_service.enums.NotificationType;
import com.aarogya.notification_service.service.NotificationService;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/core")
@RequiredArgsConstructor
@Slf4j
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<Page<NotificationResponseDTO>> getUserNotifications(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        log.info("Fetching notifications for user: {}, page: {}, size: {}", UserContextHolder.getUserDetails().getUserId(), page, size);

        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<NotificationResponseDTO> notifications = notificationService.getUserNotifications(UserContextHolder.getUserDetails().getUserId(), pageable);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<Page<NotificationResponseDTO>> getUserNotificationsByType(
            @PathVariable String type,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) int size) {

        log.info("Fetching notifications for user: {} with type: {}", UserContextHolder.getUserDetails().getUserId(), type);

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<NotificationResponseDTO> notifications = notificationService
                .getUserNotificationsByType(UserContextHolder.getUserDetails().getUserId(), NotificationType.valueOf(type.toUpperCase()), pageable);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/user/{userId}/status/{status}")
    public ResponseEntity<Page<NotificationResponseDTO>> getUserNotificationsByStatus(
            @PathVariable @NotBlank String userId,
            @PathVariable NotificationStatus status,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) int size) {

        log.info("Fetching notifications for user: {} with status: {}", userId, status);

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<NotificationResponseDTO> notifications = notificationService.getUserNotificationsByStatus(userId, status, pageable);
        return ResponseEntity.ok(notifications);
    }

    @PostMapping("/user/{userId}/filter")
    public ResponseEntity<Page<NotificationResponseDTO>> getFilteredNotifications(
            @PathVariable @NotBlank String userId,
            @RequestBody @Valid NotificationFilterDTO filter,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) int size) {

        log.info("Fetching filtered notifications for user: {}", userId);

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<NotificationResponseDTO> notifications = notificationService.getFilteredNotifications(userId, filter, pageable);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/{notificationId}")
    public ResponseEntity<NotificationResponseDTO> getNotificationById(@PathVariable @NotBlank String notificationId) {
        log.info("Fetching notification by ID: {}", notificationId);

        NotificationResponseDTO notification = notificationService.getNotificationById(notificationId);
        return ResponseEntity.ok(notification);
    }

    @GetMapping("/user/{userId}/summary")
    public ResponseEntity<NotificationSummaryDTO> getNotificationSummary(@PathVariable @NotBlank String userId) {
        log.info("Fetching notification summary for user: {}", userId);

        NotificationSummaryDTO summary = notificationService.getNotificationSummary(userId);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<Long> getUnreadCount(@PathVariable @NotBlank String userId) {
        log.debug("Fetching unread count for user: {}", userId);

        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(count);
    }

    @PutMapping("/user/{userId}/mark-as-read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable @NotBlank String userId,
            @RequestBody @Valid MarkAsReadRequestDTO request) {

        log.info("Marking notifications as read for user: {}", userId);

        notificationService.markAsRead(userId, request.getNotificationIds());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/user/{userId}/mark-all-as-read")
    public ResponseEntity<Void> markAllAsRead(@PathVariable @NotBlank String userId) {
        log.info("Marking all notifications as read for user: {}", userId);

        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/user/{userId}/archive/{notificationId}")
    public ResponseEntity<Void> archiveNotification(
            @PathVariable @NotBlank String userId,
            @PathVariable @NotBlank String notificationId) {

        log.info("Archiving notification: {} for user: {}", notificationId, userId);

        notificationService.archiveNotification(userId, notificationId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/user/{userId}/notification/{notificationId}")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable @NotBlank String userId,
            @PathVariable @NotBlank String notificationId) {

        log.info("Deleting notification: {} for user: {}", notificationId, userId);

        notificationService.deleteNotification(userId, notificationId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/user/{userId}/cleanup")
    public ResponseEntity<Void> deleteOldNotifications(
            @PathVariable @NotBlank String userId,
            @RequestParam(defaultValue = "30") @Min(1) int daysOld) {

        log.info("Deleting notifications older than {} days for user: {}", daysOld, userId);

        notificationService.deleteOldNotifications(userId, daysOld);
        return ResponseEntity.ok().build();
    }
}
