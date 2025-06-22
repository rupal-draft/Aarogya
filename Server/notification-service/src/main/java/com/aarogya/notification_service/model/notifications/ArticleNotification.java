package com.aarogya.notification_service.model.notifications;

import com.aarogya.notification_service.model.BaseNotification;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Document(collection = "article_notifications")
public class ArticleNotification extends BaseNotification {
    @Indexed
    private String articleId;

    private String articleTitle;
    private String articleImageUrl;
    private String articleCategory;

    private String postedBy;
    private String postedByImage;

    private String comment;
    private String commentedBy;
    private String commentedByImage;

    private String likedBy;
    private String likedByImage;
    private LocalDateTime likedTime;
}
