package com.aarogya.email_service.dto;

import com.aarogya.email_service.enums.EmailType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailRequestDTO {
    @NotBlank(message = "Recipient email is required")
    @Email(message = "Invalid email format")
    private String recipientEmail;

    @NotBlank(message = "Recipient name is required")
    private String recipientName;

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotNull(message = "Email type is required")
    private EmailType emailType;

    private String templateName;

    private Map<String, Object> templateData;

    private String correlationId;
}
