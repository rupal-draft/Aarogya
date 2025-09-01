package com.aarogya.doctor_service.dto.forum.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateReplyRequest {
    @NotBlank(message = "Content is required")
    @Size(min = 5, max = 2000, message = "Content must be between 5 and 2000 characters")
    private String content;

    private String parentReplyId;
    private Boolean isAnonymous;
    private Boolean isSolution;
}
