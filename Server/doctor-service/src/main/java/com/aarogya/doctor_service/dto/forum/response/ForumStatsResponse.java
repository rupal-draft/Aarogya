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
public class ForumStatsResponse {
    private Integer totalThreads;
    private Integer totalReplies;
    private Integer myTotalThreads;
    private Integer activeThisWeek;
    private List<TagResponse> popularTags;
    private List<ThreadSummaryResponse> trendingThreads;
}
