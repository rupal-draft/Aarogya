package com.aarogya.doctor_service.models.journal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "journal_entry_versions")
@CompoundIndex(def = "{'entryId': 1, 'version': 1}")
public class JournalEntryVersion {
    @Id
    private String id;

    @NotBlank
    private String entryId;

    @NotBlank
    private String doctorId;

    private String title;
    private String content;
    private List<String> tags;

    @NotNull
    private Integer version;

    @CreatedDate
    private LocalDateTime createdAt;

    private String changeSummary;
}

