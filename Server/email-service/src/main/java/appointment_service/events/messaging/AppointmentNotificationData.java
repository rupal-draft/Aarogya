package appointment_service.events.messaging;

import appointment_service.events.enums.AppointmentStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentNotificationData {
    private String appointmentId;
    private String doctorName;
    private String patientName;
    private String patientImage;
    private String doctorImage;
    private LocalDate appointmentDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private AppointmentStatus status;
    private AppointmentStatus previousStatus;
    private String meetingLink;
    private String reason;
    private String notes;
}
