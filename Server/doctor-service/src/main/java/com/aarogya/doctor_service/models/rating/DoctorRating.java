package com.aarogya.doctor_service.models.rating;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "doctor_ratings")
@CompoundIndex(def = "{'doctorId': 1, 'patientId': 1}", unique = true)
@CompoundIndex(def = "{'doctorId': 1, 'createdAt': -1}")
@CompoundIndex(def = "{'doctorId': 1, 'rating': 1}")
public class DoctorRating {
    @Id
    private String id;

    @NotBlank
    @Indexed
    private String doctorId;

    @NotBlank
    @Indexed
    private String patientId;

    private String patientName;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer rating;

    @Size(max = 1000)
    private String review;

    private String appointmentId;
    private String prescriptionId;

    private List<String> tags;
    private Boolean wouldRecommend;
    private Integer waitTimeRating;
    private Integer staffRating;
    private Integer facilityRating;

    @Builder.Default
    private Boolean isVerified = false;

    @Builder.Default
    private Boolean isAnonymous = false;

    @Builder.Default
    private Integer helpfulCount = 0;

    @Builder.Default
    private Integer reportCount = 0;

    @Builder.Default
    private Boolean isActive = true;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Version
    private Long version;
}
