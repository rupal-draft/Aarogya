package com.aarogya.doctor_service.dto.forum.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReplyResponse {
    private String id;
    private String threadId;
    private String authorId;
    private String authorName;
    private String authorSpecialization;
    private String content;
    private Integer upvoteCount;
    private Boolean isActive;
    private Boolean isSolution;
    private Boolean isAnonymous;
    private String parentReplyId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer userVote;
    private List<ReplyResponse> childReplies;
}
