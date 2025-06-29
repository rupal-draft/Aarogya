package com.aarogya.notification_service.service.implementation;

import com.aarogya.appointment_service.events.NotificationSaveEvent;
import com.aarogya.article_service.event.NotificationEvent;
import com.aarogya.notification_service.enums.NotificationStatus;
import com.aarogya.notification_service.enums.NotificationType;
import com.aarogya.notification_service.model.BaseNotification;
import com.aarogya.notification_service.model.notifications.AppointmentNotification;
import com.aarogya.notification_service.model.notifications.ArticleNotification;
import com.aarogya.notification_service.model.notifications.PharmacyNotification;
import com.aarogya.notification_service.repository.BaseNotificationRepository;
import com.aarogya.notification_service.repository.notification_repositories.AppointmentNotificationRepository;
import com.aarogya.notification_service.repository.notification_repositories.ArticleNotificationRepository;
import com.aarogya.notification_service.repository.notification_repositories.PharmacyNotificationRepository;
import com.aarogya.notification_service.service.KafkaConsumerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaConsumerServiceImpl implements KafkaConsumerService {

    private final BaseNotificationRepository baseNotificationRepository;
    private final AppointmentNotificationRepository appointmentNotificationRepository;
    private final ArticleNotificationRepository articleNotificationRepository;
    private final PharmacyNotificationRepository pharmacyNotificationRepository;
    private final ModelMapper modelMapper;
    private final CacheManager cacheManager;

    @Override
    @KafkaListener(topics = "notification-save", groupId = "notification-service-group")
    @Transactional
    @CacheEvict(value = {"userNotifications", "notificationSummary", "unreadCount"}, key = "#event.userId")
    public void handleAppointmentNotification(@Payload NotificationSaveEvent event) {
        try {
            log.info("Processing appointment notification for user: {}", event.getUserId());

            AppointmentNotification notification = new AppointmentNotification();
            notification.setUserId(event.getUserId());
            notification.setTitle(event.getTitle());
            notification.setStatus(NotificationStatus.UNREAD);
            notification.setCreatedAt(event.getTimestamp() != null ? event.getTimestamp() : LocalDateTime.now());
            notification.setData(event.getData());

            NotificationType type = mapAppointmentNotificationType(event.getType());
            notification.setType(type);
            notification.setCategory("APPOINTMENT");
            notification.setPriority(determinePriority(type));

            if (event.getData() != null) {
                extractAppointmentData(notification, event.getData());
            }

            baseNotificationRepository.save(modelMapper.map(notification, BaseNotification.class));
            appointmentNotificationRepository.save(notification);

            log.info("Successfully saved appointment notification for user: {}", event.getUserId());

        } catch (Exception e) {
            log.error("Error processing appointment notification for user: {}", event.getUserId(), e);
        }
    }

    @Override
    @KafkaListener(topics = {"new-post", "new-comment", "new-like"}, groupId = "notification-service-group")
    @Transactional
    @CacheEvict(value = {"userNotifications", "notificationSummary", "unreadCount"}, key = "#event.userId")
    public void handleArticleNotification(@Payload NotificationEvent event) {
        try {
            log.info("Processing article notification for user: {}", event.getUserId());

            ArticleNotification notification = new ArticleNotification();
            notification.setUserId(event.getUserId());
            notification.setTitle(event.getTitle());
            notification.setStatus(NotificationStatus.UNREAD);
            notification.setCreatedAt(event.getTimestamp() != null ? event.getTimestamp() : LocalDateTime.now());
            notification.setData(event.getData());

            NotificationType type = mapArticleNotificationType(event.getType());
            notification.setType(type);
            notification.setCategory("ARTICLE");
            notification.setPriority(determinePriority(type));

            if (event.getData() != null) {
                extractArticleData(notification, event.getData());
            }

            baseNotificationRepository.save(modelMapper.map(notification, BaseNotification.class));
            articleNotificationRepository.save(notification);

            log.info("Successfully saved article notification for user: {}", event.getUserId());

        } catch (Exception e) {
            log.error("Error processing article notification for user: {}", event.getUserId(), e);
        }
    }

    @Override
    @KafkaListener(topics = {"order-creation", "order-status-update"}, groupId = "notification-service-group")
    @Transactional
    public void handlePharmacyNotification(@Payload pharmacy_service.events.NotificationEvent event,
                                           @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
        try {
            String userId = extractUserIdFromPharmacyEvent(event);
            if (userId == null) {
                log.warn("Could not extract userId from pharmacy notification event");
                return;
            }

            log.info("Processing pharmacy notification for user: {}", userId);

            PharmacyNotification notification = new PharmacyNotification();
            notification.setUserId(userId);
            notification.setTitle(event.getMessage());
            notification.setMessage(event.getMessage());
            notification.setStatus(NotificationStatus.UNREAD);
            notification.setCreatedAt(event.getTimeStamp() != null ? event.getTimeStamp() : LocalDateTime.now());
            notification.setData(event.getData());

            NotificationType type = mapPharmacyNotificationType(topic);
            notification.setType(type);
            notification.setCategory("PHARMACY");
            notification.setPriority(determinePriority(type));

            if (event.getData() != null) {
                extractPharmacyData(notification, event.getData());
            }

            baseNotificationRepository.save(modelMapper.map(notification, BaseNotification.class));
            pharmacyNotificationRepository.save(notification);

            clearUserCache(userId);

            log.info("Successfully saved pharmacy notification for user: {}", userId);

        } catch (Exception e) {
            log.error("Error processing pharmacy notification", e);
        }
    }

    private NotificationType mapAppointmentNotificationType(NotificationSaveEvent.SaveNotificationType type) {
        return switch (type) {
            case APPOINTMENT -> NotificationType.APPOINTMENT_REQUEST;
            case FOLLOWUP -> NotificationType.FOLLOW_UP_SCHEDULED;
        };
    }

    private NotificationType mapArticleNotificationType(NotificationEvent.SaveNotificationType type) {
        return switch (type) {
            case POST -> NotificationType.POST_CREATED;
            case LIKE -> NotificationType.POST_LIKED;
            case COMMENT -> NotificationType.POST_COMMENTED;
        };
    }

    private NotificationType mapPharmacyNotificationType(String topic) {
        return switch (topic) {
            case "order-creation" -> NotificationType.ORDER_CREATED;
            case "order-status-update" -> NotificationType.ORDER_STATUS_UPDATE;
            default -> NotificationType.ORDER_CREATED;
        };
    }

    private Integer determinePriority(NotificationType type) {
        return switch (type) {
            case EMERGENCY_APPOINTMENT -> 5;
            case APPOINTMENT_REQUEST, APPOINTMENT_STATUS_UPDATE -> 4;
            case FOLLOW_UP_SCHEDULED, FOLLOW_UP_STATUS_UPDATE -> 3;
            case ORDER_CREATED, ORDER_STATUS_UPDATE -> 3;
            case POST_CREATED -> 2;
            case POST_LIKED, POST_COMMENTED -> 1;
        };
    }

    private void extractAppointmentData(AppointmentNotification notification, Map<String, Object> data) {
        notification.setAppointmentId((String) data.get("appointmentId"));
        notification.setDoctorName((String) data.get("doctorName"));
        notification.setPatientName((String) data.get("patientName"));
        notification.setDoctorImage((String) data.get("doctorImage"));
        notification.setPatientImage((String) data.get("patientImage"));
        notification.setAppointmentStatus((String) data.get("status"));
        notification.setMeetingLink((String) data.get("meetingLink"));
        notification.setReason((String) data.get("reason"));
        notification.setNotes((String) data.get("notes"));

        if (data.containsKey("followUpId")) {
            notification.setFollowUpId((String) data.get("followUpId"));
            notification.setOriginalAppointmentId((String) data.get("originalAppointmentId"));
            notification.setUrgencyLevel((Integer) data.get("urgencyLevel"));
        }
    }

    private void extractArticleData(ArticleNotification notification, Map<String, Object> data) {
        notification.setArticleId((String) data.get("articleId"));
        notification.setArticleTitle((String) data.get("title"));
        notification.setArticleImageUrl((String) data.get("imageUrl"));
        notification.setArticleCategory((String) data.get("category"));

        if (data.containsKey("postedBy")) {
            notification.setPostedBy((String) data.get("postedBy"));
            notification.setPostedByImage((String) data.get("postedByImage"));
        }

        if (data.containsKey("commentedBy")) {
            notification.setComment((String) data.get("comment"));
            notification.setCommentedBy((String) data.get("commentedBy"));
            notification.setCommentedByImage((String) data.get("commentedByImage"));
        }

        if (data.containsKey("likedBy")) {
            notification.setLikedBy((String) data.get("likedBy"));
            notification.setLikedByImage((String) data.get("likedByImage"));
        }
    }

    private void extractPharmacyData(PharmacyNotification notification, Map<String, Object> data) {
        notification.setOrderId((String) data.get("orderId"));
        notification.setOrderStatus((String) data.get("status"));

        if (data.containsKey("totalAmount")) {
            notification.setTotalAmount(new java.math.BigDecimal(data.get("totalAmount").toString()));
        }

        if (data.containsKey("orderItems")) {
            Object rawItems = data.get("orderItems");

            if (rawItems instanceof List<?> itemsList) {
                List<PharmacyNotification.OrderItemData> itemDataList = new ArrayList<>();

                for (Object itemObj : itemsList) {
                    if (itemObj instanceof Map<?, ?> itemMap) {
                        PharmacyNotification.OrderItemData item = modelMapper.map(itemMap, PharmacyNotification.OrderItemData.class);
                        itemDataList.add(item);
                    }
                }
                notification.setOrderItems(itemDataList);
            }
        }
    }

    private String extractUserIdFromPharmacyEvent(pharmacy_service.events.NotificationEvent event) {
        if (event.getData() != null && event.getData().containsKey("userId")) {
            return (String) event.getData().get("userId");
        }
        return null;
    }

    private void clearUserCache(String userId) {
        log.debug("Clearing cache for user: {}", userId);
        Cache cache = cacheManager.getCache("userNotifications");
        if (cache != null) {
            cache.evict(userId);
        }
    }
}
