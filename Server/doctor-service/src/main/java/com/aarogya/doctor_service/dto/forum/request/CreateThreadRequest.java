package com.aarogya.doctor_service.dto.forum.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
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
public class CreateThreadRequest {
    @NotBlank(message = "Title is required")
    @Size(min = 10, max = 200, message = "Title must be between 10 and 200 characters")
    private String title;

    @NotBlank(message = "Content is required")
    @Size(min = 20, max = 5000, message = "Content must be between 20 and 5000 characters")
    private String content;

    @NotEmpty(message = "At least one tag is required")
    private List<String> tags;

    private String type;
    private Boolean isAnonymous;
}
