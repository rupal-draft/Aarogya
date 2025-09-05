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
public class JournalDashboardResponse {
    private Long totalEntries;
    private Long activeEntries;
    private Long archivedEntries;
    private Double avgWordsPerEntry;
    private Long totalWordsWritten;
    private Long patientNotesCount;
    private Long personalNotesCount;
    private Long bookmarksCount;
    private Double modificationRatio;
    private Double avgVersionsPerEntry;
    private Long upcomingReminders;
    private Long recurringReminders;
    private Long totalTemplates;
    private List<JournalTemplateUsageDto> topTemplates;
    private List<JournalTagUsageDto> topTags;
    private List<JournalTrendDto> monthlyTrends;
}
