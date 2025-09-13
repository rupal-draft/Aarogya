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
public class JournalEntryResponse {
    private String id;
    private String doctorId;
    private String patientId;
    private String patientName;
    private String title;
    private String content;
    private List<String> tags;
    private String type;
    private String priority;
    private Boolean isBookmarked;
    private Boolean isPinned;
    private Boolean isActive;
    private Boolean isEncrypted;
    private Integer wordCount;
    private Integer version;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime reminderDate;
    private Boolean hasReminder;
    private List<EntryVersionResponse> versionHistory;
}
