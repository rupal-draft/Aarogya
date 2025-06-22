package com.aarogya.notification_service.repository.notification_repositories;

import com.aarogya.notification_service.model.notifications.AppointmentNotification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentNotificationRepository extends MongoRepository<AppointmentNotification, String> {

    Page<AppointmentNotification> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);

    Optional<AppointmentNotification> findByAppointmentId(String appointmentId);

    List<AppointmentNotification> findByUserIdAndAppointmentDate(String userId, LocalDate appointmentDate);

    @Query("{'userId': ?0, 'appointmentDate': {'$gte': ?1}}")
    List<AppointmentNotification> findUpcomingAppointmentNotifications(String userId, LocalDate fromDate);

    List<AppointmentNotification> findByFollowUpId(String followUpId);
}
