package com.aarogya.doctor_service.services.availability.implementation;

import com.aarogya.doctor_service.auth.UserContextHolder;
import com.aarogya.doctor_service.dto.availability.request.*;
import com.aarogya.doctor_service.dto.availability.response.*;
import com.aarogya.doctor_service.enums.availability.AvailabilityStatus;
import com.aarogya.doctor_service.enums.availability.OverrideType;
import com.aarogya.doctor_service.enums.availability.RecurrenceType;
import com.aarogya.doctor_service.exceptions.BadRequestException;
import com.aarogya.doctor_service.exceptions.ResourceNotFoundException;
import com.aarogya.doctor_service.models.availability.*;
import com.aarogya.doctor_service.repositories.availability.*;
import com.aarogya.doctor_service.services.availability.AvailabilityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.aarogya.doctor_service.enums.availability.DayOfWeek;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class AvailabilityServiceImpl implements AvailabilityService {

    private final DoctorAvailabilityRepository availabilityRepository;
    private final AvailabilityScheduleRepository scheduleRepository;
    private final RecurringUnavailabilityRepository recurringUnavailabilityRepository;
    private final SpecialAvailabilityRepository specialAvailabilityRepository;
    private final AvailabilityOverrideRepository overrideRepository;

    private static final String AVAILABILITY_CACHE = "doctorAvailability";
    private static final String SCHEDULE_CACHE = "doctorSchedule";

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = AVAILABILITY_CACHE, key = "#request.date.toString()"),
            @CacheEvict(value = AVAILABILITY_CACHE, key = "'range_' + #request.date.toString()")
    })
    public AvailabilityResponse setAvailability(AvailabilityRequest request) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Setting availability for doctor {} on date {}", doctorId, request.getDate());

        validateAvailabilityRequest(request);

        Optional<DoctorAvailability> existingAvailability = availabilityRepository.findByDoctorIdAndDate(doctorId, request.getDate());

        DoctorAvailability availability;
        if (existingAvailability.isPresent()) {
            availability = existingAvailability.get();
            updateAvailabilityFields(availability, request);
        } else {
            availability = buildAvailability(doctorId, request);
        }

        DoctorAvailability savedAvailability = availabilityRepository.save(availability);
        log.info("Availability set successfully for date {}", request.getDate());

        return convertToResponse(savedAvailability);
    }

    @Override
    @Cacheable(value = AVAILABILITY_CACHE, key = "#date.toString()")
    public AvailabilityResponse getAvailability(LocalDate date) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.debug("Fetching availability for doctor {} on date {}", doctorId, date);

        DoctorAvailability availability = availabilityRepository.findByDoctorIdAndDate(doctorId, date)
                .orElseGet(() -> generateAvailabilityForDate(doctorId, date));

        return convertToResponse(availability);
    }

    @Override
    @Cacheable(value = AVAILABILITY_CACHE, key = "'range_' + #request.startDate.toString() + '_' + #request.endDate.toString()")
    public AvailabilityRangeResponse getAvailabilityRange(AvailabilityRangeRequest request) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.debug("Fetching availability range for doctor {} from {} to {}", doctorId, request.getStartDate(), request.getEndDate());

        validateDateRange(request.getStartDate(), request.getEndDate());

        List<DoctorAvailability> availabilities = new ArrayList<>();
        Map<LocalDate, AvailabilityStatus> summary = new LinkedHashMap<>();

        LocalDate currentDate = request.getStartDate();
        while (!currentDate.isAfter(request.getEndDate())) {
            final LocalDate loopDate = currentDate;

            DoctorAvailability availability = availabilityRepository.findByDoctorIdAndDate(doctorId, loopDate)
                    .orElseGet(() -> generateAvailabilityForDate(doctorId, loopDate));

            if (Boolean.TRUE.equals(request.getIncludeSlots())) {
                availabilities.add(availability);
            }

            summary.put(loopDate, calculateAvailabilityStatus(availability));
            currentDate = currentDate.plusDays(1);
        }


        long availableDays = summary.values().stream().filter(status -> status == AvailabilityStatus.AVAILABLE).count();
        long unavailableDays = summary.values().stream().filter(status -> status == AvailabilityStatus.UNAVAILABLE).count();

        return AvailabilityRangeResponse.builder()
                .doctorId(doctorId)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .availabilities(availabilities.stream().map(this::convertToResponse).collect(Collectors.toList()))
                .availabilitySummary(summary)
                .totalAvailableDays((int) availableDays)
                .totalUnavailableDays((int) unavailableDays)
                .build();
    }

    @Override
    @Cacheable(value = SCHEDULE_CACHE, key = "'schedule'")
    public ScheduleResponse getSchedule() {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.debug("Fetching schedule for doctor {}", doctorId);

        AvailabilitySchedule schedule = scheduleRepository.findByDoctorId(doctorId)
                .orElseGet(() -> createDefaultSchedule(doctorId));

        return convertToScheduleResponse(schedule);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = SCHEDULE_CACHE, key = "'schedule'"),
            @CacheEvict(value = AVAILABILITY_CACHE, allEntries = true)
    })
    public ScheduleResponse updateSchedule(ScheduleRequest request) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Updating schedule for doctor {}", doctorId);

        validateScheduleRequest(request);

        AvailabilitySchedule schedule = scheduleRepository.findByDoctorId(doctorId)
                .orElseGet(() -> createDefaultSchedule(doctorId));

        updateScheduleFields(schedule, request);
        AvailabilitySchedule savedSchedule = scheduleRepository.save(schedule);

        regenerateFutureAvailabilities(doctorId);

        log.info("Schedule updated successfully for doctor {}", doctorId);
        return convertToScheduleResponse(savedSchedule);
    }

    @Override
    @Transactional
    public RecurringUnavailability createRecurringUnavailability(RecurringUnavailabilityRequest request) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Creating recurring unavailability for doctor {}", doctorId);

        validateRecurringUnavailabilityRequest(request);

        RecurringUnavailability unavailability = buildRecurringUnavailability(doctorId, request);
        RecurringUnavailability savedUnavailability = recurringUnavailabilityRepository.save(unavailability);

        regenerateFutureAvailabilities(doctorId);

        log.info("Recurring unavailability created successfully with ID: {}", savedUnavailability.getId());
        return savedUnavailability;
    }

    @Override
    public List<RecurringUnavailability> getRecurringUnavailabilities() {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.debug("Fetching recurring unavailability for doctor {}", doctorId);

        return recurringUnavailabilityRepository.findByDoctorIdAndIsActiveTrue(doctorId);
    }

    @Override
    @Transactional
    public void deleteRecurringUnavailability(String id) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Deleting recurring unavailability {} for doctor {}", id, doctorId);

        RecurringUnavailability unavailability = recurringUnavailabilityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recurring unavailability not found with id: " + id));

        recurringUnavailabilityRepository.delete(unavailability);
        regenerateFutureAvailabilities(doctorId);
        log.info("Recurring unavailability deleted successfully: {}", id);
    }

    @Override
    @Transactional
    public SpecialAvailability createSpecialAvailability(SpecialAvailabilityRequest request) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Creating special availability for doctor {} on date {}", doctorId, request.getDate());

        validateSpecialAvailabilityRequest(request);

        Optional<SpecialAvailability> existingSpecial = specialAvailabilityRepository.findByDoctorIdAndDate(doctorId, request.getDate());
        if (existingSpecial.isPresent()) {
            throw new BadRequestException("Special availability already exists for date: " + request.getDate());
        }

        SpecialAvailability specialAvailability = buildSpecialAvailability(doctorId, request);
        SpecialAvailability savedSpecial = specialAvailabilityRepository.save(specialAvailability);

        updateDailyAvailabilityWithSpecial(doctorId, request.getDate(), savedSpecial);

        log.info("Special availability created successfully with ID: {}", savedSpecial.getId());
        return savedSpecial;
    }

    @Override
    public List<SpecialAvailability> getSpecialAvailabilities() {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.debug("Fetching special availabilities for doctor {}", doctorId);

        return specialAvailabilityRepository.findByDoctorIdAndIsActiveTrue(doctorId);
    }

    @Override
    @Transactional
    public AvailabilityOverride createOverride(AvailabilityOverrideRequest request) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Creating availability override for doctor {} on date {}", doctorId, request.getDate());

        validateOverrideRequest(request);

        Optional<AvailabilityOverride> existingOverride = overrideRepository.findByDoctorIdAndDate(doctorId, request.getDate());
        if (existingOverride.isPresent()) {
            throw new BadRequestException("Override already exists for date: " + request.getDate());
        }

        AvailabilityOverride override = buildOverride(doctorId, request);
        AvailabilityOverride savedOverride = overrideRepository.save(override);

        updateDailyAvailabilityWithOverride(doctorId, request.getDate(), savedOverride);

        log.info("Availability override created successfully with ID: {}", savedOverride.getId());
        return savedOverride;
    }

    @Override
    public SlotAvailabilityResponse checkSlotAvailability(SlotAvailabilityRequest request) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.debug("Checking slot availability for doctor {} on {} from {} to {}",
                doctorId, request.getDate(), request.getStartTime(), request.getEndTime());

        DoctorAvailability availability = availabilityRepository.findByDoctorIdAndDate(doctorId, request.getDate())
                .orElseGet(() -> generateAvailabilityForDate(doctorId, request.getDate()));

        if (Boolean.FALSE.equals(availability.getIsAvailable())) {
            return SlotAvailabilityResponse.builder()
                    .isAvailable(false)
                    .availableSlots(0)
                    .bookedSlots(0)
                    .reasonIfUnavailable(availability.getReasonForUnavailability())
                    .nextAvailableSlot(findNextAvailableSlot(doctorId, request.getDate()))
                    .build();
        }

        Optional<TimeSlot> matchingSlot = availability.getTimeSlots().stream()
                .filter(TimeSlot::getIsAvailable)
                .filter(slot -> !request.getStartTime().isBefore(slot.getStartTime()))
                .filter(slot -> !request.getEndTime().isAfter(slot.getEndTime()))
                .findFirst();

        if (matchingSlot.isPresent()) {
            TimeSlot slot = matchingSlot.get();
            return SlotAvailabilityResponse.builder()
                    .isAvailable(slot.getAvailableSlots() > 0)
                    .availableSlots(slot.getAvailableSlots())
                    .bookedSlots(slot.getBookedCount())
                    .reasonIfUnavailable(slot.getAvailableSlots() == 0 ? "Fully booked" : null)
                    .nextAvailableSlot(slot.getAvailableSlots() == 0 ? findNextAvailableSlotInDay(availability) : null)
                    .build();
        }

        return SlotAvailabilityResponse.builder()
                .isAvailable(false)
                .availableSlots(0)
                .bookedSlots(0)
                .reasonIfUnavailable("No matching time slot available")
                .nextAvailableSlot(findNextAvailableSlot(doctorId, request.getDate()))
                .build();
    }

    @Override
    @Transactional
    public void generateAvailabilities(LocalDate startDate, LocalDate endDate) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Generating availabilities for doctor {} from {} to {}", doctorId, startDate, endDate);

        validateDateRange(startDate, endDate);

        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            generateAvailabilityForDate(doctorId, currentDate);
            currentDate = currentDate.plusDays(1);
        }

        log.info("Availabilities generated successfully from {} to {}", startDate, endDate);
    }

    @Override
    @Transactional
    public void updateSlotBooking(String appointmentId, LocalDate date, LocalTime startTime, int delta) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.debug("Updating slot booking for doctor {} on {} at {}", doctorId, date, startTime);

        DoctorAvailability availability = availabilityRepository.findByDoctorIdAndDate(doctorId, date)
                .orElseThrow(() -> new ResourceNotFoundException("Availability not found for date: " + date));

        availability.getTimeSlots().stream()
                .filter(slot -> !startTime.isBefore(slot.getStartTime()) && !startTime.isAfter(slot.getEndTime().minusMinutes(1)))
                .findFirst()
                .ifPresent(slot -> {
                    int newBookedCount = slot.getBookedCount() + delta;
                    if (newBookedCount < 0) {
                        throw new BadRequestException("Booked count cannot be negative");
                    }
                    if (newBookedCount > slot.getAvailableSlots() + slot.getBookedCount()) {
                        throw new BadRequestException("Booked count exceeds available slots");
                    }

                    slot.setBookedCount(newBookedCount);
                    slot.setAvailableSlots(slot.getAvailableSlots() - delta);

                    if (slot.getAvailableSlots() <= 0) {
                        slot.setIsAvailable(false);
                    }
                });

        availabilityRepository.save(availability);
        log.debug("Slot booking updated successfully");
    }

    @Scheduled(cron = "0 0 0 * * ?") // Run daily at midnight
    public void generateNextDayAvailabilities() {
        log.info("Scheduled task: Generating next day availabilities");
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        generateAvailabilities(tomorrow, tomorrow.plusDays(30)); // Generate next 30 days
    }

    @Scheduled(cron = "0 0 1 * * ?") // Run daily at 1 AM
    public void cleanupOldAvailabilities() {
        log.info("Scheduled task: Cleaning up old availabilities");
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        availabilityRepository.deleteByDoctorIdAndDateBefore(null, thirtyDaysAgo);
    }

    private void validateAvailabilityRequest(AvailabilityRequest request) {
        if (request.getDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Cannot set availability for past dates");
        }

        if (request.getTimeSlots() != null) {
            validateTimeSlots(request.getTimeSlots());
        }

        if (request.getSlotDurationMinutes() != null && (request.getSlotDurationMinutes() < 5 || request.getSlotDurationMinutes() > 240)) {
            throw new BadRequestException("Slot duration must be between 5 and 240 minutes");
        }

        if (request.getMaxPatientsPerSlot() != null && (request.getMaxPatientsPerSlot() < 1 || request.getMaxPatientsPerSlot() > 10)) {
            throw new BadRequestException("Maximum patients per slot must be between 1 and 10");
        }
    }

    private void validateTimeSlots(List<TimeSlotRequest> timeSlots) {
        for (TimeSlotRequest slot : timeSlots) {
            if (slot.getStartTime().isAfter(slot.getEndTime())) {
                throw new BadRequestException("Start time cannot be after end time");
            }

            if (slot.getBookedCount() != null && slot.getBookedCount() < 0) {
                throw new BadRequestException("Booked count cannot be negative");
            }

            if (slot.getAvailableSlots() != null && slot.getAvailableSlots() < 0) {
                throw new BadRequestException("Available slots cannot be negative");
            }
        }
    }

    private void validateDateRange(LocalDate startDate, LocalDate endDate) {
        if (startDate.isAfter(endDate)) {
            throw new BadRequestException("Start date cannot be after end date");
        }

        if (startDate.isBefore(LocalDate.now())) {
            throw new BadRequestException("Cannot query availability for past dates");
        }

        long daysBetween = java.time.temporal.ChronoUnit.DAYS.between(startDate, endDate);
        if (daysBetween > 365) {
            throw new BadRequestException("Date range cannot exceed 365 days");
        }
    }

    private void validateScheduleRequest(ScheduleRequest request) {
        if (request.getWeeklySchedule() != null) {
            for (Map.Entry<String, DailyScheduleRequest> entry : request.getWeeklySchedule().entrySet()) {
                try {
                    DayOfWeek.valueOf(entry.getKey().toUpperCase());
                } catch (IllegalArgumentException e) {
                    throw new BadRequestException("Invalid day of week: " + entry.getKey());
                }

                if (entry.getValue().getAvailableSlots() != null) {
                    validateTimeRanges(entry.getValue().getAvailableSlots());
                }
            }
        }
    }

    private void validateTimeRanges(List<TimeRangeRequest> timeRanges) {
        for (TimeRangeRequest range : timeRanges) {
            if (range.getStartTime().isAfter(range.getEndTime())) {
                throw new BadRequestException("Start time cannot be after end time");
            }
        }
    }

    private void validateRecurringUnavailabilityRequest(RecurringUnavailabilityRequest request) {
        if (request.getRecurrencePattern().getStartDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Recurrence start date cannot be in the past");
        }

        if (request.getRecurrencePattern().getEndDate() != null &&
                request.getRecurrencePattern().getEndDate().isBefore(request.getRecurrencePattern().getStartDate())) {
            throw new BadRequestException("Recurrence end date cannot be before start date");
        }
    }

    private void validateSpecialAvailabilityRequest(SpecialAvailabilityRequest request) {
        if (request.getDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Cannot create special availability for past dates");
        }
    }

    private void validateOverrideRequest(AvailabilityOverrideRequest request) {
        if (request.getDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Cannot create override for past dates");
        }
    }

    private DoctorAvailability buildAvailability(String doctorId, AvailabilityRequest request) {
        return DoctorAvailability.builder()
                .doctorId(doctorId)
                .date(request.getDate())
                .isAvailable(request.getIsAvailable())
                .reasonForUnavailability(request.getReasonForUnavailability())
                .timeSlots(convertToTimeSlots(request.getTimeSlots()))
                .slotDurationMinutes(request.getSlotDurationMinutes())
                .maxPatientsPerSlot(request.getMaxPatientsPerSlot())
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    private List<TimeSlot> convertToTimeSlots(List<TimeSlotRequest> requests) {
        if (requests == null) return List.of();

        return requests.stream()
                .map(req -> TimeSlot.builder()
                        .startTime(req.getStartTime())
                        .endTime(req.getEndTime())
                        .bookedCount(req.getBookedCount() != null ? req.getBookedCount() : 0)
                        .availableSlots(req.getAvailableSlots() != null ? req.getAvailableSlots() : 1)
                        .isAvailable(req.getIsAvailable())
                        .reasonForUnavailability(req.getReasonForUnavailability())
                        .build())
                .collect(Collectors.toList());
    }

    private void updateAvailabilityFields(DoctorAvailability availability, AvailabilityRequest request) {
        if (request.getIsAvailable() != null) {
            availability.setIsAvailable(request.getIsAvailable());
        }
        if (request.getReasonForUnavailability() != null) {
            availability.setReasonForUnavailability(request.getReasonForUnavailability());
        }
        if (request.getTimeSlots() != null) {
            availability.setTimeSlots(convertToTimeSlots(request.getTimeSlots()));
        }
        if (request.getSlotDurationMinutes() != null) {
            availability.setSlotDurationMinutes(request.getSlotDurationMinutes());
        }
        if (request.getMaxPatientsPerSlot() != null) {
            availability.setMaxPatientsPerSlot(request.getMaxPatientsPerSlot());
        }
        availability.setUpdatedAt(LocalDateTime.now());
    }

    private AvailabilityResponse convertToResponse(DoctorAvailability availability) {
        return AvailabilityResponse.builder()
                .id(availability.getId())
                .doctorId(availability.getDoctorId())
                .date(availability.getDate())
                .isAvailable(availability.getIsAvailable())
                .reasonForUnavailability(availability.getReasonForUnavailability())
                .timeSlots(convertToTimeSlotResponses(availability.getTimeSlots()))
                .slotDurationMinutes(availability.getSlotDurationMinutes())
                .maxPatientsPerSlot(availability.getMaxPatientsPerSlot())
                .status(calculateAvailabilityStatus(availability))
                .totalAvailableSlots(calculateTotalAvailableSlots(availability))
                .totalBookedSlots(calculateTotalBookedSlots(availability))
                .createdAt(availability.getCreatedAt())
                .updatedAt(availability.getUpdatedAt())
                .build();
    }

    private List<TimeSlotResponse> convertToTimeSlotResponses(List<TimeSlot> timeSlots) {
        return timeSlots.stream()
                .map(slot -> TimeSlotResponse.builder()
                        .startTime(slot.getStartTime())
                        .endTime(slot.getEndTime())
                        .bookedCount(slot.getBookedCount())
                        .availableSlots(slot.getAvailableSlots())
                        .isAvailable(slot.getIsAvailable())
                        .reasonForUnavailability(slot.getReasonForUnavailability())
                        .status(calculateTimeSlotStatus(slot))
                        .build())
                .collect(Collectors.toList());
    }

    private AvailabilityStatus calculateAvailabilityStatus(DoctorAvailability availability) {
        if (Boolean.FALSE.equals(availability.getIsAvailable())) {
            return AvailabilityStatus.UNAVAILABLE;
        }

        boolean hasAvailableSlots = availability.getTimeSlots().stream()
                .anyMatch(slot -> slot.getIsAvailable() && slot.getAvailableSlots() > 0);

        if (!hasAvailableSlots) {
            return AvailabilityStatus.FULLY_BOOKED;
        }

        boolean allSlotsAvailable = availability.getTimeSlots().stream()
                .allMatch(slot -> slot.getIsAvailable() && slot.getAvailableSlots() > 0);

        return allSlotsAvailable ? AvailabilityStatus.AVAILABLE : AvailabilityStatus.PARTIALLY_AVAILABLE;
    }

    private AvailabilityStatus calculateTimeSlotStatus(TimeSlot slot) {
        if (Boolean.FALSE.equals(slot.getIsAvailable())) {
            return AvailabilityStatus.UNAVAILABLE;
        }
        if (slot.getAvailableSlots() <= 0) {
            return AvailabilityStatus.FULLY_BOOKED;
        }
        return AvailabilityStatus.AVAILABLE;
    }

    private Integer calculateTotalAvailableSlots(DoctorAvailability availability) {
        return availability.getTimeSlots().stream()
                .filter(TimeSlot::getIsAvailable)
                .mapToInt(TimeSlot::getAvailableSlots)
                .sum();
    }

    private Integer calculateTotalBookedSlots(DoctorAvailability availability) {
        return availability.getTimeSlots().stream()
                .mapToInt(TimeSlot::getBookedCount)
                .sum();
    }

    private DoctorAvailability generateAvailabilityForDate(String doctorId, LocalDate date) {
        log.debug("Generating availability for doctor {} on date {}", doctorId, date);

        AvailabilitySchedule schedule = scheduleRepository.findByDoctorId(doctorId)
                .orElseGet(() -> createDefaultSchedule(doctorId));

        Optional<SpecialAvailability> specialAvailability = specialAvailabilityRepository.findByDoctorIdAndDate(doctorId, date);
        Optional<AvailabilityOverride> override = overrideRepository.findByDoctorIdAndDate(doctorId, date);

        boolean isRecurringUnavailable = checkRecurringUnavailability(doctorId, date);

        DoctorAvailability availability = createAvailabilityFromSchedule(doctorId, date, schedule,
                specialAvailability.orElse(null), override.orElse(null), isRecurringUnavailable);

        return availabilityRepository.save(availability);
    }

    private boolean checkRecurringUnavailability(String doctorId, LocalDate date) {
        List<RecurringUnavailability> recurringUnavailabilities = recurringUnavailabilityRepository.findByDoctorIdAndIsActiveTrue(doctorId);

        return recurringUnavailabilities.stream()
                .anyMatch(unavailability -> matchesRecurrencePattern(unavailability.getRecurrencePattern(), date));
    }

    private boolean matchesRecurrencePattern(RecurrencePattern pattern, LocalDate date) {
        if (date.isBefore(pattern.getStartDate())) return false;
        if (pattern.getEndDate() != null && date.isAfter(pattern.getEndDate())) return false;

        LocalDate start = pattern.getStartDate();
        int interval = (pattern.getInterval() != null && pattern.getInterval() > 0) ? pattern.getInterval() : 1;

        switch (pattern.getType()) {
            case DAILY:
                long daysBetween = java.time.temporal.ChronoUnit.DAYS.between(start, date);
                return daysBetween % interval == 0;

            case WEEKLY:
                long weeksBetween = java.time.temporal.ChronoUnit.WEEKS.between(start, date);
                boolean matchesInterval = weeksBetween % interval == 0;
                boolean matchesDay = pattern.getDaysOfWeek() != null &&
                        pattern.getDaysOfWeek().contains(
                                com.aarogya.doctor_service.enums.availability.DayOfWeek.valueOf(date.getDayOfWeek().name())
                        );
                return matchesInterval && matchesDay;

            case MONTHLY:
                long monthsBetween = java.time.temporal.ChronoUnit.MONTHS.between(
                        YearMonth.from(start), YearMonth.from(date));
                boolean matchesMonthInterval = monthsBetween % interval == 0;
                boolean matchesDayOfMonth = (pattern.getDayOfMonth() != null &&
                        date.getDayOfMonth() == pattern.getDayOfMonth());
                return matchesMonthInterval && matchesDayOfMonth;

            case YEARLY:
                long yearsBetween = java.time.temporal.ChronoUnit.YEARS.between(start, date);
                boolean matchesYearInterval = yearsBetween % interval == 0;
                boolean matchesYearlyDate =
                        (pattern.getMonth() != null && date.getMonthValue() == pattern.getMonth()) &&
                                (pattern.getDayOfMonth() != null && date.getDayOfMonth() == pattern.getDayOfMonth());
                return matchesYearInterval && matchesYearlyDate;

            default:
                return false;
        }
    }


    private DoctorAvailability createAvailabilityFromSchedule(String doctorId, LocalDate date, AvailabilitySchedule schedule,
                                                              SpecialAvailability special, AvailabilityOverride override,
                                                              boolean isRecurringUnavailable) {

        com.aarogya.doctor_service.enums.availability.DayOfWeek dayOfWeek =
                com.aarogya.doctor_service.enums.availability.DayOfWeek.valueOf(date.getDayOfWeek().name());
        DailySchedule dailySchedule = schedule.getWeeklySchedule().get(dayOfWeek.name());

        if (dailySchedule == null || Boolean.FALSE.equals(dailySchedule.getIsAvailable()) || isRecurringUnavailable) {
            return createUnavailableDay(doctorId, date);
        }

        if (special != null) {
            return createAvailabilityFromSpecial(doctorId, date, special);
        }

        if (override != null) {
            return createAvailabilityFromOverride(doctorId, date, override, dailySchedule);
        }
        return createAvailabilityFromDailySchedule(doctorId, date, dailySchedule);
    }

    private DoctorAvailability createUnavailableDay(String doctorId, LocalDate date) {
        return DoctorAvailability.builder()
                .doctorId(doctorId)
                .date(date)
                .isAvailable(false)
                .reasonForUnavailability("Not available as per schedule")
                .timeSlots(List.of())
                .slotDurationMinutes(30)
                .maxPatientsPerSlot(1)
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    private DoctorAvailability createAvailabilityFromSpecial(String doctorId, LocalDate date, SpecialAvailability special) {
        List<TimeSlot> timeSlots = convertTimeRangesToSlots(special.getCustomSlots(),
                special.getCustomSlotDuration() != null ? special.getCustomSlotDuration() : 30,
                special.getCustomMaxPatients() != null ? special.getCustomMaxPatients() : 1);

        return DoctorAvailability.builder()
                .doctorId(doctorId)
                .date(date)
                .isAvailable(special.getIsAvailable())
                .reasonForUnavailability(special.getReason())
                .timeSlots(timeSlots)
                .slotDurationMinutes(special.getCustomSlotDuration() != null ? special.getCustomSlotDuration() : 30)
                .maxPatientsPerSlot(special.getCustomMaxPatients() != null ? special.getCustomMaxPatients() : 1)
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    private DoctorAvailability createAvailabilityFromOverride(
            String doctorId,
            LocalDate date,
            AvailabilityOverride override,
            DailySchedule dailySchedule) {

        if (override == null || !Boolean.TRUE.equals(override.getIsActive())) {
            return createAvailabilityFromDailySchedule(doctorId, date, dailySchedule);
        }

        switch (override.getOverrideType()) {
            case UNAVAILABLE -> {
                if (override.getAffectedTimeRanges() == null || override.getAffectedTimeRanges().isEmpty()) {
                    return DoctorAvailability.builder()
                            .doctorId(doctorId)
                            .date(date)
                            .isAvailable(false)
                            .reasonForUnavailability(
                                    override.getReason() != null ? override.getReason() : "Doctor unavailable")
                            .timeSlots(List.of())
                            .build();
                }

                List<TimeSlot> remainingSlots = new ArrayList<>(mapToTimeSlots(dailySchedule.getAvailableSlots()));
                for (TimeRange affected : override.getAffectedTimeRanges()) {
                    remainingSlots.removeIf(slot -> affected.overlaps(toTimeRange(slot)));
                }

                return DoctorAvailability.builder()
                        .doctorId(doctorId)
                        .date(date)
                        .isAvailable(!remainingSlots.isEmpty())
                        .reasonForUnavailability(override.getReason())
                        .timeSlots(remainingSlots)
                        .build();
            }

            case CUSTOM_SLOTS -> {
                List<TimeSlot> customSlots = mapToTimeSlots(override.getAffectedTimeRanges());
                return DoctorAvailability.builder()
                        .doctorId(doctorId)
                        .date(date)
                        .isAvailable(!customSlots.isEmpty())
                        .reasonForUnavailability(override.getReason())
                        .timeSlots(customSlots)
                        .build();
            }

            case EXTENDED_HOURS -> {
                List<TimeSlot> extendedSlots = new ArrayList<>(mapToTimeSlots(dailySchedule.getAvailableSlots()));
                extendedSlots.addAll(mapToTimeSlots(override.getAffectedTimeRanges()));
                return DoctorAvailability.builder()
                        .doctorId(doctorId)
                        .date(date)
                        .isAvailable(true)
                        .timeSlots(extendedSlots)
                        .build();
            }

            case REDUCED_CAPACITY -> {
                List<TimeSlot> reducedSlots = mapToTimeSlots(dailySchedule.getAvailableSlots());
                return DoctorAvailability.builder()
                        .doctorId(doctorId)
                        .date(date)
                        .isAvailable(true)
                        .timeSlots(reducedSlots)
                        .maxPatientsPerSlot(1) // or from override
                        .reasonForUnavailability("Reduced capacity: " + override.getReason())
                        .build();
            }
        }

        return createAvailabilityFromDailySchedule(doctorId, date, dailySchedule);
    }

    private List<TimeSlot> mapToTimeSlots(List<TimeRange> ranges) {
        if (ranges == null) return List.of();
        return ranges.stream()
                .map(r -> new TimeSlot(r.getStartTime(), r.getEndTime()))
                .toList();
    }

    private TimeRange toTimeRange(TimeSlot slot) {
        return new TimeRange(slot.getStartTime(), slot.getEndTime());
    }

    private DoctorAvailability createAvailabilityFromDailySchedule(String doctorId, LocalDate date, DailySchedule dailySchedule) {
        List<TimeSlot> timeSlots = convertTimeRangesToSlots(dailySchedule.getAvailableSlots(),
                dailySchedule.getSlotDurationMinutes(), dailySchedule.getMaxPatientsPerSlot());

        return DoctorAvailability.builder()
                .doctorId(doctorId)
                .date(date)
                .isAvailable(true)
                .timeSlots(timeSlots)
                .slotDurationMinutes(dailySchedule.getSlotDurationMinutes())
                .maxPatientsPerSlot(dailySchedule.getMaxPatientsPerSlot())
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    private List<TimeSlot> convertTimeRangesToSlots(List<TimeRange> timeRanges, int slotDuration, int maxPatients) {
        List<TimeSlot> slots = new ArrayList<>();

        for (TimeRange range : timeRanges) {
            LocalTime currentTime = range.getStartTime();
            while (currentTime.plusMinutes(slotDuration).isBefore(range.getEndTime()) ||
                    currentTime.plusMinutes(slotDuration).equals(range.getEndTime())) {

                slots.add(TimeSlot.builder()
                        .startTime(currentTime)
                        .endTime(currentTime.plusMinutes(slotDuration))
                        .bookedCount(0)
                        .availableSlots(maxPatients)
                        .isAvailable(true)
                        .build());

                currentTime = currentTime.plusMinutes(slotDuration);
            }
        }

        return slots;
    }

    private AvailabilitySchedule createDefaultSchedule(String doctorId) {
        Map<DayOfWeek, DailySchedule> weeklySchedule = new HashMap<>();

        for (DayOfWeek day : Arrays.asList(DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY)) {
            weeklySchedule.put(day, DailySchedule.builder()
                    .isAvailable(true)
                    .availableSlots(List.of(
                            TimeRange.builder().startTime(LocalTime.of(9, 0)).endTime(LocalTime.of(12, 0)).build(),
                            TimeRange.builder().startTime(LocalTime.of(13, 0)).endTime(LocalTime.of(17, 0)).build()
                    ))
                    .slotDurationMinutes(30)
                    .maxPatientsPerSlot(1)
                    .build());
        }

        for (DayOfWeek day : Arrays.asList(DayOfWeek.SATURDAY, DayOfWeek.SUNDAY)) {
            weeklySchedule.put(day, DailySchedule.builder()
                    .isAvailable(false)
                    .reasonForUnavailability("Weekend")
                    .availableSlots(List.of())
                    .slotDurationMinutes(30)
                    .maxPatientsPerSlot(1)
                    .build());
        }

        return AvailabilitySchedule.builder()
                .doctorId(doctorId)
                .weeklySchedule(weeklySchedule)
                .defaultSlotDurationMinutes(30)
                .defaultMaxPatientsPerSlot(1)
                .bookingLeadTimeHours(24)
                .maxBookingDaysInAdvance(90)
                .minCancellationNoticeHours(2)
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    private ScheduleResponse convertToScheduleResponse(AvailabilitySchedule schedule) {
        return ScheduleResponse.builder()
                .id(schedule.getId())
                .doctorId(schedule.getDoctorId())
                .weeklySchedule(convertWeeklySchedule(schedule.getWeeklySchedule()))
                .defaultSlotDurationMinutes(schedule.getDefaultSlotDurationMinutes())
                .defaultMaxPatientsPerSlot(schedule.getDefaultMaxPatientsPerSlot())
                .bookingLeadTimeHours(schedule.getBookingLeadTimeHours())
                .maxBookingDaysInAdvance(schedule.getMaxBookingDaysInAdvance())
                .minCancellationNoticeHours(schedule.getMinCancellationNoticeHours())
                .createdAt(schedule.getCreatedAt())
                .updatedAt(schedule.getUpdatedAt())
                .build();
    }

    private Map<String, DailyScheduleResponse> convertWeeklySchedule(Map<DayOfWeek, DailySchedule> weeklySchedule) {
        Map<String, DailyScheduleResponse> response = new HashMap<>();

        for (Map.Entry<DayOfWeek, DailySchedule> entry : weeklySchedule.entrySet()) {
            DailySchedule schedule = entry.getValue();
            response.put(entry.getKey().name(), DailyScheduleResponse.builder()
                    .isAvailable(schedule.getIsAvailable())
                    .reasonForUnavailability(schedule.getReasonForUnavailability())
                    .availableSlots(convertTimeRanges(schedule.getAvailableSlots()))
                    .slotDurationMinutes(schedule.getSlotDurationMinutes())
                    .maxPatientsPerSlot(schedule.getMaxPatientsPerSlot())
                    .build());
        }

        return response;
    }

    private List<TimeRangeResponse> convertTimeRanges(List<TimeRange> timeRanges) {
        return timeRanges.stream()
                .map(range -> TimeRangeResponse.builder()
                        .startTime(range.getStartTime())
                        .endTime(range.getEndTime())
                        .build())
                .collect(Collectors.toList());
    }

    private void updateScheduleFields(AvailabilitySchedule schedule, ScheduleRequest request) {
        if (request.getWeeklySchedule() != null) {
            Map<com.aarogya.doctor_service.enums.availability.DayOfWeek, DailySchedule> weeklySchedule = new HashMap<>();

            for (Map.Entry<String, DailyScheduleRequest> entry : request.getWeeklySchedule().entrySet()) {
                try {
                    DayOfWeek day = DayOfWeek.valueOf(entry.getKey().toUpperCase());
                    DailyScheduleRequest dailyRequest = entry.getValue();

                    weeklySchedule.put(day, DailySchedule.builder()
                            .isAvailable(dailyRequest.getIsAvailable())
                            .reasonForUnavailability(dailyRequest.getReasonForUnavailability())
                            .availableSlots(convertTimeRangeRequests(dailyRequest.getAvailableSlots()))
                            .slotDurationMinutes(dailyRequest.getSlotDurationMinutes())
                            .maxPatientsPerSlot(dailyRequest.getMaxPatientsPerSlot())
                            .build());
                } catch (IllegalArgumentException e) {
                    log.warn("Invalid day of week: {}", entry.getKey());
                }
            }

            schedule.setWeeklySchedule(weeklySchedule);
        }

        if (request.getDefaultSlotDurationMinutes() != null) {
            schedule.setDefaultSlotDurationMinutes(request.getDefaultSlotDurationMinutes());
        }

        if (request.getDefaultMaxPatientsPerSlot() != null) {
            schedule.setDefaultMaxPatientsPerSlot(request.getDefaultMaxPatientsPerSlot());
        }

        if (request.getBookingLeadTimeHours() != null) {
            schedule.setBookingLeadTimeHours(request.getBookingLeadTimeHours());
        }

        if (request.getMaxBookingDaysInAdvance() != null) {
            schedule.setMaxBookingDaysInAdvance(request.getMaxBookingDaysInAdvance());
        }

        if (request.getMinCancellationNoticeHours() != null) {
            schedule.setMinCancellationNoticeHours(request.getMinCancellationNoticeHours());
        }

        schedule.setUpdatedAt(LocalDateTime.now());
    }

    private List<TimeRange> convertTimeRangeRequests(List<TimeRangeRequest> requests) {
        if (requests == null) return List.of();

        return requests.stream()
                .map(req -> TimeRange.builder()
                        .startTime(req.getStartTime())
                        .endTime(req.getEndTime())
                        .build())
                .collect(Collectors.toList());
    }

    private void regenerateFutureAvailabilities(String doctorId) {
        log.info("Regenerating future availabilities for doctor {}", doctorId);
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        LocalDate thirtyDaysLater = tomorrow.plusDays(30);

        availabilityRepository.deleteByDoctorIdAndDateBefore(doctorId, thirtyDaysLater.plusDays(1));

        generateAvailabilities(tomorrow, thirtyDaysLater);
    }

    private RecurringUnavailability buildRecurringUnavailability(String doctorId, RecurringUnavailabilityRequest request) {
        return RecurringUnavailability.builder()
                .doctorId(doctorId)
                .title(request.getTitle())
                .description(request.getDescription())
                .recurrencePattern(convertRecurrencePattern(request.getRecurrencePattern()))
                .timeRange(convertTimeRangeRequest(request.getTimeRange()))
                .isAllDay(request.getIsAllDay())
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    private RecurrencePattern convertRecurrencePattern(RecurrencePatternRequest request) {
        return RecurrencePattern.builder()
                .type(RecurrenceType.valueOf(request.getType().toUpperCase()))
                .interval(request.getInterval())
                .daysOfWeek(convertDaysOfWeek(request.getDaysOfWeek()))
                .dayOfMonth(request.getDayOfMonth())
                .month(request.getMonth())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .occurrenceCount(request.getOccurrenceCount())
                .build();
    }

    private List<DayOfWeek> convertDaysOfWeek(List<String> days) {
        if (days == null) return List.of();

        return days.stream()
                .map(day -> DayOfWeek.valueOf(day.toUpperCase()))
                .collect(Collectors.toList());
    }

    private TimeRange convertTimeRangeRequest(TimeRangeRequest request) {
        return TimeRange.builder()
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .build();
    }

    private SpecialAvailability buildSpecialAvailability(String doctorId, SpecialAvailabilityRequest request) {
        return SpecialAvailability.builder()
                .doctorId(doctorId)
                .date(request.getDate())
                .title(request.getTitle())
                .description(request.getDescription())
                .isAvailable(request.getIsAvailable())
                .reason(request.getReason())
                .customSlots(convertTimeRangeRequests(request.getCustomSlots()))
                .customSlotDuration(request.getCustomSlotDuration())
                .customMaxPatients(request.getCustomMaxPatients())
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    private AvailabilityOverride buildOverride(String doctorId, AvailabilityOverrideRequest request) {
        return AvailabilityOverride.builder()
                .doctorId(doctorId)
                .date(request.getDate())
                .overrideType(OverrideType.valueOf(request.getOverrideType().toUpperCase()))
                .reason(request.getReason())
                .affectedTimeRanges(convertTimeRangeRequests(request.getAffectedTimeRanges()))
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    private void updateDailyAvailabilityWithSpecial(String doctorId, LocalDate date, SpecialAvailability special) {
        DoctorAvailability availability = availabilityRepository.findByDoctorIdAndDate(doctorId, date)
                .orElseGet(() -> generateAvailabilityForDate(doctorId, date));

        availability.setIsAvailable(special.getIsAvailable());
        availability.setReasonForUnavailability(special.getReason());

        if (special.getCustomSlots() != null && !special.getCustomSlots().isEmpty()) {
            List<TimeSlot> timeSlots = convertTimeRangesToSlots(special.getCustomSlots(),
                    special.getCustomSlotDuration() != null ? special.getCustomSlotDuration() : availability.getSlotDurationMinutes(),
                    special.getCustomMaxPatients() != null ? special.getCustomMaxPatients() : availability.getMaxPatientsPerSlot());
            availability.setTimeSlots(timeSlots);
        }

        if (special.getCustomSlotDuration() != null) {
            availability.setSlotDurationMinutes(special.getCustomSlotDuration());
        }

        if (special.getCustomMaxPatients() != null) {
            availability.setMaxPatientsPerSlot(special.getCustomMaxPatients());
        }

        availability.setUpdatedAt(LocalDateTime.now());
        availabilityRepository.save(availability);
    }

    private void updateDailyAvailabilityWithOverride(String doctorId, LocalDate date, AvailabilityOverride override) {
        DoctorAvailability availability = availabilityRepository.findByDoctorIdAndDate(doctorId, date)
                .orElseGet(() -> generateAvailabilityForDate(doctorId, date));

        switch (override.getOverrideType()) {
            case UNAVAILABLE:
                availability.setIsAvailable(false);
                availability.setReasonForUnavailability(override.getReason());
                availability.setTimeSlots(List.of());
                break;

            case REDUCED_CAPACITY:
                availability.getTimeSlots().forEach(slot -> {
                    slot.setAvailableSlots(Math.max(1, slot.getAvailableSlots() / 2));
                });
                break;

            case EXTENDED_HOURS:
                if (!availability.getTimeSlots().isEmpty()) {
                    List<TimeSlot> extendedSlots = new ArrayList<>(availability.getTimeSlots());
                    LocalTime firstStart = extendedSlots.getFirst().getStartTime();
                    LocalTime lastEnd = extendedSlots.getLast().getEndTime();

                    LocalTime newStart = firstStart.minusHours(1);
                    while (newStart.isBefore(firstStart)) {
                        LocalTime slotEnd = newStart.plusMinutes(availability.getSlotDurationMinutes());
                        if (!slotEnd.isAfter(firstStart)) {
                            extendedSlots.addFirst(new TimeSlot(newStart, slotEnd));
                            newStart = slotEnd;
                        } else break;
                    }
                    LocalTime newEnd = lastEnd;
                    LocalTime limitEnd = lastEnd.plusHours(1);
                    while (newEnd.isBefore(limitEnd)) {
                        LocalTime slotEnd = newEnd.plusMinutes(availability.getSlotDurationMinutes());
                        extendedSlots.add(new TimeSlot(newEnd, slotEnd));
                        newEnd = slotEnd;
                    }

                    availability.setTimeSlots(extendedSlots);
                }
                break;

            case CUSTOM_SLOTS:
                List<TimeSlot> customSlots = new ArrayList<>();
                for (TimeRange range : override.getAffectedTimeRanges()) {
                    LocalTime current = range.getStartTime();
                    while (current.isBefore(range.getEndTime())) {
                        LocalTime slotEnd = current.plusMinutes(availability.getSlotDurationMinutes());
                        if (slotEnd.isAfter(range.getEndTime())) break;
                        customSlots.add(new TimeSlot(current, slotEnd));
                        current = slotEnd;
                    }
                }
                availability.setTimeSlots(customSlots);
                break;
        }

        availability.setUpdatedAt(LocalDateTime.now());
        availabilityRepository.save(availability);
    }


    private LocalDateTime findNextAvailableSlot(String doctorId, LocalDate afterDate) {
        List<DoctorAvailability> futureAvailabilities = availabilityRepository
                .findByDoctorIdAndIsAvailableTrueAndDateGreaterThanEqual(doctorId, afterDate.plusDays(1));

        return futureAvailabilities.stream()
                .filter(avail -> avail.getTimeSlots().stream().anyMatch(slot -> slot.getIsAvailable() && slot.getAvailableSlots() > 0))
                .findFirst()
                .map(avail -> LocalDateTime.of(avail.getDate(), avail.getTimeSlots().getFirst().getStartTime()))
                .orElse(null);
    }

    private LocalDateTime findNextAvailableSlotInDay(DoctorAvailability availability) {
        return availability.getTimeSlots().stream()
                .filter(slot -> slot.getIsAvailable() && slot.getAvailableSlots() > 0)
                .findFirst()
                .map(slot -> LocalDateTime.of(availability.getDate(), slot.getStartTime()))
                .orElse(null);
    }
}
