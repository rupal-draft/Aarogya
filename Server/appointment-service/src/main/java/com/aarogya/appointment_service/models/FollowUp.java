package com.aarogya.appointment_service.models;

import com.aarogya.appointment_service.models.enums.FollowUpStatus;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "follow_ups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@CompoundIndexes({
        @CompoundIndex(name = "doctor_status_date_idx", def = "{'doctorId': 1, 'status': 1, 'recommendedDate': 1}"),
        @CompoundIndex(name = "patient_status_date_idx", def = "{'patientId': 1, 'status': 1, 'recommendedDate': 1}")
})
public class FollowUp {

    @Id
    private String id;

    @NotNull
    @Indexed
    private String originalAppointmentId;

    @NotNull
    @Indexed
    private String doctorId;

    @NotNull
    @Indexed
    private String patientId;

    @FutureOrPresent(message = "Recommended date must be in the present or future")
    private LocalDate recommendedDate;

    @NotBlank
    @Size(max = 500)
    private String reason;

    private FollowUpStatus status = FollowUpStatus.PENDING;

    @Size(max = 1000)
    private String notes;

    @Min(1)
    @Max(5)
    private Integer urgencyLevel = 1;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    private LocalDateTime completedAt;
    private String completedBy;
    private String cancellationReason;
}

