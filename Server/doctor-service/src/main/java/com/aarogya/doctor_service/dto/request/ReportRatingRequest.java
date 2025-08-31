package com.aarogya.doctor_service.dto.request;

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
public class ReportRatingRequest {
    @NotBlank(message = "Rating ID is required")
    private String ratingId;

    @NotBlank(message = "Reason is required")
    private String reason;

    @Size(max = 500, message = "Details cannot exceed 500 characters")
    private String details;
}
