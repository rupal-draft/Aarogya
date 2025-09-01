package com.aarogya.doctor_service.dto.journal.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JournalStatsResponse {
    private Integer totalEntries;
    private Integer activeEntries;
    private Integer bookmarkedEntries;
    private Integer pinnedEntries;
    private Integer totalWords;
    private Integer patientNotes;
    private Integer personalNotes;
    private Map<String, Integer> tagStatistics;
    private Map<String, Integer> typeStatistics;
    private LocalDateTime lastEntryDate;
    private Integer entriesThisWeek;
    private Integer entriesThisMonth;
}
