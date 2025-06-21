package appointment_service.events.messaging;

import appointment_service.events.enums.FollowUpStatus;
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
    private String patientImageUrl;
    private String doctorImageUrl;
    private LocalDate recommendedDate;
    private FollowUpStatus status;
    private String reason;
    private String notes;
    private Integer urgencyLevel;
}
