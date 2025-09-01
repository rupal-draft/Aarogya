package com.aarogya.doctor_service.models.journal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "journal_reminders")
@CompoundIndex(def = "{'doctorId': 1, 'reminderDate': 1}")
public class JournalReminder {
    @Id
    private String id;

    @NotBlank
    private String doctorId;

    @NotBlank
    private String entryId;

    @NotBlank
    private String title;

    @NotNull
    private LocalDateTime reminderDate;

    private String notes;

    @Builder.Default
    private Boolean isActive = true;

    @Builder.Default
    private Boolean isRecurring = false;

    private String recurrencePattern;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}

