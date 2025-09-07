package com.aarogya.doctor_service.dto.grpc.article_service;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArticleViewsTrendDTO {
    private String period;
    private long views;
}
