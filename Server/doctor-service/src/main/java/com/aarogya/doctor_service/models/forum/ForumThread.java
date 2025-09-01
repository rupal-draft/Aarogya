package com.aarogya.doctor_service.models.forum;

import com.aarogya.doctor_service.enums.forum.ThreadType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "forum_threads")
@CompoundIndex(def = "{'authorId': 1, 'createdAt': -1}")
@CompoundIndex(def = "{'tags': 1, 'createdAt': -1}")
@CompoundIndex(def = "{'isActive': 1, 'isClosed': 1}")
public class ForumThread {
    @Id
    private String id;

    @NotBlank
    private String authorId;

    private String authorName;
    private String authorSpecialization;

    @NotBlank
    @Size(min = 10, max = 200)
    private String title;

    @NotBlank
    @Size(min = 20, max = 5000)
    private String content;

    @Builder.Default
    private List<String> tags = new ArrayList<>();

    @Builder.Default
    private ThreadType type = ThreadType.DISCUSSION;

    @Builder.Default
    private Integer viewCount = 0;

    @Builder.Default
    private Integer replyCount = 0;

    @Builder.Default
    private Integer upvoteCount = 0;

    @Builder.Default
    private Integer bookmarkCount = 0;

    @Builder.Default
    private Boolean isActive = true;

    @Builder.Default
    private Boolean isClosed = false;

    @Builder.Default
    private Boolean isAnonymous = false;

    private String closedReason;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    private LocalDateTime lastRepliedAt;

    @Version
    private Long version;
}
