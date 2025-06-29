package com.aarogya.article_service.event.messaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LikeNotificationData {
    private String articleId;
    private String likedBy;
    private String likedByImage;
    private LocalDateTime likedTime;
}
