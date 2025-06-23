package com.aarogya.email_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserEmailStatsDTO {
    private long totalEmails;
    private long appointmentEmails;
    private long otpEmails;
    private long thisMonthEmails;
    private long lastEmailDaysAgo;
}
