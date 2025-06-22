package com.aarogya.notification_service.controller;

import com.aarogya.notification_service.advices.ApiError;
import com.aarogya.notification_service.advices.ApiResponse;
import com.aarogya.notification_service.auth.UserContextHolder;
import com.aarogya.notification_service.dto.MarkAsReadRequestDTO;
import com.aarogya.notification_service.dto.NotificationFilterDTO;
import com.aarogya.notification_service.dto.NotificationResponseDTO;
import com.aarogya.notification_service.dto.NotificationSummaryDTO;
import com.aarogya.notification_service.enums.NotificationStatus;
import com.aarogya.notification_service.enums.NotificationType;
import com.aarogya.notification_service.service.NotificationService;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/core")
@RequiredArgsConstructor
@Validated
@Slf4j
public class NotificationController {

    private final NotificationService notificationService;
    private static final String NOTIFICATION_SERVICE = "notificationService";

    public ResponseEntity<ApiResponse<NotificationResponseDTO>> notificationFallback(Throwable throwable) {
        log.warn("Fallback method called for notification service", throwable);
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setMessage("Notification service is currently unavailable. Please try again later.")
                .setStatus(HttpStatus.SERVICE_UNAVAILABLE)
                .build();
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ApiResponse.error(apiError));
    }

    public ResponseEntity<ApiResponse<Page<NotificationResponseDTO>>> notificationPageFallback(Throwable throwable) {
        log.warn("Fallback method called for notification service", throwable);
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setMessage("Notification service is currently unavailable. Please try again later.")
                .setStatus(HttpStatus.SERVICE_UNAVAILABLE)
                .build();
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ApiResponse.error(apiError));
    }

    public ResponseEntity<ApiResponse<NotificationSummaryDTO>> notificationSummaryFallback(Throwable throwable) {
        log.warn("Fallback method called for notification service", throwable);
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setMessage("Notification service is currently unavailable. Please try again later.")
                .setStatus(HttpStatus.SERVICE_UNAVAILABLE)
                .build();
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ApiResponse.error(apiError));
    }

    public ResponseEntity<ApiResponse<String>> operationSuccessFallback(Throwable throwable) {
        return ResponseEntity.ok(ApiResponse.success("Operation may not have completed due to high load. Please verify status."));
    }

    public ResponseEntity<ApiResponse<String>> rateLimitFallback(Throwable throwable) {
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setMessage("Too many requests to notification service. Please try again later.")
                .setStatus(HttpStatus.TOO_MANY_REQUESTS)
                .build();
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .body(ApiResponse.error(apiError));
    }

    @GetMapping
    @CircuitBreaker(name = NOTIFICATION_SERVICE, fallbackMethod = "notificationPageFallback")
    @RateLimiter(name = NOTIFICATION_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<Page<NotificationResponseDTO>>> getUserNotifications(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        log.info("Fetching notifications for user: {}, page: {}, size: {}", UserContextHolder.getUserDetails().getUserId(), page, size);

        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<NotificationResponseDTO> notifications = notificationService.getUserNotifications(UserContextHolder.getUserDetails().getUserId(), pageable);
        return ResponseEntity.ok(ApiResponse.success(notifications));
    }

    @GetMapping("/type/{type}")
    @CircuitBreaker(name = NOTIFICATION_SERVICE, fallbackMethod = "notificationPageFallback")
    @RateLimiter(name = NOTIFICATION_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<Page<NotificationResponseDTO>>> getUserNotificationsByType(
            @PathVariable String type,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) int size) {

        log.info("Fetching notifications for user: {} with type: {}", UserContextHolder.getUserDetails().getUserId(), type);

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<NotificationResponseDTO> notifications = notificationService
                .getUserNotificationsByType(UserContextHolder.getUserDetails().getUserId(), NotificationType.valueOf(type.toUpperCase()), pageable);
        return ResponseEntity.ok(ApiResponse.success(notifications));
    }

    @GetMapping("/status/{status}")
    @CircuitBreaker(name = NOTIFICATION_SERVICE, fallbackMethod = "notificationPageFallback")
    @RateLimiter(name = NOTIFICATION_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<Page<NotificationResponseDTO>>> getUserNotificationsByStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) int size) {

        log.info("Fetching notifications for user: {} with status: {}", UserContextHolder.getUserDetails().getUserId(), status);

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<NotificationResponseDTO> notifications = notificationService
                .getUserNotificationsByStatus(UserContextHolder.getUserDetails().getUserId(), NotificationStatus.valueOf(status.toUpperCase()), pageable);
        return ResponseEntity.ok(ApiResponse.success(notifications));
    }

    @PostMapping("/filter")
    @CircuitBreaker(name = NOTIFICATION_SERVICE, fallbackMethod = "notificationPageFallback")
    @RateLimiter(name = NOTIFICATION_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<Page<NotificationResponseDTO>>> getFilteredNotifications(
            @RequestBody @Valid NotificationFilterDTO filter,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) int size) {

        log.info("Fetching filtered notifications for user: {}", UserContextHolder.getUserDetails().getUserId());

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<NotificationResponseDTO> notifications = notificationService.getFilteredNotifications(UserContextHolder.getUserDetails().getUserId(), filter, pageable);
        return ResponseEntity.ok(ApiResponse.success(notifications));
    }

    @GetMapping("/{notificationId}")
    @CircuitBreaker(name = NOTIFICATION_SERVICE, fallbackMethod = "notificationFallback")
    @RateLimiter(name = NOTIFICATION_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<NotificationResponseDTO>> getNotificationById(@PathVariable @NotBlank String notificationId) {
        log.info("Fetching notification by ID: {}", notificationId);

        NotificationResponseDTO notification = notificationService.getNotificationById(notificationId);
        return ResponseEntity.ok(ApiResponse.success(notification));
    }

    @GetMapping("/summary")
    @CircuitBreaker(name = NOTIFICATION_SERVICE, fallbackMethod = "notificationSummaryFallback")
    @RateLimiter(name = NOTIFICATION_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<NotificationSummaryDTO>> getNotificationSummary() {
        log.info("Fetching notification summary for user: {}", UserContextHolder.getUserDetails().getUserId());

        NotificationSummaryDTO summary = notificationService.getNotificationSummary(UserContextHolder.getUserDetails().getUserId());
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    @GetMapping("/unread-count")
    @CircuitBreaker(name = NOTIFICATION_SERVICE, fallbackMethod = "operationSuccessFallback")
    @RateLimiter(name = NOTIFICATION_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount() {
        log.debug("Fetching unread count for user: {}", UserContextHolder.getUserDetails().getUserId());

        long count = notificationService.getUnreadCount(UserContextHolder.getUserDetails().getUserId());
        return ResponseEntity.ok(ApiResponse.success(count));
    }

    @PutMapping("/user/{userId}/mark-as-read")
    @CircuitBreaker(name = NOTIFICATION_SERVICE, fallbackMethod = "operationSuccessFallback")
    @RateLimiter(name = NOTIFICATION_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<String>> markAsRead(
            @RequestBody @Valid MarkAsReadRequestDTO request) {

        log.info("Marking notifications as read for user: {}", UserContextHolder.getUserDetails().getUserId());

        notificationService.markAsRead(UserContextHolder.getUserDetails().getUserId(), request.getNotificationIds());
        return ResponseEntity.ok(ApiResponse.success("Notifications marked as read successfully"));
    }

    @PutMapping("/mark-all-as-read")
    @CircuitBreaker(name = NOTIFICATION_SERVICE, fallbackMethod = "operationSuccessFallback")
    @RateLimiter(name = NOTIFICATION_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<String>> markAllAsRead() {
        log.info("Marking all notifications as read for user: {}", UserContextHolder.getUserDetails().getUserId());

        notificationService.markAllAsRead(UserContextHolder.getUserDetails().getUserId());
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read successfully"));
    }

    @PutMapping("/archive/{notificationId}")
    @CircuitBreaker(name = NOTIFICATION_SERVICE, fallbackMethod = "operationSuccessFallback")
    @RateLimiter(name = NOTIFICATION_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<String>> archiveNotification(
            @PathVariable @NotBlank String notificationId) {

        log.info("Archiving notification: {} for user: {}", notificationId, UserContextHolder.getUserDetails().getUserId());

        notificationService.archiveNotification(UserContextHolder.getUserDetails().getUserId(), notificationId);
        return ResponseEntity.ok(ApiResponse.success("Notification archived successfully"));
    }

    @DeleteMapping("/notification/{notificationId}")
    @CircuitBreaker(name = NOTIFICATION_SERVICE, fallbackMethod = "operationSuccessFallback")
    @RateLimiter(name = NOTIFICATION_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<String>> deleteNotification(
            @PathVariable @NotBlank String notificationId) {

        log.info("Deleting notification: {} for user: {}", notificationId, UserContextHolder.getUserDetails().getUserId());

        notificationService.deleteNotification(UserContextHolder.getUserDetails().getUserId(), notificationId);
        return ResponseEntity.ok(ApiResponse.success("Notification deleted successfully"));
    }

    @DeleteMapping("/cleanup")
    @CircuitBreaker(name = NOTIFICATION_SERVICE, fallbackMethod = "operationSuccessFallback")
    @RateLimiter(name = NOTIFICATION_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<String>> deleteOldNotifications(
            @RequestParam(defaultValue = "30") @Min(1) int daysOld) {

        log.info("Deleting notifications older than {} days for user: {}", daysOld, UserContextHolder.getUserDetails().getUserId());

        notificationService.deleteOldNotifications(UserContextHolder.getUserDetails().getUserId(), daysOld);
        return ResponseEntity.ok(ApiResponse.success("Old notifications cleanup completed successfully"));
    }
}
