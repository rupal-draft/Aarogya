package com.aarogya.appointment_service.events;

import com.aarogya.appointment_service.models.enums.FollowUpStatus;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FollowUpNotificationData {
    private String followUpId;
    private String originalAppointmentId;
    private String doctorName;
    private String patientName;
    private LocalDate recommendedDate;
    private FollowUpStatus status;
    private String reason;
    private String notes;
    private Integer urgencyLevel;
}
