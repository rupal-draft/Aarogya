package com.aarogya.article_service.dto;

import lombok.*;

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
