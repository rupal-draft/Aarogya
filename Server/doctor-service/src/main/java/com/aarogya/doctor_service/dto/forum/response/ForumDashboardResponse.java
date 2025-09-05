package com.aarogya.doctor_service.dto.forum.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ForumDashboardResponse {
    private Long totalThreadsCreated;
    private Long totalRepliesGiven;
    private Long totalUpvotesReceived;
    private Long bookmarkedThreadsCount;
    private Long totalSolutionsAccepted;
    private Long totalThreadViews;
    private List<TagContributionDto> mostActiveTags;
    private List<EngagementTrendDto> engagementTrend;
}

