package com.aarogya.doctor_service.dto.journal.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateReminderRequest {
    @NotBlank(message = "Entry ID is required")
    private String entryId;

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Reminder date is required")
    private LocalDateTime reminderDate;

    private String notes;
    private Boolean isRecurring;
    private String recurrencePattern;
}