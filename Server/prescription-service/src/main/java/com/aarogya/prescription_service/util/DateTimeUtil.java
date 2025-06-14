package com.aarogya.prescription_service.util;

import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.time.format.DateTimeFormatter;

@Component
public class DateTimeUtil {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public String formatDate(LocalDate date) {
        return date != null ? date.format(DATE_FORMATTER) : null;
    }

    public String formatDateTime(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(DATETIME_FORMATTER) : null;
    }

    public LocalDate parseDate(String dateString) {
        return dateString != null ? LocalDate.parse(dateString, DATE_FORMATTER) : null;
    }

    public LocalDateTime parseDateTime(String dateTimeString) {
        return dateTimeString != null ? LocalDateTime.parse(dateTimeString, DATETIME_FORMATTER) : null;
    }

    public int calculateAge(LocalDate birthDate) {
        if (birthDate == null) {
            return 0;
        }
        return Period.between(birthDate, LocalDate.now()).getYears();
    }

    public boolean isExpired(LocalDateTime expiryDateTime) {
        return expiryDateTime != null && expiryDateTime.isBefore(LocalDateTime.now());
    }

    public boolean isExpiringSoon(LocalDateTime expiryDateTime, int daysThreshold) {
        if (expiryDateTime == null) {
            return false;
        }
        LocalDateTime threshold = LocalDateTime.now().plusDays(daysThreshold);
        return expiryDateTime.isBefore(threshold);
    }

    public long daysBetween(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            return 0;
        }
        return Period.between(startDate, endDate).getDays();
    }

    public LocalDateTime addDays(LocalDateTime dateTime, int days) {
        return dateTime != null ? dateTime.plusDays(days) : null;
    }

    public LocalDateTime addHours(LocalDateTime dateTime, int hours) {
        return dateTime != null ? dateTime.plusHours(hours) : null;
    }

    public boolean isWithinRange(LocalDateTime dateTime, LocalDateTime start, LocalDateTime end) {
        if (dateTime == null || start == null || end == null) {
            return false;
        }
        return !dateTime.isBefore(start) && !dateTime.isAfter(end);
    }
}
