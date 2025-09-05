package com.aarogya.article_service.repository;

import com.aarogya.article_service.document.Articles;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface ArticleRepository extends MongoRepository<Articles, String>, ArticleCustomRepository {

    List<Articles> findByDoctorId(String doctorId);

    List<Articles> findByCategoryIgnoreCase(String category);

    List<Articles> findByTitleContainingIgnoreCase(String title);

    List<Articles> findTop4ByOrderByCreatedAtDesc();

    List<Articles> findTop4ByOrderByViewsDesc();

    @Query("{ '$or': [ { 'title': { $regex: ?0, $options: 'i' } }, { 'content': { $regex: ?0, $options: 'i' } } ] }")
    List<Articles> searchByTitleOrContent(String keyword);


    long countByDoctorId(String doctorId);

    long countByDoctorIdAndCreatedAtAfter(String doctorId, LocalDateTime from);

    List<Articles> findTop3ByDoctorIdOrderByViewsDesc(String doctorId);

    Optional<Articles> findTopByDoctorIdOrderByCreatedAtDesc(String doctorId);

    @Aggregation(pipeline = {
            "{ $match: { doctorId: ?0 } }",
            "{ $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, totalViews: { $sum: '$views' } } }",
            "{ $sort: { '_id.year': 1, '_id.month': 1 } }"
    })
    List<Map<String, Object>> getMonthlyViewsTrend(String doctorId);
}
