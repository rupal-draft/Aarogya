package com.aarogya.article_service.repository;

import com.aarogya.article_service.document.Articles;
import com.aarogya.article_service.dto.grpc.ArticleCategoryStatsDTO;
import com.aarogya.article_service.dto.grpc.ArticleTagStatsDTO;
import com.aarogya.article_service.dto.grpc.ArticleViewsTrendDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class ArticleCustomRepositoryImpl implements ArticleCustomRepository {

    private final MongoTemplate mongoTemplate;

    @Override
    public List<ArticleCategoryStatsDTO> getCategoryStats(String doctorId) {
        Aggregation agg = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("doctorId").is(doctorId)),
                Aggregation.group("category").count().as("count"),
                Aggregation.project("count").and("category").previousOperation()
        );
        return mongoTemplate.aggregate(agg, Articles.class, ArticleCategoryStatsDTO.class).getMappedResults();
    }

    @Override
    public List<ArticleTagStatsDTO> getTagStats(String doctorId) {
        Aggregation agg = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("doctorId").is(doctorId)),
                Aggregation.unwind("tags"),
                Aggregation.group("tags").count().as("count"),
                Aggregation.project("count").and("tag").previousOperation()
        );
        return mongoTemplate.aggregate(agg, Articles.class, ArticleTagStatsDTO.class).getMappedResults();
    }

    @Override
    public List<ArticleViewsTrendDTO> getViewsTrend(String doctorId) {
        Aggregation agg = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("doctorId").is(doctorId)),
                Aggregation.project("views")
                        .andExpression("dateToString('%Y-%m', $createdAt)").as("period"),
                Aggregation.group("period").sum("views").as("views"),
                Aggregation.project("views").and("period").previousOperation(),
                Aggregation.sort(Sort.Direction.ASC, "period")
        );
        return mongoTemplate.aggregate(agg, Articles.class, ArticleViewsTrendDTO.class).getMappedResults();
    }
}
