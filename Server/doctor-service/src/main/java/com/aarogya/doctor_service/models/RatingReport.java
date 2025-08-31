package com.aarogya.doctor_service.models;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "rating_reports")
@CompoundIndex(def = "{'ratingId': 1, 'reporterId': 1}", unique = true)
public class RatingReport {
    @Id
    private String id;

    @NotBlank
    private String ratingId;

    @NotBlank
    private String reporterId;

    @NotBlank
    private String reason;

    @Size(max = 500)
    private String details;

    @Builder.Default
    private Boolean isResolved = false;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
