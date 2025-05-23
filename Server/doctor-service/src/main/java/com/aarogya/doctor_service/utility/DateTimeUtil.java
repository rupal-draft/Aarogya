package com.aarogya.doctor_service.utility;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class DateTimeUtil {

    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    public static LocalTime parseTime(String time) {
        return LocalTime.parse(time, TIME_FORMATTER);
    }

    public static String formatTime(LocalTime time) {
        return time.format(TIME_FORMATTER);
    }

    public static int getDayOfWeek(LocalDate date) {
        DayOfWeek dayOfWeek = date.getDayOfWeek();
        return (dayOfWeek.getValue() % 7);
    }

    public static List<LocalTime> generateTimeSlots(LocalTime startTime, LocalTime endTime, int slotDurationMinutes,
                                                    LocalTime breakStart, LocalTime breakEnd) {
        List<LocalTime> slots = new ArrayList<>();
        LocalTime currentTime = startTime;

        while (currentTime.isBefore(endTime)) {
            if (breakStart != null && breakEnd != null) {
                if (!(currentTime.isAfter(breakStart.minusMinutes(1)) && currentTime.isBefore(breakEnd))) {
                    slots.add(currentTime);
                }
            } else {
                slots.add(currentTime);
            }

            currentTime = currentTime.plusMinutes(slotDurationMinutes);
        }

        return slots;
    }
}
