package com.aarogya.prescription_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DuplicateTemplateRequest {
    @NotBlank(message = "New name is required")
    private String newName;

    private String newDescription;
}
