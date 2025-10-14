package com.aarogya.doctor_service.seeder;

import com.aarogya.doctor_service.enums.availability.DayOfWeek;
import com.aarogya.doctor_service.enums.availability.OverrideType;
import com.aarogya.doctor_service.enums.availability.RecurrenceType;
import com.aarogya.doctor_service.models.availability.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class AvailabilitySeeder implements CommandLineRunner {

    private final MongoTemplate mongoTemplate;

    private static final String DOCTOR_ID = "68eea17f83aa7469053351d5";

    @Override
    public void run(String... args) {
        if (mongoTemplate.exists(new Query(), AvailabilitySchedule.class)
                && mongoTemplate.exists(new Query(), DoctorAvailability.class)) {
            log.info("⚠️ All collections already seeded. Skipping...");
            return;
        }

        // --- 1. Weekly Schedule ---
        AvailabilitySchedule weeklySchedule = AvailabilitySchedule.builder()
                .doctorId(DOCTOR_ID)
                .weeklySchedule(Map.of(
                        DayOfWeek.MONDAY, DailySchedule.builder()
                                .availableSlots(List.of(
                                        new TimeRange(LocalTime.of(9, 0), LocalTime.of(12, 0)),
                                        new TimeRange(LocalTime.of(14, 0), LocalTime.of(18, 0))
                                ))
                                .build(),
                        DayOfWeek.TUESDAY, DailySchedule.builder()
                                .availableSlots(List.of(new TimeRange(LocalTime.of(10, 0), LocalTime.of(16, 0))))
                                .build(),
                        DayOfWeek.WEDNESDAY, DailySchedule.builder()
                                .isAvailable(false)
                                .reasonForUnavailability("Research day")
                                .build(),
                        DayOfWeek.THURSDAY, DailySchedule.builder()
                                .availableSlots(List.of(new TimeRange(LocalTime.of(8, 0), LocalTime.of(12, 0))))
                                .build(),
                        DayOfWeek.FRIDAY, DailySchedule.builder()
                                .availableSlots(List.of(new TimeRange(LocalTime.of(10, 0), LocalTime.of(14, 0))))
                                .build()
                ))
                .bookingLeadTimeHours(24)
                .maxBookingDaysInAdvance(60)
                .defaultSlotDurationMinutes(30)
                .defaultMaxPatientsPerSlot(2)
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        mongoTemplate.save(weeklySchedule);

        // --- 2. Doctor Availability (next 5 days) ---
        for (int i = 0; i < 5; i++) {
            LocalDate date = LocalDate.now().plusDays(i);

            DoctorAvailability availability = DoctorAvailability.builder()
                    .doctorId(DOCTOR_ID)
                    .date(date)
                    .timeSlots(List.of(
                            new TimeSlot(LocalTime.of(9, 0), LocalTime.of(10, 0)),
                            new TimeSlot(LocalTime.of(10, 0), LocalTime.of(11, 0)),
                            new TimeSlot(LocalTime.of(11, 0), LocalTime.of(12, 0))
                    ))
                    .slotDurationMinutes(30)
                    .maxPatientsPerSlot(2)
                    .isAvailable(true)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            mongoTemplate.save(availability);
        }

        // --- 3. Overrides ---
        AvailabilityOverride holiday = AvailabilityOverride.builder()
                .doctorId(DOCTOR_ID)
                .date(LocalDate.now().plusDays(2))
                .overrideType(OverrideType.UNAVAILABLE)
                .reason("Conference attendance")
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        AvailabilityOverride extendedHours = AvailabilityOverride.builder()
                .doctorId(DOCTOR_ID)
                .date(LocalDate.now().plusDays(3))
                .overrideType(OverrideType.EXTENDED_HOURS)
                .affectedTimeRanges(List.of(new TimeRange(LocalTime.of(18, 0), LocalTime.of(20, 0))))
                .reason("Evening clinic")
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        mongoTemplate.save(holiday);
        mongoTemplate.save(extendedHours);

        // --- 4. Recurring Unavailability ---
        RecurringUnavailability weeklyOff = RecurringUnavailability.builder()
                .doctorId(DOCTOR_ID)
                .title("Weekly Off")
                .description("Doctor is unavailable every Sunday")
                .recurrencePattern(RecurrencePattern.builder()
                        .type(RecurrenceType.WEEKLY)
                        .daysOfWeek(List.of(DayOfWeek.SUNDAY))
                        .startDate(LocalDate.now())
                        .build())
                .timeRange(new TimeRange(LocalTime.of(0, 0), LocalTime.of(23, 59)))
                .isAllDay(true)
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        mongoTemplate.save(weeklyOff);

        // --- 5. Special Availability ---
        SpecialAvailability campDay = SpecialAvailability.builder()
                .doctorId(DOCTOR_ID)
                .date(LocalDate.now().plusDays(7))
                .title("Health Camp")
                .description("Special community camp with extended slots")
                .isAvailable(true)
                .customSlots(List.of(
                        new TimeRange(LocalTime.of(8, 0), LocalTime.of(12, 0)),
                        new TimeRange(LocalTime.of(13, 0), LocalTime.of(17, 0))
                ))
                .customSlotDuration(20)
                .customMaxPatients(5)
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        mongoTemplate.save(campDay);

        log.info("✅ Seeded: WeeklySchedule(1), DoctorAvailability(5), Overrides(2), RecurringUnavailability(1), SpecialAvailability(1)");
    }
}

