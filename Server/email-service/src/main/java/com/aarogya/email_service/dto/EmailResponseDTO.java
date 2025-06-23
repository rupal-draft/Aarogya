package com.aarogya.email_service.dto;

import com.aarogya.email_service.enums.EmailStatus;
import com.aarogya.email_service.enums.EmailType;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailResponseDTO {
    private String id;
    private String recipientEmail;
    private String recipientName;
    private String subject;
    private EmailType emailType;
    private EmailStatus status;
    private String errorMessage;
    private Integer retryCount;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime sentAt;

    private String messageId;
    private String correlationId;
}
