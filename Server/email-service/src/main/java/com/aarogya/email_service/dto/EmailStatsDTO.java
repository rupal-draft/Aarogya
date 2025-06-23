package com.aarogya.email_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailStatsDTO {
    private long totalEmails;
    private long sentEmails;
    private long failedEmails;
    private long pendingEmails;
    private double successRate;
    private long appointmentEmails;
    private long otpEmails;
    private long todayEmails;
}
