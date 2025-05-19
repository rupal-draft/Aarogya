package com.aarogya.article_service.document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "articles")
@CompoundIndex(def = "{'doctorId': 1, 'title': 1, 'category': 1}", unique = true)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Articles {

    @Id
    private String id;

    @NotBlank
    @Indexed
    private String doctorId;

    @NotBlank
    @Size(max = 255)
    private String title;

    @NotBlank
    private String content;

    private String imageUrl;

    @Size(max = 100)
    private String category;

    private List<@Size(max = 50) String> tags;

    @Builder.Default
    private String status = "published";

    @Builder.Default
    private int views = 0;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
