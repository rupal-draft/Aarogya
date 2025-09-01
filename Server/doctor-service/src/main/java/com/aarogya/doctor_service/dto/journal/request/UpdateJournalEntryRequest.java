package com.aarogya.doctor_service.dto.journal.request;

import jakarta.validation.constraints.Size;
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
public class UpdateJournalEntryRequest {
    @Size(min = 1, max = 200, message = "Title must be between 1 and 200 characters")
    private String title;

    @Size(min = 1, max = 10000, message = "Content must be between 1 and 10000 characters")
    private String content;

    private String patientId;
    private List<String> tags;
    private String type;
    private String priority;
    private Boolean isBookmarked;
    private Boolean isPinned;
    private LocalDateTime reminderDate;
    private String changeSummary;
}
