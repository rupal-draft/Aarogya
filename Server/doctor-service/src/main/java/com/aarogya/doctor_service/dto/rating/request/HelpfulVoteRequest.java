package com.aarogya.doctor_service.dto.rating.request;

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
public class HelpfulVoteRequest {
    @NotBlank(message = "Rating ID is required")
    private String ratingId;

    @NotNull(message = "Helpful status is required")
    private Boolean isHelpful;
}