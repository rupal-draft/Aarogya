package com.aarogya.notification_service.service.implementations;

import appointment_service.events.NotificationSaveEvent;
import appointment_service.events.enums.NotificationType;
import com.aarogya.notification_service.dto.AppointmentNotificationDto;
import com.aarogya.notification_service.exceptions.NotificationProcessingException;
import com.aarogya.notification_service.exceptions.ResourceNotFoundException;
import com.aarogya.notification_service.model.AppointmentNotification;
import com.aarogya.notification_service.repository.AppointmentNotificationRepository;
import com.aarogya.notification_service.service.AppointmentNotificationService;
import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AppointmentNotificationServiceImpl implements AppointmentNotificationService {

    private final AppointmentNotificationRepository notificationRepository;
    private final ModelMapper modelMapper;
    private final CacheManager cacheManager;

    @Override
    @KafkaListener(topics = "notification-save", groupId = "notification-service-group")
    public void processAppointmentNotification(NotificationSaveEvent event) {
        try {
            if (event.getType() != NotificationSaveEvent.SaveNotificationType.APPOINTMENT) {
                return;
            }

            log.info("Processing appointment notification for user: {}", event.getUserId());

            AppointmentNotification notification = convertToAppointmentNotification(event);
            notificationRepository.saveAndEvict(notification);

            log.info("Successfully saved appointment notification for user: {}", event.getUserId());
        } catch (Exception e) {
            log.error("Failed to process appointment notification for user: {}", event.getUserId(), e);
            throw new NotificationProcessingException("Failed to process notification", e);
        }
    }

    @Override
    @Cacheable(value = "userNotifications", key = "#userId")
    public Page<AppointmentNotificationDto> getUserAppointmentNotifications(String userId, int page, int size) {
        validateUserId(userId);
        validatePagination(page, size);

        log.debug("Fetching notifications for user: {}, page: {}, size: {}", userId, page, size);
        Page<AppointmentNotification> notifications = notificationRepository.findByUserId(
                userId,
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))
        );

        log.debug("Fetched notifications for user: {}, page: {}, size: {}", userId, page, size);
        return notifications.map(notification ->
                modelMapper.map(notification, AppointmentNotificationDto.class));
    }

    @Override
    @CacheEvict(value = "userNotifications", key = "#userId")
    public void markNotificationAsRead(String notificationId, String userId) {
        validateIds(notificationId, userId);

        log.info("Marking notification {} as read for user {}", notificationId, userId);
        AppointmentNotification notification = notificationRepository
                .findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with ID: " + notificationId));
        notification.setRead(true);
        notificationRepository.saveAndEvict(notification);
        evictUserCache(userId);
    }

    @Override
    @Cacheable(value = "unreadCount", key = "#userId")
    public long getUnreadCount(String userId) {
        validateUserId(userId);
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    private AppointmentNotification convertToAppointmentNotification(NotificationSaveEvent event) {
        AppointmentNotification notification = modelMapper.map(event.getData(), AppointmentNotification.class);
        notification.setUserId(event.getUserId());
        notification.setTitle(event.getTitle());
        notification.setType(NotificationType.valueOf(event.getType().name()));
        notification.setRead(false);
        return notification;
    }

    private void validateUserId(String userId) {
        if (StringUtils.isBlank(userId)) {
            throw new IllegalArgumentException("User ID cannot be blank");
        }
    }

    private void validatePagination(int page, int size) {
        if (page < 0) {
            throw new IllegalArgumentException("Page number cannot be negative");
        }
        if (size <= 0 || size > 100) {
            throw new IllegalArgumentException("Page size must be between 1 and 100");
        }
    }

    private void validateIds(String notificationId, String userId) {
        if (StringUtils.isBlank(notificationId) || StringUtils.isBlank(userId)) {
            throw new IllegalArgumentException("Notification ID and User ID cannot be blank");
        }
    }

    private void evictUserCache(String userId) {
        Cache cache = cacheManager.getCache("userNotifications");
        if (cache != null) {
            cache.evict(userId);
        }
    }
}
