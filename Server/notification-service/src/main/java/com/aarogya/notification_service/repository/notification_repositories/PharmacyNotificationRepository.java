package com.aarogya.notification_service.repository.notification_repositories;

import com.aarogya.notification_service.model.notifications.PharmacyNotification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PharmacyNotificationRepository extends MongoRepository<PharmacyNotification, String> {

    Page<PharmacyNotification> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);

    Optional<PharmacyNotification> findByOrderId(String orderId);

    List<PharmacyNotification> findByUserIdAndOrderStatus(String userId, String orderStatus);
}
