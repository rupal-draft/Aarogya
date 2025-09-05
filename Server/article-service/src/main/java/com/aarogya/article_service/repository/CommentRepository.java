package com.aarogya.article_service.repository;

import com.aarogya.article_service.document.ArticleComments;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface CommentRepository extends MongoRepository<ArticleComments, String> {

    List<ArticleComments> findByArticleId(String articleId);

    long countByArticleIdIn(List<String> articleIds);

    @Aggregation(pipeline = {
            "{ $match: { articleId: { $in: ?0 } } }",
            "{ $group: { _id: '$articleId', count: { $sum: 1 } } }",
            "{ $sort: { count: -1 } }",
            "{ $limit: ?1 }"
    })
    List<Map<String, Object>> findTopArticlesByComments(List<String> articleIds, int limit);

    @Aggregation(pipeline = {
            "{ $match: { articleId: { $in: ?0 } } }",
            "{ $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } }",
            "{ $sort: { '_id.year': 1, '_id.month': 1 } }"
    })
    List<Map<String, Object>> getMonthlyCommentsTrend(List<String> articleIds);
}
