package com.aarogya.notification_service.repository;

import com.aarogya.notification_service.model.AppointmentNotification;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentNotificationRepository extends MongoRepository<AppointmentNotification, String> {

    @Cacheable(value = "userNotifications", key = "#userId")
    List<AppointmentNotification> findByUserIdAndReadFalseOrderByCreatedAtDesc(String userId);

    @Cacheable(value = "userNotifications", key = "#userId")
    Page<AppointmentNotification> findByUserId(String userId, Pageable pageable);

    @CacheEvict(value = "userNotifications", key = "#notification.userId")
    default AppointmentNotification saveAndEvict(AppointmentNotification notification) {
        return save(notification);
    }

    long countByUserIdAndReadFalse(String userId);
}
