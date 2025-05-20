package com.aarogya.article_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArticleResponseDTO {

    private String id;
    private UserResponseDto doctor;
    private String title;
    private String content;
    private String imageUrl;
    private String category;
    private List<String> tags;
    private String status;
    private int views;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
