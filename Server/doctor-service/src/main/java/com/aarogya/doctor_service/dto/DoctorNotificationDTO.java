package com.aarogya.doctor_service.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorNotificationDTO {
    private String id;
    private String doctorId;
    private String type;
    private String title;
    private String message;
    private String relatedEntityId;
    private String relatedEntityType;
    private boolean read;
    private String actionUrl;
    private LocalDateTime createdAt;
}
