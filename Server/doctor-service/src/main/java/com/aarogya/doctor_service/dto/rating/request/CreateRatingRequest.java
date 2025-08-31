package com.aarogya.doctor_service.dto.rating.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateRatingRequest {
    @NotBlank(message = "Doctor ID is required")
    private String doctorId;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be between 1 and 5")
    @Max(value = 5, message = "Rating must be between 1 and 5")
    private Integer rating;

    @Size(max = 1000, message = "Review cannot exceed 1000 characters")
    private String review;

    private String appointmentId;
    private String prescriptionId;

    private List<String> tags;
    private Boolean wouldRecommend;

    @Min(value = 1, message = "Wait time rating must be between 1 and 5")
    @Max(value = 5, message = "Wait time rating must be between 1 and 5")
    private Integer waitTimeRating;

    @Min(value = 1, message = "Staff rating must be between 1 and 5")
    @Max(value = 5, message = "Staff rating must be between 1 and 5")
    private Integer staffRating;

    @Min(value = 1, message = "Facility rating must be between 1 and 5")
    @Max(value = 5, message = "Facility rating must be between 1 and 5")
    private Integer facilityRating;

    private Boolean isAnonymous;
}
