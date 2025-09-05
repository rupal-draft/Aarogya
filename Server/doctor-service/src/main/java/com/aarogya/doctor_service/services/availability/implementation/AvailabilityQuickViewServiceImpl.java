package com.aarogya.doctor_service.services.availability.implementation;

import com.aarogya.doctor_service.dto.availability.response.CalendarDayQuickViewDto;
import com.aarogya.doctor_service.dto.availability.response.CalendarQuickViewResponse;
import com.aarogya.doctor_service.enums.availability.OverrideType;
import com.aarogya.doctor_service.models.availability.AvailabilityOverride;
import com.aarogya.doctor_service.models.availability.DoctorAvailability;
import com.aarogya.doctor_service.models.availability.SpecialAvailability;
import com.aarogya.doctor_service.repositories.availability.AvailabilityOverrideRepository;
import com.aarogya.doctor_service.repositories.availability.DoctorAvailabilityRepository;
import com.aarogya.doctor_service.repositories.availability.SpecialAvailabilityRepository;
import com.aarogya.doctor_service.services.availability.AvailabilityQuickViewService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AvailabilityQuickViewServiceImpl implements AvailabilityQuickViewService {

    private final DoctorAvailabilityRepository doctorAvailabilityRepo;
    private final AvailabilityOverrideRepository availabilityOverrideRepo;
    private final SpecialAvailabilityRepository specialAvailabilityRepo;

    @Override
    @Cacheable(value = "doctorCalendarQuickView", key = "#doctorId + '-' + #month.toString()")
    public CalendarQuickViewResponse getQuickView(String doctorId, YearMonth month) {
        LocalDate start = month.atDay(1);
        LocalDate end = month.atEndOfMonth();

        List<DoctorAvailability> availabilities =
                doctorAvailabilityRepo.findByDoctorIdAndDateBetweenAndIsActiveTrue(doctorId, start, end);

        Map<LocalDate, DoctorAvailability> availabilityMap = availabilities.stream()
                .collect(Collectors.toMap(DoctorAvailability::getDate, a -> a));

        List<AvailabilityOverride> overrides =
                availabilityOverrideRepo.findByDoctorIdAndDateBetweenAndIsActiveTrue(doctorId, start, end);

        Map<LocalDate, AvailabilityOverride> overrideMap = overrides.stream()
                .collect(Collectors.toMap(AvailabilityOverride::getDate, o -> o));

        List<SpecialAvailability> specials =
                specialAvailabilityRepo.findByDoctorIdAndDateBetweenAndIsActiveTrue(doctorId, start, end);

        Map<LocalDate, SpecialAvailability> specialMap = specials.stream()
                .collect(Collectors.toMap(SpecialAvailability::getDate, s -> s));

//        Map<LocalDate, Long> bookedCounts =
//                appointmentRepo.countByDoctorIdAndDateBetweenGrouped(doctorId, start, end);

        List<CalendarDayQuickViewDto> days = new ArrayList<>();
        for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {
            DoctorAvailability availability = availabilityMap.get(date);
            AvailabilityOverride override = overrideMap.get(date);
            SpecialAvailability special = specialMap.get(date);

            int totalSlots = (availability != null) ?
                    availability.getTimeSlots().size() : 0;

//            long booked = bookedCounts.getOrDefault(date, 0L);
            int freeSlots = Math.max(totalSlots - (int) 0L, 0);

            boolean isAvailable = (availability != null && availability.getIsAvailable());

            String status = isAvailable
                    ? (freeSlots == 0 ? "FULL" : "AVAILABLE")
                    : "UNAVAILABLE";

            String note = null;
            if (override != null) {
                note = override.getReason();
                status = "OVERRIDDEN";
                isAvailable = override.getOverrideType() == OverrideType.AVAILABLE;
            } else if (special != null) {
                note = special.getTitle();
                status = "SPECIAL";
                isAvailable = special.getIsAvailable();
            }

            days.add(CalendarDayQuickViewDto.builder()
                    .date(date)
                    .isAvailable(isAvailable)
                    .totalSlots(totalSlots)
//                    .bookedSlots((int) booked)
                    .freeSlots(freeSlots)
                    .status(status)
                    .note(note)
                    .build());
        }

        return CalendarQuickViewResponse.builder()
                .doctorId(doctorId)
                .month(month)
                .days(days)
                .build();
    }
}
