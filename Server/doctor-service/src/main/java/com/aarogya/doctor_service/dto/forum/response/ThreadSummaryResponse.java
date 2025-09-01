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
public class ThreadSummaryResponse {
    private String id;
    private String authorId;
    private String authorName;
    private String authorSpecialization;
    private String title;
    private String contentPreview;
    private List<String> tags;
    private String type;
    private Integer viewCount;
    private Integer replyCount;
    private Integer upvoteCount;
    private Boolean isClosed;
    private Boolean isAnonymous;
    private LocalDateTime createdAt;
    private LocalDateTime lastRepliedAt;
    private Boolean isBookmarked;
    private Integer userVote;
}
