package com.aarogya.article_service.document;

import com.aarogya.article_service.document.enums.UserType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "article_comments")
@CompoundIndex(def = "{'articleId': 1, 'userId': 1}", unique = true)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArticleComments {

    @Id
    private String id;

    @NotBlank
    @Indexed
    private String articleId;

    @NotBlank
    private String userId;

    @NotBlank
    private String comment;

    @NotBlank
    @Pattern(regexp = "doctor|patient", message = "userType must be either 'doctor' or 'patient'")
    private String userType;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
