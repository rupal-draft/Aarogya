package com.aarogya.article_service.repository;

import com.aarogya.article_service.document.ArticleComments;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends MongoRepository<ArticleComments, String> {

    List<ArticleComments> findByArticleId(String articleId);

    Optional<ArticleComments> findByArticleIdAndId(String articleId, String id);
}
