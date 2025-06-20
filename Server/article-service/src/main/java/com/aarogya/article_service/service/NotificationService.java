package com.aarogya.article_service.service;

import com.aarogya.article_service.document.ArticleComments;
import com.aarogya.article_service.document.ArticleLikes;
import com.aarogya.article_service.document.Articles;

public interface NotificationService {

    void sendPostCreatedNotification(Articles articles);

    void sendPostCommentedNotification(ArticleComments comments);

    void sendPostLikedNotification(ArticleLikes likes);
}
