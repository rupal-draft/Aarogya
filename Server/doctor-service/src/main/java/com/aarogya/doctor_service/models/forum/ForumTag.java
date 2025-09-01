package com.aarogya.doctor_service.models.forum;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "forum_tags")
public class ForumTag {
    @Id
    private String id;

    @NotBlank
    @Indexed(unique = true)
    private String name;

    private String description;

    @Builder.Default
    private Integer threadCount = 0;

    @Builder.Default
    private Integer followerCount = 0;

    @Builder.Default
    private Boolean isActive = true;

    @CreatedDate
    private LocalDateTime createdAt;
}
