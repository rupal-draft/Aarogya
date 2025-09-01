package com.aarogya.doctor_service.models.forum;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "forum_votes")
@CompoundIndex(def = "{'doctorId': 1, 'threadId': 1, 'replyId': 1}", unique = true)
public class ForumVote {
    @Id
    private String id;

    @NotBlank
    private String doctorId;

    private String threadId;
    private String replyId;

    @NotNull
    @Min(-1)
    @Max(1)
    private Integer voteValue;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
