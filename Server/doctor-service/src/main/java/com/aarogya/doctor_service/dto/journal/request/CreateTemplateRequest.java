package com.aarogya.doctor_service.dto.journal.request;

import jakarta.validation.constraints.NotBlank;
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
public class CreateTemplateRequest {
    @NotBlank(message = "Name is required")
    @Size(min = 1, max = 100, message = "Name must be between 1 and 100 characters")
    private String name;

    private String description;

    @NotBlank(message = "Title template is required")
    @Size(min = 1, max = 200, message = "Title template must be between 1 and 200 characters")
    private String titleTemplate;

    @NotBlank(message = "Content template is required")
    @Size(min = 1, max = 5000, message = "Content template must be between 1 and 5000 characters")
    private String contentTemplate;

    private List<String> defaultTags;
    private String defaultType;
    private String category;
}
