package com.aarogya.article_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArticleCommentResponseDTO {

    private String id;
    private String articleId;
    private UserResponseDto userResponseDto;
    private String userType;
    private String comment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
