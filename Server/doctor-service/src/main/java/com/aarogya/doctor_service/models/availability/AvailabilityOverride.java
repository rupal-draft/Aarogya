package com.aarogya.doctor_service.models.availability;

import com.aarogya.doctor_service.enums.availability.OverrideType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "availability_overrides")
@CompoundIndex(def = "{'doctorId': 1, 'date': 1}", unique = true)
public class AvailabilityOverride {
    @Id
    private String id;

    @NotBlank
    private String doctorId;

    @NotNull
    private LocalDate date;

    @NotNull
    @Builder.Default
    private OverrideType overrideType = OverrideType.UNAVAILABLE;

    private String reason;

    @Builder.Default
    private List<TimeRange> affectedTimeRanges = List.of();

    @Builder.Default
    private Boolean isActive = true;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}