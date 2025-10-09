package com.aarogya.doctor_service.dto.journal.response;

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
public class JournalEntrySummaryResponse {
    private String id;
    private String title;
    private String contentPreview;
    private String patientId;
    private String patientName;
    private List<String> tags;
    private String type;
    private String priority;
    private Boolean isBookmarked;
    private Boolean isEncrypted;
    private Boolean isPinned;
    private Integer wordCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean hasReminder;
}
