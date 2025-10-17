package com.aarogya.doctor_service.dto.forum.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoteResponse {
    private String id;
    private String threadId;
    private String replyId;
    private String voteType;
    private int userVote;
    private Integer newUpvoteCount;
    private LocalDateTime createdAt;
}
