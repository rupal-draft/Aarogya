package com.aarogya.notification_service.service;

import appointment_service.events.NotificationSaveEvent;
import com.aarogya.notification_service.dto.AppointmentNotificationDto;
import org.springframework.data.domain.Page;

public interface AppointmentNotificationService {
    void processAppointmentNotification(NotificationSaveEvent event);
    Page<AppointmentNotificationDto> getUserAppointmentNotifications(String userId, int page, int size);
    void markNotificationAsRead(String notificationId, String userId);
    long getUnreadCount(String userId);
}
