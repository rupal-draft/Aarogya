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
import java.util.HashMap;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "journal_analytics")
@CompoundIndex(def = "{'doctorId': 1, 'date': 1}", unique = true)
public class JournalAnalytics {
    @Id
    private String id;

    @NotBlank
    private String doctorId;

    @NotNull
    private LocalDateTime date;

    @Builder.Default
    private Integer entriesCreated = 0;

    @Builder.Default
    private Integer entriesUpdated = 0;

    @Builder.Default
    private Integer totalWords = 0;

    @Builder.Default
    private Integer patientNotes = 0;

    @Builder.Default
    private Integer personalNotes = 0;

    @Builder.Default
    private Map<String, Integer> tagUsage = new HashMap<>();

    @CreatedDate
    private LocalDateTime createdAt;
}
