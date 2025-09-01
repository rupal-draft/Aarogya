package com.aarogya.doctor_service.dto.forum.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateThreadRequest {
    @Size(min = 10, max = 200, message = "Title must be between 10 and 200 characters")
    private String title;

    @Size(min = 20, max = 5000, message = "Content must be between 20 and 5000 characters")
    private String content;

    private List<String> tags;
    private Boolean isClosed;
    private String closedReason;
}
