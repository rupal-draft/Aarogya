package com.aarogya.doctor_service.dto.journal.request;

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
public class ExportRequest {
    private List<String> entryIds;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private List<String> tags;
    private String format;
    private Boolean includeVersions;
    private Boolean includeMetadata;
}
