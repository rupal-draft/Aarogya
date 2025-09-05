package com.aarogya.doctor_service.models.forum;

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
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "forum_replies")
@CompoundIndexes({
        @CompoundIndex(name = "thread_created_idx", def = "{'threadId': 1, 'createdAt': -1}"),
        @CompoundIndex(name = "author_thread_idx", def = "{'authorId': 1, 'threadId': 1}"),
        @CompoundIndex(name = "author_created_idx", def = "{'authorId': 1, 'createdAt': -1}"),
        @CompoundIndex(name = "author_solution_idx", def = "{'authorId': 1, 'isSolution': 1}")
})
public class ForumReply {
    @Id
    private String id;

    @NotBlank
    private String threadId;

    @NotBlank
    private String authorId;

    private String authorName;
    private String authorSpecialization;

    @NotBlank
    @Size(min = 5, max = 2000)
    private String content;

    @Builder.Default
    private Integer upvoteCount = 0;

    @Builder.Default
    private Boolean isActive = true;

    @Builder.Default
    private Boolean isSolution = false;

    @Builder.Default
    private Boolean isAnonymous = false;

    private String parentReplyId; // For nested replies

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Version
    private Long version;
}
