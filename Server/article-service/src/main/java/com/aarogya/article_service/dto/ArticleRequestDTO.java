package com.aarogya.article_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArticleRequestDTO {

    @NotBlank
    private String doctorId;

    @NotBlank
    @Size(max = 255)
    private String title;

    @NotBlank
    private String content;

    private String posterUrl;
    private String imageUrl;

    @Size(max = 100)
    private String category;

    private List<@Size(max = 50) String> tags;

    private String status;
}
