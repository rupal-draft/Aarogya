package com.aarogya.article_service.repository;

import com.aarogya.article_service.document.ArticleLikes;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LikeRepository extends MongoRepository<ArticleLikes, String> {

    int countByArticleId(String articleId);

    boolean existsByArticleIdAndUserId(String articleId, String userId);

    void deleteByArticleIdAndUserId(String articleId, String userId);
}
