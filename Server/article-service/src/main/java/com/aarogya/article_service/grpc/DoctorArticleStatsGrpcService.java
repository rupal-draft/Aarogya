package com.aarogya.article_service.grpc;

import com.aarogya.article_service.dto.grpc.DoctorArticleStatsDTO;
import com.aarogya.article_service.service.ArticleStatsService;
import com.aarogya.doctor.article.stats.*;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.service.GrpcService;

@GrpcService
@RequiredArgsConstructor
@Slf4j
public class DoctorArticleStatsGrpcService extends DoctorArticleStatsServiceGrpc.DoctorArticleStatsServiceImplBase {

    private final ArticleStatsService articleStatsService;

    @Override
    public void getDoctorArticleStats(GetDoctorArticleStatsRequest request,
                                      StreamObserver<DoctorArticleStatsResponse> responseObserver) {
        try {
            log.info("Fetching article stats for doctorId: {}", request.getDoctorId());

            DoctorArticleStatsDTO dto = articleStatsService.getDoctorArticleStats(request.getDoctorId());

            DoctorArticleStatsResponse response = mapToProto(dto);

            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (Exception e) {
            log.error("Error in getDoctorArticleStats", e);
            responseObserver.onError(e);
        }
    }

    private DoctorArticleStatsResponse mapToProto(DoctorArticleStatsDTO dto) {
        DoctorArticleStatsResponse.Builder builder = DoctorArticleStatsResponse.newBuilder()
                .setDoctorId(dto.getDoctorId())
                .setTotalArticles(dto.getTotalArticles())
                .setArticlesThisMonth(dto.getArticlesThisMonth());

        if (dto.getCategoryStats() != null) {
            dto.getCategoryStats().forEach(cs -> builder.addCategoryStats(
                    ArticleCategoryStats.newBuilder()
                            .setCategory(cs.getCategory())
                            .setCount(cs.getCount())
                            .build()
            ));
        }

        if (dto.getTagStats() != null) {
            dto.getTagStats().forEach(ts -> builder.addTagStats(
                    ArticleTagStats.newBuilder()
                            .setTag(ts.getTag())
                            .setCount(ts.getCount())
                            .build()
            ));
        }

        if (dto.getTopArticles() != null) {
            dto.getTopArticles().forEach(ta -> builder.addTopArticles(
                    TopArticle.newBuilder()
                            .setId(ta.getId())
                            .setTitle(ta.getTitle())
                            .setViews(ta.getViews())
                            .build()
            ));
        }

        if (dto.getViewsTrend() != null) {
            dto.getViewsTrend().forEach(vt -> builder.addViewsTrend(
                    ArticleViewsTrend.newBuilder()
                            .setPeriod(vt.getPeriod())
                            .setViews(vt.getViews())
                            .build()
            ));
        }

        if (dto.getLatestArticle() != null) {
            TopArticle la = TopArticle.newBuilder()
                    .setId(dto.getLatestArticle().getId())
                    .setTitle(dto.getLatestArticle().getTitle())
                    .setViews(dto.getLatestArticle().getViews())
                    .build();
            builder.setLatestArticle(la);
        }

        if (dto.getEngagementStats() != null) {
            ArticleEngagementStats.Builder engagementBuilder = ArticleEngagementStats.newBuilder()
                    .setTotalLikes(dto.getEngagementStats().getTotalLikes())
                    .setTotalComments(dto.getEngagementStats().getTotalComments());

            if (dto.getEngagementStats().getTopLikedArticles() != null) {
                dto.getEngagementStats().getTopLikedArticles().forEach(ta ->
                        engagementBuilder.addTopLikedArticles(
                                TopArticle.newBuilder()
                                        .setId(ta.getId())
                                        .setTitle(ta.getTitle())
                                        .setViews(ta.getViews())
                                        .build()
                        )
                );
            }

            if (dto.getEngagementStats().getTopCommentedArticles() != null) {
                dto.getEngagementStats().getTopCommentedArticles().forEach(ta ->
                        engagementBuilder.addTopCommentedArticles(
                                TopArticle.newBuilder()
                                        .setId(ta.getId())
                                        .setTitle(ta.getTitle())
                                        .setViews(ta.getViews())
                                        .build()
                        )
                );
            }

            builder.setEngagementStats(engagementBuilder.build());
        }

        if (dto.getEngagementTrend() != null) {
            dto.getEngagementTrend().forEach(mt -> builder.addEngagementTrend(
                    MonthlyEngagementTrend.newBuilder()
                            .setYear(mt.getYear())
                            .setMonth(mt.getMonth())
                            .setTotalViews(mt.getTotalViews())
                            .setTotalLikes(mt.getTotalLikes())
                            .setTotalComments(mt.getTotalComments())
                            .build()
            ));
        }

        return builder.build();
    }
}
