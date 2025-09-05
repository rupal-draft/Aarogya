package com.aarogya.article_service.repository;

import com.aarogya.article_service.document.ArticleLikes;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface LikeRepository extends MongoRepository<ArticleLikes, String> {

    int countByArticleId(String articleId);

    boolean existsByArticleIdAndUserId(String articleId, String userId);

    void deleteByArticleIdAndUserId(String articleId, String userId);

    long countByArticleIdIn(List<String> articleIds);

    @Aggregation(pipeline = {
            "{ $match: { articleId: { $in: ?0 } } }",
            "{ $group: { _id: '$articleId', count: { $sum: 1 } } }",
            "{ $sort: { count: -1 } }",
            "{ $limit: ?1 }"
    })
    List<Map<String, Object>> findTopArticlesByLikes(List<String> articleIds, int limit);

    @Aggregation(pipeline = {
            "{ $match: { articleId: { $in: ?0 } } }",
            "{ $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } }",
            "{ $sort: { '_id.year': 1, '_id.month': 1 } }"
    })
    List<Map<String, Object>> getMonthlyLikesTrend(List<String> articleIds);
}
