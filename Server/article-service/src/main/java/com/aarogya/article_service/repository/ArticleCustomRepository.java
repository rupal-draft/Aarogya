package com.aarogya.article_service.repository;

import com.aarogya.article_service.dto.grpc.ArticleCategoryStatsDTO;
import com.aarogya.article_service.dto.grpc.ArticleTagStatsDTO;
import com.aarogya.article_service.dto.grpc.ArticleViewsTrendDTO;

import java.util.List;

public interface ArticleCustomRepository {
    List<ArticleCategoryStatsDTO> getCategoryStats(String doctorId);
    List<ArticleTagStatsDTO> getTagStats(String doctorId);
    List<ArticleViewsTrendDTO> getViewsTrend(String doctorId);
}
