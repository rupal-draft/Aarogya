package com.aarogya.lab_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HealthInsightDto {

    private String type;
    private String title;
    private String message;
    private String severity;
    private List<String> recommendations;
    private String actionRequired;
    private String learnMoreUrl;
    private LocalDateTime generatedAt = LocalDateTime.now();
    private Boolean isActionable;
    private String iconType;
}

