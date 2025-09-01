package com.aarogya.doctor_service.models.journal;

import com.aarogya.doctor_service.enums.journal.EntryType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "journal_templates")
@CompoundIndex(def = "{'doctorId': 1, 'isActive': 1}")
public class JournalTemplate {
    @Id
    private String id;

    @NotBlank
    private String doctorId;

    @NotBlank
    @Size(min = 1, max = 100)
    private String name;

    private String description;

    @NotBlank
    @Size(min = 1, max = 200)
    private String titleTemplate;

    @NotBlank
    @Size(min = 1, max = 5000)
    private String contentTemplate;

    @Builder.Default
    private List<String> defaultTags = new ArrayList<>();

    @Builder.Default
    private EntryType defaultType = EntryType.NOTE;

    @Builder.Default
    private Boolean isActive = true;

    @Builder.Default
    private Boolean isSystem = false;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
