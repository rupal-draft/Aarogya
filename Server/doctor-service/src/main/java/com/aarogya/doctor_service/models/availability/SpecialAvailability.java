package com.aarogya.doctor_service.models.availability;

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
@Document(collection = "special_availability")
@CompoundIndex(def = "{'doctorId': 1, 'date': 1}", unique = true)
public class SpecialAvailability {
    @Id
    private String id;

    @NotBlank
    private String doctorId;

    @NotNull
    private LocalDate date;

    @NotBlank
    private String title;

    private String description;

    @NotNull
    @Builder.Default
    private Boolean isAvailable = true;

    private String reason;

    @NotNull
    @Builder.Default
    private List<TimeRange> customSlots = List.of();

    @Builder.Default
    private Integer customSlotDuration = null;

    @Builder.Default
    private Integer customMaxPatients = null;

    @Builder.Default
    private Boolean isActive = true;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
