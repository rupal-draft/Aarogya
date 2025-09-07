package com.aarogya.doctor_service.dto.grpc.article_service;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorArticleStatsDTO {
    private String doctorId;
    private long totalArticles;
    private long articlesThisMonth;
    private List<ArticleCategoryStatsDTO> categoryStats;
    private List<ArticleTagStatsDTO> tagStats;
    private List<TopArticleDTO> topArticles;
    private List<ArticleViewsTrendDTO> viewsTrend;
    private TopArticleDTO latestArticle;
    private ArticleEngagementStatsDTO engagementStats;
    private List<MonthlyEngagementTrendDTO> engagementTrend;
}

