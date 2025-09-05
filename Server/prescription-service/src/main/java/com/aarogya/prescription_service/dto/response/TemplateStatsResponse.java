package com.aarogya.prescription_service.dto.response;

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
public class TemplateStatsResponse {
    private Integer totalTemplates;
    private Integer favoriteTemplates;
    private Integer sharedTemplates;
    private Integer totalUsageCount;
    private Integer usageThisMonth;
    private Integer usageThisWeek;
    private Map<String, Integer> mostUsedTemplates;
    private Map<String, Integer> categoryUsage;
    private LocalDateTime lastUsedDate;
}