package com.aarogya.article_service.service.implementation;

import com.aarogya.article_service.clients.UserGrpcClient;
import com.aarogya.article_service.document.ArticleComments;
import com.aarogya.article_service.document.ArticleLikes;
import com.aarogya.article_service.document.Articles;
import com.aarogya.article_service.dto.DoctorResponseDTO;
import com.aarogya.article_service.dto.PatientResponseDTO;
import com.aarogya.article_service.event.NotificationEvent;
import com.aarogya.article_service.event.messaging.CommentNotificationData;
import com.aarogya.article_service.event.messaging.LikeNotificationData;
import com.aarogya.article_service.event.messaging.PostNotificationData;
import com.aarogya.article_service.exceptions.ServiceUnavailable;
import com.aarogya.article_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.kafka.KafkaException;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final UserGrpcClient userGrpcClient;
    private final KafkaTemplate<String, NotificationEvent>postNotificationKafkaTemplate;
    private final ModelMapper modelMapper;

    @Override
    public void sendPostCreatedNotification(Articles articles) {
        try {
            log.info(("Sending post created notification to Notification Microservice for Article: " + articles.getId()));

            DoctorResponseDTO doctor = userGrpcClient.getDoctor(articles.getDoctorId());
            PostNotificationData postNotificationData = PostNotificationData.builder()
                    .title(articles.getTitle())
                    .category(articles.getCategory())
                    .createdAt(articles.getCreatedAt())
                    .imageUrl(articles.getImageUrl())
                    .id(articles.getId())
                    .postedBy(doctor.getFirstName() + " " + doctor.getLastName())
                    .postedByImage(doctor.getImageUrl())
                    .build();
            Map<String, Object> data = modelMapper.map(postNotificationData, Map.class);
            NotificationEvent notificationEvent = NotificationEvent.builder()
                    .data(data)
                    .read(false)
                    .timestamp(LocalDateTime.now())
                    .userId(doctor.getId())
                    .title("New Post Created!")
                    .type(NotificationEvent.SaveNotificationType.POST)
                    .build();
            postNotificationKafkaTemplate.send("new-post", articles.getId(), notificationEvent);
        } catch (KafkaException e) {
            log.error("Failed to send post created notification to Notification Microservice for Article: " + articles.getId());
            throw new ServiceUnavailable("Failed to send post created notification to Notification Microservice for Article: " + articles.getId());
        } catch (Exception e) {
            log.error("Failed to send post created notification to Notification Microservice for Article: " + articles.getId());
            throw new ServiceUnavailable("Failed to send post created notification to Notification Microservice for Article: " + articles.getId());
        }
    }

    @Override
    public void sendPostCommentedNotification(ArticleComments comments) {
        try {
            log.info(("Sending post commented notification to Notification Microservice for Article: " + comments.getArticleId()));

            if(comments.getUserType().equalsIgnoreCase("doctor")) {
                DoctorResponseDTO doctor = userGrpcClient.getDoctor(comments.getUserId());
                CommentNotificationData commentNotificationData = CommentNotificationData.builder()
                        .comment(comments.getComment())
                        .articleId(comments.getArticleId())
                        .commentedBy(doctor.getFirstName() + " " + doctor.getLastName())
                        .commnetedByImage(doctor.getImageUrl())
                        .build();

                NotificationEvent notificationEvent = NotificationEvent.builder()
                        .data(modelMapper.map(commentNotificationData, Map.class))
                        .read(false)
                        .timestamp(LocalDateTime.now())
                        .title("New Comment Added!")
                        .type(NotificationEvent.SaveNotificationType.COMMENT)
                        .userId(comments.getUserId())
                        .build();
                postNotificationKafkaTemplate.send("new-comment", comments.getArticleId(), notificationEvent);
            }
            else{
                PatientResponseDTO patient = userGrpcClient.getPatient(comments.getUserId());
                CommentNotificationData commentNotificationData = CommentNotificationData.builder()
                        .comment(comments.getComment())
                        .articleId(comments.getArticleId())
                        .commentedBy(patient.getFirstName() + " " + patient.getLastName())
                        .commnetedByImage(patient.getImageUrl())
                        .build();

                NotificationEvent notificationEvent = NotificationEvent.builder()
                        .data(modelMapper.map(commentNotificationData, Map.class))
                        .read(false)
                        .timestamp(LocalDateTime.now())
                        .title("New Comment Added!")
                        .type(NotificationEvent.SaveNotificationType.COMMENT)
                        .userId(comments.getUserId())
                        .build();
                postNotificationKafkaTemplate.send("new-comment", comments.getArticleId(), notificationEvent);
            }
        } catch (KafkaException e) {
            log.error("Failed to send post commented notification to Notification Microservice for Article: " + comments.getArticleId());
            throw new ServiceUnavailable("Failed to send post commented notification to Notification Microservice for Article: " + comments.getArticleId());
        } catch (Exception e) {
            log.error("Failed to send post commented notification to Notification Microservice for Article: " + comments.getArticleId());
            throw new ServiceUnavailable("Failed to send post commented notification to Notification Microservice for Article: " + comments.getArticleId());
        }
    }

    @Override
    public void sendPostLikedNotification(ArticleLikes likes) {
        try {
            log.info(("Sending post liked notification to Notification Microservice for Article: " + likes.getArticleId()));

            if(likes.getUserType().equalsIgnoreCase("doctor")) {
                DoctorResponseDTO doctor = userGrpcClient.getDoctor(likes.getUserId());
                LikeNotificationData likeNotificationData = LikeNotificationData.builder()
                        .articleId(likes.getArticleId())
                        .likedBy(doctor.getFirstName() + " " + doctor.getLastName())
                        .likedByImage(doctor.getImageUrl())
                        .likedTime(likes.getCreatedAt())
                        .build();
                NotificationEvent notificationEvent = NotificationEvent.builder()
                        .data(modelMapper.map(likeNotificationData, Map.class))
                        .read(false)
                        .timestamp(LocalDateTime.now())
                        .title("New Like Added!")
                        .type(NotificationEvent.SaveNotificationType.LIKE)
                        .userId(likes.getUserId())
                        .build();
                postNotificationKafkaTemplate.send("new-like", likes.getArticleId(), notificationEvent);
            }
            else{
                PatientResponseDTO patient = userGrpcClient.getPatient(likes.getUserId());
                LikeNotificationData likeNotificationData = LikeNotificationData.builder()
                        .articleId(likes.getArticleId())
                        .likedBy(patient.getFirstName() + " " + patient.getLastName())
                        .likedByImage(patient.getImageUrl())
                        .likedTime(likes.getCreatedAt())
                        .build();
                NotificationEvent notificationEvent = NotificationEvent.builder()
                        .data(modelMapper.map(likeNotificationData, Map.class))
                        .read(false)
                        .timestamp(LocalDateTime.now())
                        .title("New Like Added!")
                        .type(NotificationEvent.SaveNotificationType.LIKE)
                        .userId(likes.getUserId())
                        .build();
                postNotificationKafkaTemplate.send("new-like", likes.getArticleId(), notificationEvent);
            }
        } catch (KafkaException e) {
            log.error("Failed to send post liked notification to Notification Microservice for Article: " + likes.getArticleId());
            throw new ServiceUnavailable("Failed to send post liked notification to Notification Microservice for Article: " + likes.getArticleId());
        } catch (Exception e) {
            log.error("Failed to send post liked notification to Notification Microservice for Article: " + likes.getArticleId());
            throw new ServiceUnavailable("Failed to send post liked notification to Notification Microservice for Article: " + likes.getArticleId());
        }
    }
}
