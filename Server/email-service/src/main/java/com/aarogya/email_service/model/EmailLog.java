package com.aarogya.email_service.model;

import com.aarogya.email_service.enums.EmailStatus;
import com.aarogya.email_service.enums.EmailType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "email_logs")
@CompoundIndexes({
        @CompoundIndex(name = "recipient_status_idx", def = "{'recipientEmail': 1, 'status': 1}"),
        @CompoundIndex(name = "type_status_created_idx", def = "{'emailType': 1, 'status': 1, 'createdAt': -1}"),
        @CompoundIndex(name = "status_created_idx", def = "{'status': 1, 'createdAt': -1}")
})
public class EmailLog {
    @Id
    private String id;

    @Indexed
    private String recipientEmail;

    private String recipientName;

    private String subject;

    @Indexed
    private EmailType emailType;

    @Indexed
    private EmailStatus status;

    private String templateName;

    private Map<String, Object> templateData;

    private String errorMessage;

    private Integer retryCount = 0;

    private Integer maxRetries = 3;

    @CreatedDate
    @Indexed
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    private LocalDateTime sentAt;

    private String messageId;

    private String correlationId;

    @Indexed
    private LocalDateTime expiresAt;
}
