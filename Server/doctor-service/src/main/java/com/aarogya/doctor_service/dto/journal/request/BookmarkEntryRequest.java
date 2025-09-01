package com.aarogya.doctor_service.dto.journal.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookmarkEntryRequest {
    @NotBlank(message = "Entry ID is required")
    private String entryId;

    @NotNull(message = "Bookmark status is required")
    private Boolean isBookmarked;
}