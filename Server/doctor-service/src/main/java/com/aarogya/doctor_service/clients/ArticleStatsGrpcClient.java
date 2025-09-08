package com.aarogya.doctor_service.clients;

import com.aarogya.doctor_service.dto.grpc.article.*;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.StatusRuntimeException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ArticleStatsGrpcClient {

    private final ManagedChannel channel;
    private final com.aarogya.doctor.article.stats.DoctorArticleStatsServiceGrpc.DoctorArticleStatsServiceBlockingStub blockingStub;

    public ArticleStatsGrpcClient() {
        this.channel = ManagedChannelBuilder.forAddress("localhost", 6084)
                .usePlaintext()
                .build();
        this.blockingStub = com.aarogya.doctor.article.stats.DoctorArticleStatsServiceGrpc.newBlockingStub(channel);
    }

    public DoctorArticleStatsDTO getDoctorArticleStats(String doctorId) {
        try {
            com.aarogya.doctor.article.stats.GetDoctorArticleStatsRequest request = com.aarogya.doctor.article.stats.GetDoctorArticleStatsRequest.newBuilder()
                    .setDoctorId(doctorId)
                    .build();

            com.aarogya.doctor.article.stats.DoctorArticleStatsResponse response = blockingStub.getDoctorArticleStats(request);
            return mapToDoctorArticleStatsDTO(response);

        } catch (StatusRuntimeException e) {
            log.error("gRPC call to DoctorArticleStatsService failed: {}", e.getStatus(), e);
            throw e;
        }
    }

    public void shutdown() throws InterruptedException {
        channel.shutdown().awaitTermination(5, TimeUnit.SECONDS);
    }

    // ================= MAPPING METHODS =================

    private DoctorArticleStatsDTO mapToDoctorArticleStatsDTO(com.aarogya.doctor.article.stats.DoctorArticleStatsResponse response) {
        return DoctorArticleStatsDTO.builder()
                .doctorId(response.getDoctorId())
                .totalArticles(response.getTotalArticles())
                .articlesThisMonth(response.getArticlesThisMonth())
                .categoryStats(response.getCategoryStatsList().stream()
                        .map(this::mapToArticleCategoryStatsDTO)
                        .collect(Collectors.toList()))
                .tagStats(response.getTagStatsList().stream()
                        .map(this::mapToArticleTagStatsDTO)
                        .collect(Collectors.toList()))
                .topArticles(response.getTopArticlesList().stream()
                        .map(this::mapToTopArticleDTO)
                        .collect(Collectors.toList()))
                .viewsTrend(response.getViewsTrendList().stream()
                        .map(this::mapToArticleViewsTrendDTO)
                        .collect(Collectors.toList()))
                .latestArticle(response.hasLatestArticle() ? mapToTopArticleDTO(response.getLatestArticle()) : null)
                .engagementStats(response.hasEngagementStats() ? mapToArticleEngagementStatsDTO(response.getEngagementStats()) : null)
                .engagementTrend(response.getEngagementTrendList().stream()
                        .map(this::mapToMonthlyEngagementTrendDTO)
                        .collect(Collectors.toList()))
                .build();
    }

    private ArticleCategoryStatsDTO mapToArticleCategoryStatsDTO(com.aarogya.doctor.article.stats.ArticleCategoryStats proto) {
        return ArticleCategoryStatsDTO.builder()
                .category(proto.getCategory())
                .count(proto.getCount())
                .build();
    }

    private ArticleTagStatsDTO mapToArticleTagStatsDTO(com.aarogya.doctor.article.stats.ArticleTagStats proto) {
        return ArticleTagStatsDTO.builder()
                .tag(proto.getTag())
                .count(proto.getCount())
                .build();
    }

    private TopArticleDTO mapToTopArticleDTO(com.aarogya.doctor.article.stats.TopArticle proto) {
        return TopArticleDTO.builder()
                .id(proto.getId())
                .title(proto.getTitle())
                .views((int) proto.getViews())
                .build();
    }

    private ArticleViewsTrendDTO mapToArticleViewsTrendDTO(com.aarogya.doctor.article.stats.ArticleViewsTrend proto) {
        return ArticleViewsTrendDTO.builder()
                .period(proto.getPeriod())
                .views(proto.getViews())
                .build();
    }

    private ArticleEngagementStatsDTO mapToArticleEngagementStatsDTO(com.aarogya.doctor.article.stats.ArticleEngagementStats proto) {
        return ArticleEngagementStatsDTO.builder()
                .totalLikes(proto.getTotalLikes())
                .totalComments(proto.getTotalComments())
                .topLikedArticles(proto.getTopLikedArticlesList().stream()
                        .map(this::mapToTopArticleDTO)
                        .collect(Collectors.toList()))
                .topCommentedArticles(proto.getTopCommentedArticlesList().stream()
                        .map(this::mapToTopArticleDTO)
                        .collect(Collectors.toList()))
                .build();
    }

    private MonthlyEngagementTrendDTO mapToMonthlyEngagementTrendDTO(com.aarogya.doctor.article.stats.MonthlyEngagementTrend proto) {
        return MonthlyEngagementTrendDTO.builder()
                .year(proto.getYear())
                .month(proto.getMonth())
                .totalViews(proto.getTotalViews())
                .totalLikes(proto.getTotalLikes())
                .totalComments(proto.getTotalComments())
                .build();
    }
}
