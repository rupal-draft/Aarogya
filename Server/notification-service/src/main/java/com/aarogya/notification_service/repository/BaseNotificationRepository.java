package com.aarogya.notification_service.repository;

import com.aarogya.notification_service.enums.NotificationStatus;
import com.aarogya.notification_service.enums.NotificationType;
import com.aarogya.notification_service.model.BaseNotification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;


@Repository
public interface BaseNotificationRepository extends MongoRepository<BaseNotification, String> {

    Page<BaseNotification> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);

    Page<BaseNotification> findByUserIdAndStatusOrderByCreatedAtDesc(String userId, NotificationStatus status, Pageable pageable);

    Page<BaseNotification> findByUserIdAndTypeOrderByCreatedAtDesc(String userId, NotificationType type, Pageable pageable);

    Page<BaseNotification> findByUserIdAndTypeAndStatusOrderByCreatedAtDesc(String userId, NotificationType type, NotificationStatus status, Pageable pageable);

    long countByUserIdAndStatus(String userId, NotificationStatus status);

    @Query("{'userId': ?0, 'createdAt': {'$gte': ?1, '$lte': ?2}}")
    List<BaseNotification> findByUserIdAndCreatedAtBetween(String userId, LocalDateTime startDate, LocalDateTime endDate);

    @Query("{'userId': ?0, 'status': ?1}")
    List<BaseNotification> findByUserIdAndStatus(String userId, NotificationStatus status);

    @Query("{'expiresAt': {'$lt': ?0}}")
    List<BaseNotification> findExpiredNotifications(LocalDateTime now);

    void deleteByUserIdAndCreatedAtBefore(String userId, LocalDateTime cutoffDate);
}
