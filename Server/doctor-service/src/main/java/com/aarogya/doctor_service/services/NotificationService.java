package com.aarogya.doctor_service.services;

import com.aarogya.doctor_service.dto.DoctorNotificationDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationService {

    DoctorNotificationDTO createNotification(DoctorNotificationDTO notificationDTO);

    Page<DoctorNotificationDTO> getDoctorNotifications(String doctorId, Boolean read, Pageable pageable);

    List<DoctorNotificationDTO> getRecentNotifications(String doctorId, LocalDateTime since);

    DoctorNotificationDTO markNotificationAsRead(String doctorId, String notificationId);

    void markAllNotificationsAsRead(String doctorId);

    long getUnreadNotificationCount(String doctorId);

    void deleteNotification(String doctorId, String notificationId);

    void createAppointmentNotification(String doctorId, String appointmentId, String patientName, String action);

    void createRatingNotification(String doctorId, String ratingId, String patientName, Integer rating);

    void createReviewNotification(String doctorId, String reviewId, String diseaseType);
}
