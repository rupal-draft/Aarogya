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
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "doctor_availability")
@CompoundIndex(def = "{'doctorId': 1, 'date': 1}", unique = true)
@CompoundIndex(def = "{'doctorId': 1, 'isActive': 1}")
public class DoctorAvailability {
    @Id
    private String id;

    @NotBlank
    @Indexed
    private String doctorId;

    @NotNull
    private LocalDate date;

    @NotNull
    @Builder.Default
    private Boolean isAvailable = true;

    private String reasonForUnavailability;

    @NotNull
    @Builder.Default
    private List<TimeSlot> timeSlots = List.of();

    @NotNull
    @Builder.Default
    private Integer slotDurationMinutes = 30;

    @NotNull
    @Builder.Default
    private Integer maxPatientsPerSlot = 1;

    @Builder.Default
    private Boolean isActive = true;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Version
    private Long version;
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class TimeSlot {
    @NotNull
    private LocalTime startTime;

    @NotNull
    private LocalTime endTime;

    @Builder.Default
    private Integer bookedCount = 0;

    @Builder.Default
    private Integer availableSlots = 1;

    @Builder.Default
    private Boolean isAvailable = true;

    private String reasonForUnavailability;
}