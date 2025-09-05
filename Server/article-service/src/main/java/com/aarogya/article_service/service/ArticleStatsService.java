package com.aarogya.article_service.service;

import com.aarogya.article_service.dto.grpc.DoctorArticleStatsDTO;

public interface ArticleStatsService {
    DoctorArticleStatsDTO getDoctorArticleStats(String doctorId);
}
