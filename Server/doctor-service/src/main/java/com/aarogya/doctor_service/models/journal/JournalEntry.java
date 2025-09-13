package com.aarogya.doctor_service.models.journal;

import com.aarogya.doctor_service.enums.journal.EntryType;
import com.aarogya.doctor_service.enums.journal.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "journal_entries")
@CompoundIndexes({
        @CompoundIndex(def = "{'doctorId': 1, 'isActive': 1}"),         
        @CompoundIndex(def = "{'doctorId': 1, 'tags': 1, 'isActive': 1}"),
        @CompoundIndex(def = "{'doctorId': 1, 'createdAt': -1}")
})
public class JournalEntry {
    @Id
    private String id;

    @NotBlank
    @Indexed
    private String doctorId;

    private String patientId;
    private String patientName;

    @NotBlank
    @Size(min = 1, max = 200)
    private String title;

    @NotBlank
    @Size(min = 1, max = 10000)
    private String content;

    @Builder.Default
    private List<String> tags = new ArrayList<>();

    @Builder.Default
    private EntryType type = EntryType.NOTE;

    @Builder.Default
    private Priority priority = Priority.NORMAL;

    @Builder.Default
    private Boolean isBookmarked = false;

    @Builder.Default
    private Boolean isPinned = false;

    @Builder.Default
    private Boolean isActive = true;

    @Builder.Default
    private Boolean isEncrypted = false;

    private String encryptionKeyHash;

    @Builder.Default
    private Integer wordCount = 0;

    @Builder.Default
    private Integer version = 1;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    private LocalDateTime reminderDate;

    @Version
    private Long optimisticLock;
}
