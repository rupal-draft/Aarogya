package com.aarogya.notification_service.repository.notification_repositories;

import com.aarogya.notification_service.model.notifications.ArticleNotification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleNotificationRepository extends MongoRepository<ArticleNotification, String> {

    Page<ArticleNotification> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);

    List<ArticleNotification> findByArticleId(String articleId);

    List<ArticleNotification> findByUserIdAndArticleCategory(String userId, String category);
}
