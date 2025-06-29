package com.aarogya.article_service.event.messaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentNotificationData {
    private String articleId;
    private String comment;
    private String commentedBy;
    private String commnetedByImage;
}
