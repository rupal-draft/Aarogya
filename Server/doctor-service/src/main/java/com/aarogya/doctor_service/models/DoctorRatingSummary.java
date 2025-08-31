package com.aarogya.doctor_service.models;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "doctor_rating_summaries")
@CompoundIndex(def = "{'doctorId': 1}", unique = true)
public class DoctorRatingSummary {
    @Id
    private String id;

    @NotBlank
    @Indexed(unique = true)
    private String doctorId;

    @Builder.Default
    private Double averageRating = 0.0;

    @Builder.Default
    private Integer totalRatings = 0;

    @Builder.Default
    private Integer rating1Count = 0;

    @Builder.Default
    private Integer rating2Count = 0;

    @Builder.Default
    private Integer rating3Count = 0;

    @Builder.Default
    private Integer rating4Count = 0;

    @Builder.Default
    private Integer rating5Count = 0;

    @Builder.Default
    private Double averageWaitTimeRating = 0.0;

    @Builder.Default
    private Double averageStaffRating = 0.0;

    @Builder.Default
    private Double averageFacilityRating = 0.0;

    @Builder.Default
    private Double recommendationRate = 0.0;

    private Map<String, Integer> tagFrequency;

    @LastModifiedDate
    private LocalDateTime lastUpdated;
}
