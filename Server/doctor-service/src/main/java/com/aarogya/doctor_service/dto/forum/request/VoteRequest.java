package com.aarogya.doctor_service.dto.forum.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoteRequest {
    @NotNull(message = "Vote type is required")
    private String voteType; // UPVOTE, DOWNVOTE, NEUTRAL
}
