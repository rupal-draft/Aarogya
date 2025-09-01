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
public class ThreadResponse {
    private String id;
    private String authorId;
    private String authorName;
    private String authorSpecialization;
    private String title;
    private String content;
    private List<String> tags;
    private String type;
    private Integer viewCount;
    private Integer replyCount;
    private Integer upvoteCount;
    private Integer bookmarkCount;
    private Boolean isActive;
    private Boolean isClosed;
    private Boolean isAnonymous;
    private String closedReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastRepliedAt;
    private Boolean isBookmarked;
    private Integer userVote;
    private List<ReplyResponse> recentReplies;
}
