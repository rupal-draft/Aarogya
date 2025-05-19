package com.aarogya.article_service.document;

import com.aarogya.article_service.document.enums.UserType;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "article_likes")
@CompoundIndexes({
        @CompoundIndex(name = "unique_like_idx", def = "{'articleId': 1, 'userId': 1}", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArticleLikes {

    @Id
    private String id;

    @NotBlank
    private String articleId;

    @NotBlank
    private String userId;

    @NotBlank
    private UserType userType;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
