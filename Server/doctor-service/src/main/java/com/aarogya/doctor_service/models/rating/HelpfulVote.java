package com.aarogya.doctor_service.models.rating;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "rating_helpful_votes")
@CompoundIndex(def = "{'ratingId': 1, 'patientId': 1}", unique = true)
public class HelpfulVote {
    @Id
    private String id;

    @NotBlank
    private String ratingId;

    @NotBlank
    private String patientId;

    @CreatedDate
    private LocalDateTime createdAt;
}
