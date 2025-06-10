package com.aarogya.appointment_service.models;

import com.aarogya.appointment_service.models.enums.AppointmentStatus;
import com.aarogya.appointment_service.models.enums.AppointmentType;
import jakarta.validation.constraints.NotNull;
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
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "appointments")
@CompoundIndexes({
        @CompoundIndex(name = "doctor_date_time_idx", def = "{'doctorId': 1, 'appointmentDate': 1, 'startTime': 1}"),
        @CompoundIndex(name = "patient_date_idx", def = "{'patientId': 1, 'appointmentDate': -1}"),
        @CompoundIndex(name = "status_date_idx", def = "{'status': 1, 'appointmentDate': -1}")
})
public class Appointment {

    @Id
    private String id;

    @NotNull
    @Indexed
    private String doctorId;

    @NotNull
    @Indexed
    private String patientId;

    @NotNull
    private LocalDate appointmentDate;

    @NotNull
    private LocalTime startTime;

    @NotNull
    private LocalTime endTime;

    private AppointmentStatus status = AppointmentStatus.PENDING;

    private AppointmentType type = AppointmentType.REGULAR;

    private String reason;

    private List<String> symptoms;

    private String notes;

    private String doctorNotes;

    private Integer priority = 1;

    private String meetingLink;

    private Boolean isVirtual = false;

    private String cancellationReason;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
