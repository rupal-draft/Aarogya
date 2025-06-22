package com.aarogya.notification_service.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarkAsReadRequestDTO {
    @NotEmpty(message = "Notification IDs cannot be empty")
    private List<String> notificationIds;
}
