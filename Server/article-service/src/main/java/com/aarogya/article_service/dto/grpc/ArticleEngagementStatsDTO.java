package com.aarogya.article_service.dto.grpc;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArticleEngagementStatsDTO {
    private long totalLikes;
    private long totalComments;
    private List<TopArticleDTO> topLikedArticles;
    private List<TopArticleDTO> topCommentedArticles;
}

