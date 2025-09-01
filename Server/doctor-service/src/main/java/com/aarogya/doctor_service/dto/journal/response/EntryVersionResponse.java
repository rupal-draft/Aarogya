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
public class EntryVersionResponse {
    private String id;
    private Integer version;
    private String title;
    private String contentPreview;
    private List<String> tags;
    private String changeSummary;
    private LocalDateTime createdAt;
}
