package com.aarogya.doctor_service.models.journal;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "journal_bookmarks")
@CompoundIndex(def = "{'doctorId': 1, 'entryId': 1}", unique = true)
public class JournalBookmark {
    @Id
    private String id;

    @NotBlank
    private String doctorId;

    @NotBlank
    private String entryId;

    @CreatedDate
    private LocalDateTime bookmarkedAt;
}
