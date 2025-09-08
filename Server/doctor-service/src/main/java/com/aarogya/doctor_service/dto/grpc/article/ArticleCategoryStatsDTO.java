package com.aarogya.doctor_service.dto.grpc.article;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArticleCategoryStatsDTO {
    private String category;
    private long count;
}