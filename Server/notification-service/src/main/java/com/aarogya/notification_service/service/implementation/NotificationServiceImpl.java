package com.aarogya.notification_service.service.implementation;

import com.aarogya.notification_service.dto.NotificationFilterDTO;
import com.aarogya.notification_service.dto.NotificationResponseDTO;
import com.aarogya.notification_service.dto.NotificationSummaryDTO;
import com.aarogya.notification_service.enums.NotificationStatus;
import com.aarogya.notification_service.enums.NotificationType;
import com.aarogya.notification_service.exceptions.NotificationNotFoundException;
import com.aarogya.notification_service.exceptions.UnauthorizedAccessException;
import com.aarogya.notification_service.model.BaseNotification;
import com.aarogya.notification_service.repository.BaseNotificationRepository;
import com.aarogya.notification_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final BaseNotificationRepository baseNotificationRepository;
    private final ModelMapper modelMapper;
    private final MongoTemplate mongoTemplate;

    @Override
    @Cacheable(value = "userNotifications", key = "#userId + '_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<NotificationResponseDTO> getUserNotifications(String userId, Pageable pageable) {
        log.info("Fetching notifications for user: {}", userId);

        Page<BaseNotification> notifications = baseNotificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId, pageable);

        return notifications.map(notification -> modelMapper.map(notification, NotificationResponseDTO.class));
    }

    @Override
    @Cacheable(value = "userNotificationsByType", key = "#userId + '_' + #type + '_' + #pageable.pageNumber")
    public Page<NotificationResponseDTO> getUserNotificationsByType(String userId, NotificationType type, Pageable pageable) {
        log.info("Fetching notifications for user: {} with type: {}", userId, type);

        Page<BaseNotification> notifications = baseNotificationRepository
                .findByUserIdAndTypeOrderByCreatedAtDesc(userId, type, pageable);

        return notifications.map(notification -> modelMapper.map(notification, NotificationResponseDTO.class));
    }

    @Override
    @Cacheable(value = "userNotificationsByStatus", key = "#userId + '_' + #status + '_' + #pageable.pageNumber")
    public Page<NotificationResponseDTO> getUserNotificationsByStatus(String userId, NotificationStatus status, Pageable pageable) {
        log.info("Fetching notifications for user: {} with status: {}", userId, status);

        Page<BaseNotification> notifications = baseNotificationRepository
                .findByUserIdAndStatusOrderByCreatedAtDesc(userId, status, pageable);

        return notifications.map(notification -> modelMapper.map(notification, NotificationResponseDTO.class));
    }

    @Override
    public Page<NotificationResponseDTO> getFilteredNotifications(String userId, NotificationFilterDTO filter, Pageable pageable) {
        log.info("Fetching filtered notifications for user: {}", userId);

        Query query = new Query();
        query.addCriteria(Criteria.where("userId").is(userId));

        if (filter.getType() != null) {
            query.addCriteria(Criteria.where("type").is(filter.getType()));
        }

        if (filter.getStatus() != null) {
            query.addCriteria(Criteria.where("status").is(filter.getStatus()));
        }

        if (filter.getFromDate() != null && filter.getToDate() != null) {
            query.addCriteria(Criteria.where("createdAt").gte(filter.getFromDate()).lte(filter.getToDate()));
        }

        if (filter.getCategory() != null) {
            query.addCriteria(Criteria.where("category").is(filter.getCategory()));
        }

        if (filter.getMinPriority() != null && filter.getMaxPriority() != null) {
            query.addCriteria(Criteria.where("priority").gte(filter.getMinPriority()).lte(filter.getMaxPriority()));
        }

        query.with(pageable);

        List<BaseNotification> notifications = mongoTemplate.find(query, BaseNotification.class);
        long total = mongoTemplate.count(query.skip(0).limit(0), BaseNotification.class);

        List<NotificationResponseDTO> dtoList = notifications.stream()
                .map(notification -> modelMapper.map(notification, NotificationResponseDTO.class))
                .collect(Collectors.toList());

        return new org.springframework.data.domain.PageImpl<>(dtoList, pageable, total);
    }

    @Override
    public NotificationResponseDTO getNotificationById(String notificationId) {
        log.info("Fetching notification by ID: {}", notificationId);

        BaseNotification notification = baseNotificationRepository.findById(notificationId)
                .orElseThrow(() -> new NotificationNotFoundException("Notification not found with ID: " + notificationId));

        return modelMapper.map(notification, NotificationResponseDTO.class);
    }

    @Override
    @Cacheable(value = "notificationSummary", key = "#userId")
    public NotificationSummaryDTO getNotificationSummary(String userId) {
        log.info("Generating notification summary for user: {}", userId);

        long totalNotifications = baseNotificationRepository.countByUserIdAndStatus(userId, null);
        long unreadNotifications = baseNotificationRepository.countByUserIdAndStatus(userId, NotificationStatus.UNREAD);
        long readNotifications = baseNotificationRepository.countByUserIdAndStatus(userId, NotificationStatus.READ);
        long archivedNotifications = baseNotificationRepository.countByUserIdAndStatus(userId, NotificationStatus.ARCHIVED);

        long appointmentNotifications = mongoTemplate.count(
                Query.query(Criteria.where("userId").is(userId)
                        .and("type").in(NotificationType.APPOINTMENT_REQUEST, NotificationType.APPOINTMENT_STATUS_UPDATE,
                                NotificationType.EMERGENCY_APPOINTMENT, NotificationType.FOLLOW_UP_SCHEDULED,
                                NotificationType.FOLLOW_UP_STATUS_UPDATE)), BaseNotification.class);

        long articleNotifications = mongoTemplate.count(
                Query.query(Criteria.where("userId").is(userId)
                        .and("type").in(NotificationType.POST_CREATED, NotificationType.POST_LIKED,
                                NotificationType.POST_COMMENTED)), BaseNotification.class);

        long pharmacyNotifications = mongoTemplate.count(
                Query.query(Criteria.where("userId").is(userId)
                        .and("type").in(NotificationType.ORDER_CREATED, NotificationType.ORDER_STATUS_UPDATE)), BaseNotification.class);

        return NotificationSummaryDTO.builder()
                .totalNotifications(totalNotifications)
                .unreadNotifications(unreadNotifications)
                .readNotifications(readNotifications)
                .archivedNotifications(archivedNotifications)
                .appointmentNotifications(appointmentNotifications)
                .articleNotifications(articleNotifications)
                .pharmacyNotifications(pharmacyNotifications)
                .build();
    }

    @Override
    @Transactional
    @CacheEvict(value = {"userNotifications", "notificationSummary"}, key = "#userId")
    public void markAsRead(String userId, List<String> notificationIds) {
        log.info("Marking notifications as read for user: {}, notifications: {}", userId, notificationIds);

        Query query = Query.query(Criteria.where("id").in(notificationIds).and("userId").is(userId));
        Update update = Update.update("status", NotificationStatus.READ)
                .set("readAt", LocalDateTime.now())
                .set("updatedAt", LocalDateTime.now());

        mongoTemplate.updateMulti(query, update, BaseNotification.class);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"userNotifications", "notificationSummary"}, key = "#userId")
    public void markAllAsRead(String userId) {
        log.info("Marking all notifications as read for user: {}", userId);

        Query query = Query.query(Criteria.where("userId").is(userId).and("status").is(NotificationStatus.UNREAD));
        Update update = Update.update("status", NotificationStatus.READ)
                .set("readAt", LocalDateTime.now())
                .set("updatedAt", LocalDateTime.now());

        mongoTemplate.updateMulti(query, update, BaseNotification.class);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"userNotifications", "notificationSummary"}, key = "#userId")
    public void archiveNotification(String userId, String notificationId) {
        log.info("Archiving notification: {} for user: {}", notificationId, userId);

        BaseNotification notification = baseNotificationRepository.findById(notificationId)
                .orElseThrow(() -> new NotificationNotFoundException("Notification not found with ID: " + notificationId));

        if (!notification.getUserId().equals(userId)) {
            throw new UnauthorizedAccessException("User not authorized to archive this notification");
        }

        notification.setStatus(NotificationStatus.ARCHIVED);
        notification.setUpdatedAt(LocalDateTime.now());
        baseNotificationRepository.save(notification);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"userNotifications", "notificationSummary"}, key = "#userId")
    public void deleteNotification(String userId, String notificationId) {
        log.info("Deleting notification: {} for user: {}", notificationId, userId);

        BaseNotification notification = baseNotificationRepository.findById(notificationId)
                .orElseThrow(() -> new NotificationNotFoundException("Notification not found with ID: " + notificationId));

        if (!notification.getUserId().equals(userId)) {
            throw new UnauthorizedAccessException("User not authorized to delete this notification");
        }

        baseNotificationRepository.delete(notification);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"userNotifications", "notificationSummary"}, key = "#userId")
    public void deleteOldNotifications(String userId, int daysOld) {
        log.info("Deleting notifications older than {} days for user: {}", daysOld, userId);

        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysOld);
        baseNotificationRepository.deleteByUserIdAndCreatedAtBefore(userId, cutoffDate);
    }

    @Override
    @Cacheable(value = "unreadCount", key = "#userId")
    public long getUnreadCount(String userId) {
        log.debug("Getting unread count for user: {}", userId);
        return baseNotificationRepository.countByUserIdAndStatus(userId, NotificationStatus.UNREAD);
    }
}
