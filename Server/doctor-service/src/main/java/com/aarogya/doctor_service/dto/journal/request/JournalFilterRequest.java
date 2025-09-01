package com.aarogya.doctor_service.dto.journal.request;

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
public class JournalFilterRequest {
    private String searchQuery;
    private String patientId;
    private List<String> tags;
    private List<String> types;
    private List<String> priorities;
    private Boolean bookmarked;
    private Boolean pinned;
    private Boolean hasReminder;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String sortBy;
    private String sortOrder;
    private Boolean includeInactive;
    private Integer page;
    private Integer size;
}