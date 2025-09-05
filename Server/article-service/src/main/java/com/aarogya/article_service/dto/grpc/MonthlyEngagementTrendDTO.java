package com.aarogya.article_service.dto.grpc;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyEngagementTrendDTO {
    private int year;
    private int month;
    private long totalViews;
    private long totalLikes;
    private long totalComments;
}

