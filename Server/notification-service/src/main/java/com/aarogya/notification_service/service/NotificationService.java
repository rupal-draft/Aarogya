package com.aarogya.notification_service.service;

import com.aarogya.notification_service.dto.NotificationFilterDTO;
import com.aarogya.notification_service.dto.NotificationResponseDTO;
import com.aarogya.notification_service.dto.NotificationSummaryDTO;
import com.aarogya.notification_service.enums.NotificationStatus;
import com.aarogya.notification_service.enums.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface NotificationService {

    Page<NotificationResponseDTO> getUserNotifications(String userId, Pageable pageable);

    Page<NotificationResponseDTO> getUserNotificationsByType(String userId, NotificationType type, Pageable pageable);

    Page<NotificationResponseDTO> getUserNotificationsByStatus(String userId, NotificationStatus status, Pageable pageable);

    Page<NotificationResponseDTO> getFilteredNotifications(String userId, NotificationFilterDTO filter, Pageable pageable);

    NotificationResponseDTO getNotificationById(String notificationId);

    NotificationSummaryDTO getNotificationSummary(String userId);

    void markAsRead(String userId, List<String> notificationIds);

    void markAllAsRead(String userId);

    void archiveNotification(String userId, String notificationId);

    void deleteNotification(String userId, String notificationId);

    void deleteOldNotifications(String userId, int daysOld);

    long getUnreadCount(String userId);
}
