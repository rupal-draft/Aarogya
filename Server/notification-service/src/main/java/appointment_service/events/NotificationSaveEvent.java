package appointment_service.events;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationSaveEvent {
    private String userId;
    private SaveNotificationType type;
    private String title;
    private Map<String, Object> data;
    private LocalDateTime timestamp;
    private boolean read;

    @JsonFormat(shape = JsonFormat.Shape.STRING)
    public enum SaveNotificationType {
        APPOINTMENT,
        FOLLOWUP
    }
}