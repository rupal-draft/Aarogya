package com.aarogya.article_service.service.implementation;

import com.aarogya.article_service.document.Articles;
import com.aarogya.article_service.dto.grpc.*;
import com.aarogya.article_service.repository.ArticleRepository;
import com.aarogya.article_service.repository.CommentRepository;
import com.aarogya.article_service.repository.LikeRepository;
import com.aarogya.article_service.service.ArticleStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ArticleStatsServiceImpl implements ArticleStatsService {

    private final ArticleRepository articleRepository;
    private final LikeRepository articleLikesRepository;
    private final CommentRepository articleCommentsRepository;

    @Override
    @Cacheable(value = "doctorArticleStats", key = "#doctorId")
    public DoctorArticleStatsDTO getDoctorArticleStats(String doctorId) {
        long totalArticles = articleRepository.countByDoctorId(doctorId);
        long articlesThisMonth = articleRepository.countByDoctorIdAndCreatedAtAfter(
                doctorId, LocalDateTime.now().withDayOfMonth(1));

        List<ArticleCategoryStatsDTO> categoryStats = articleRepository.getCategoryStats(doctorId);
        List<ArticleTagStatsDTO> tagStats = articleRepository.getTagStats(doctorId);
        List<ArticleViewsTrendDTO> viewsTrend = articleRepository.getViewsTrend(doctorId);

        List<TopArticleDTO> topArticles = articleRepository.findTop3ByDoctorIdOrderByViewsDesc(doctorId)
                .stream()
                .map(a -> new TopArticleDTO(a.getId(), a.getTitle(), a.getViews()))
                .toList();

        TopArticleDTO latestArticle = articleRepository.findTopByDoctorIdOrderByCreatedAtDesc(doctorId)
                .map(a -> new TopArticleDTO(a.getId(), a.getTitle(), a.getViews()))
                .orElse(null);

        List<String> articleIds = articleRepository.findAll()
                .stream()
                .filter(a -> a.getDoctorId().equals(doctorId))
                .map(Articles::getId)
                .toList();

        long totalLikes = articleLikesRepository.countByArticleIdIn(articleIds);
        long totalComments = articleCommentsRepository.countByArticleIdIn(articleIds);

        List<TopArticleDTO> topLikedArticles = articleLikesRepository.findTopArticlesByLikes(articleIds, 3)
                .stream()
                .map(m -> new TopArticleDTO(
                        (String) m.get("_id"),
                        articleRepository.findById((String) m.get("_id")).map(Articles::getTitle).orElse("Unknown"),
                        ((Number) m.get("count")).intValue()
                ))
                .toList();

        List<TopArticleDTO> topCommentedArticles = articleCommentsRepository.findTopArticlesByComments(articleIds, 3)
                .stream()
                .map(m -> new TopArticleDTO(
                        (String) m.get("_id"),
                        articleRepository.findById((String) m.get("_id")).map(Articles::getTitle).orElse("Unknown"),
                        ((Number) m.get("count")).intValue()
                ))
                .toList();

        ArticleEngagementStatsDTO engagementStats = ArticleEngagementStatsDTO.builder()
                .totalLikes(totalLikes)
                .totalComments(totalComments)
                .topLikedArticles(topLikedArticles)
                .topCommentedArticles(topCommentedArticles)
                .build();

        List<MonthlyEngagementTrendDTO> engagementTrend = buildMonthlyEngagementTrend(doctorId, articleIds);

        return DoctorArticleStatsDTO.builder()
                .doctorId(doctorId)
                .totalArticles(totalArticles)
                .articlesThisMonth(articlesThisMonth)
                .categoryStats(categoryStats)
                .tagStats(tagStats)
                .viewsTrend(viewsTrend)
                .topArticles(topArticles)
                .latestArticle(latestArticle)
                .engagementStats(engagementStats)
                .engagementTrend(engagementTrend)
                .build();
    }


    private List<MonthlyEngagementTrendDTO> buildMonthlyEngagementTrend(String doctorId, List<String> articleIds) {
        var views = articleRepository.getMonthlyViewsTrend(doctorId);
        var likes = articleLikesRepository.getMonthlyLikesTrend(articleIds);
        var comments = articleCommentsRepository.getMonthlyCommentsTrend(articleIds);

        Map<String, MonthlyEngagementTrendDTO> trendMap = new HashMap<>();

        views.forEach(v -> {
            Map<String, Object> idMap = (Map<String, Object>) v.get("_id");
            int year = idMap != null && idMap.get("year") != null ? ((Number) idMap.get("year")).intValue() : 0;
            int month = idMap != null && idMap.get("month") != null ? ((Number) idMap.get("month")).intValue() : 0;
            long totalViews = ((Number) v.getOrDefault("totalViews", 0)).longValue();
            String key = year + "-" + month;

            trendMap.putIfAbsent(key, new MonthlyEngagementTrendDTO(year, month, 0, 0, 0));
            trendMap.get(key).setTotalViews(totalViews);
        });


        likes.forEach(l -> {
            Map<String, Object> idMap = (Map<String, Object>) l.get("_id");
            int year = idMap.get("year") != null ? ((Number) idMap.get("year")).intValue() : 0;
            int month = idMap.get("month") != null ? ((Number) idMap.get("month")).intValue() : 0;
            long count = ((Number) l.getOrDefault("count", 0)).longValue();
            String key = year + "-" + month;

            trendMap.putIfAbsent(key, new MonthlyEngagementTrendDTO(year, month, 0, 0, 0));
            trendMap.get(key).setTotalLikes(count);
        });


        comments.forEach(c -> {
            Map<String, Object> idMap = (Map<String, Object>) c.get("_id");
            int year = idMap.get("year") != null ? ((Number) idMap.get("year")).intValue() : 0;
            int month = idMap.get("month") != null ? ((Number) idMap.get("month")).intValue() : 0;
            long count = ((Number) c.getOrDefault("count", 0)).longValue();
            String key = year + "-" + month;

            trendMap.putIfAbsent(key, new MonthlyEngagementTrendDTO(year, month, 0, 0, 0));
            trendMap.get(key).setTotalComments(count);
        });


        return trendMap.values().stream()
                .sorted(Comparator.comparing(MonthlyEngagementTrendDTO::getYear)
                        .thenComparing(MonthlyEngagementTrendDTO::getMonth))
                .toList();
    }

}
