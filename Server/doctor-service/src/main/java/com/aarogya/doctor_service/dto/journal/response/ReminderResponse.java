package com.aarogya.doctor_service.dto.journal.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReminderResponse {
    private String id;
    private String entryId;
    private String title;
    private LocalDateTime reminderDate;
    private String notes;
    private Boolean isActive;
    private Boolean isRecurring;
    private String recurrencePattern;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
