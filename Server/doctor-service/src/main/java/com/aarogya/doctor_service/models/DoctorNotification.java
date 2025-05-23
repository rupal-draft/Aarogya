package com.aarogya.doctor_service.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "doctor_notifications")
public class DoctorNotification {

    @Id
    private String id;

    @Indexed
    private String doctorId;

    private String type;
    private String title;
    private String message;
    private String relatedEntityId;
    private String relatedEntityType;
    private boolean read;
    private String actionUrl;

    @CreatedDate
    private LocalDateTime createdAt;
}
