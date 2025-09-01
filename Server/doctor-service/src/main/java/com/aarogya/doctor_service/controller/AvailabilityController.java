package com.aarogya.doctor_service.controller;

import com.aarogya.doctor_service.dto.availability.request.*;
import com.aarogya.doctor_service.dto.availability.response.AvailabilityRangeResponse;
import com.aarogya.doctor_service.dto.availability.response.AvailabilityResponse;
import com.aarogya.doctor_service.dto.availability.response.ScheduleResponse;
import com.aarogya.doctor_service.dto.availability.response.SlotAvailabilityResponse;
import com.aarogya.doctor_service.models.availability.AvailabilityOverride;
import com.aarogya.doctor_service.models.availability.RecurringUnavailability;
import com.aarogya.doctor_service.models.availability.SpecialAvailability;
import com.aarogya.doctor_service.services.availability.AvailabilityService;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/availability")
@Slf4j
@RequiredArgsConstructor
@Validated
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    @PostMapping
    @CircuitBreaker(name = "availabilityController", fallbackMethod = "setAvailabilityFallback")
    @RateLimiter(name = "availabilityController")
    public ResponseEntity<AvailabilityResponse> setAvailability(@Valid @RequestBody AvailabilityRequest request) {
        log.info("Setting availability for date: {}", request.getDate());
        AvailabilityResponse response = availabilityService.setAvailability(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{date}")
    public ResponseEntity<AvailabilityResponse> getAvailability(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        log.debug("Fetching availability for date: {}", date);
        AvailabilityResponse response = availabilityService.getAvailability(date);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/range")
    public ResponseEntity<AvailabilityRangeResponse> getAvailabilityRange(@Valid @ModelAttribute AvailabilityRangeRequest request) {
        log.debug("Fetching availability range from {} to {}", request.getStartDate(), request.getEndDate());
        AvailabilityRangeResponse response = availabilityService.getAvailabilityRange(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/schedule")
    public ResponseEntity<ScheduleResponse> getSchedule() {
        log.debug("Fetching doctor schedule");
        ScheduleResponse response = availabilityService.getSchedule();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/schedule")
    @CircuitBreaker(name = "availabilityController", fallbackMethod = "updateScheduleFallback")
    public ResponseEntity<ScheduleResponse> updateSchedule(@Valid @RequestBody ScheduleRequest request) {
        log.info("Updating doctor schedule");
        ScheduleResponse response = availabilityService.updateSchedule(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/recurring-unavailability")
    @CircuitBreaker(name = "availabilityController", fallbackMethod = "createRecurringUnavailabilityFallback")
    public ResponseEntity<RecurringUnavailability> createRecurringUnavailability(@Valid @RequestBody RecurringUnavailabilityRequest request) {
        log.info("Creating recurring unavailability");
        RecurringUnavailability response = availabilityService.createRecurringUnavailability(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/recurring-unavailability")
    public ResponseEntity<List<RecurringUnavailability>> getRecurringUnavailabilities() {
        log.debug("Fetching recurring unavailabilities");
        List<RecurringUnavailability> response = availabilityService.getRecurringUnavailabilities();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/recurring-unavailability/{id}")
    public ResponseEntity<Void> deleteRecurringUnavailability(@PathVariable String id) {
        log.info("Deleting recurring unavailability: {}", id);
        availabilityService.deleteRecurringUnavailability(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/special")
    @CircuitBreaker(name = "availabilityController", fallbackMethod = "createSpecialAvailabilityFallback")
    public ResponseEntity<SpecialAvailability> createSpecialAvailability(@Valid @RequestBody SpecialAvailabilityRequest request) {
        log.info("Creating special availability for date: {}", request.getDate());
        SpecialAvailability response = availabilityService.createSpecialAvailability(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/special")
    public ResponseEntity<List<SpecialAvailability>> getSpecialAvailabilities() {
        log.debug("Fetching special availabilities");
        List<SpecialAvailability> response = availabilityService.getSpecialAvailabilities();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/override")
    @CircuitBreaker(name = "availabilityController", fallbackMethod = "createOverrideFallback")
    public ResponseEntity<AvailabilityOverride> createOverride(@Valid @RequestBody AvailabilityOverrideRequest request) {
        log.info("Creating availability override for date: {}", request.getDate());
        AvailabilityOverride response = availabilityService.createOverride(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/check-slot")
    public ResponseEntity<SlotAvailabilityResponse> checkSlotAvailability(@Valid @RequestBody SlotAvailabilityRequest request) {
        log.debug("Checking slot availability for {} at {} - {}", request.getDate(), request.getStartTime(), request.getEndTime());
        SlotAvailabilityResponse response = availabilityService.checkSlotAvailability(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/generate")
    public ResponseEntity<Void> generateAvailabilities(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        log.info("Generating availabilities from {} to {}", startDate, endDate);
        availabilityService.generateAvailabilities(startDate, endDate);
        return ResponseEntity.accepted().build();
    }

    @PutMapping("/slot-booking")
    @RateLimiter(name = "availabilityController")
    @CircuitBreaker(name = "availabilityController", fallbackMethod = "updateSlotBookingFallback")
    public ResponseEntity<Void> updateSlotBooking(
            @RequestParam String appointmentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime startTime,
            @RequestParam(defaultValue = "1") int delta) {

        log.info("Updating slot booking for appointmentId={}, date={}, startTime={}, delta={}",
                appointmentId, date, startTime, delta);

        availabilityService.updateSlotBooking(appointmentId, date, startTime, delta);

        return ResponseEntity.noContent().build();
    }

    public ResponseEntity<Void> updateSlotBookingFallback(
            String appointmentId, LocalDate date, LocalTime startTime, int delta, Throwable t) {
        log.error("Fallback triggered for updateSlotBooking: {}", t.getMessage(), t);
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
    }

    public ResponseEntity<AvailabilityResponse> setAvailabilityFallback(AvailabilityRequest request, Throwable t) {
        log.error("Fallback triggered for setAvailability: {}", t.getMessage());
        return ResponseEntity.badRequest().build();
    }

    public ResponseEntity<ScheduleResponse> updateScheduleFallback(ScheduleRequest request, Throwable t) {
        log.error("Fallback triggered for updateSchedule: {}", t.getMessage());
        return ResponseEntity.badRequest().build();
    }

    public ResponseEntity<RecurringUnavailability> createRecurringUnavailabilityFallback(RecurringUnavailabilityRequest request, Throwable t) {
        log.error("Fallback triggered for createRecurringUnavailability: {}", t.getMessage());
        return ResponseEntity.badRequest().build();
    }

    public ResponseEntity<SpecialAvailability> createSpecialAvailabilityFallback(SpecialAvailabilityRequest request, Throwable t) {
        log.error("Fallback triggered for createSpecialAvailability: {}", t.getMessage());
        return ResponseEntity.badRequest().build();
    }

    public ResponseEntity<AvailabilityOverride> createOverrideFallback(AvailabilityOverrideRequest request, Throwable t) {
        log.error("Fallback triggered for createOverride: {}", t.getMessage());
        return ResponseEntity.badRequest().build();
    }
}