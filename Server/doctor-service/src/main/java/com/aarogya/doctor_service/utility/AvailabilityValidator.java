package com.aarogya.doctor_service.utility;

import com.aarogya.doctor_service.dto.DoctorAvailabilityDTO;
import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.util.List;

@Component
public class AvailabilityValidator {

    public void validateAvailability(DoctorAvailabilityDTO availabilityDTO) {
        if (availabilityDTO.getDoctorId() == null || availabilityDTO.getDoctorId().isEmpty()) {
            throw new BadRequestException("Doctor ID is required");
        }

        if (availabilityDTO.getDayOfWeek() == null) {
            throw new BadRequestException("Day of week is required");
        }

        if (availabilityDTO.getDayOfWeek() < 0 || availabilityDTO.getDayOfWeek() > 6) {
            throw new BadRequestException("Day of week must be between 0 (Sunday) and 6 (Saturday)");
        }

        if (availabilityDTO.getStartTime() == null) {
            throw new BadRequestException("Start time is required");
        }

        if (availabilityDTO.getEndTime() == null) {
            throw new BadRequestException("End time is required");
        }

        if (availabilityDTO.getStartTime().isAfter(availabilityDTO.getEndTime()) ||
                availabilityDTO.getStartTime().equals(availabilityDTO.getEndTime())) {
            throw new BadRequestException("Start time must be before end time");
        }

        if (availabilityDTO.getBreakStart() != null && availabilityDTO.getBreakEnd() != null) {
            if (availabilityDTO.getBreakStart().isAfter(availabilityDTO.getBreakEnd()) ||
                    availabilityDTO.getBreakStart().equals(availabilityDTO.getBreakEnd())) {
                throw new BadRequestException("Break start time must be before break end time");
            }

            if (availabilityDTO.getBreakStart().isBefore(availabilityDTO.getStartTime()) ||
                    availabilityDTO.getBreakEnd().isAfter(availabilityDTO.getEndTime())) {
                throw new BadRequestException("Break time must be within working hours");
            }
        }

        if (availabilityDTO.getSlotDuration() != null && availabilityDTO.getSlotDuration() <= 0) {
            throw new BadRequestException("Slot duration must be greater than 0");
        }
    }

    public void validateBulkAvailability(List<DoctorAvailabilityDTO> availabilityDTOs) {
        if (availabilityDTOs == null || availabilityDTOs.isEmpty()) {
            throw new BadRequestException("At least one availability schedule is required");
        }

        // Check for duplicate days
        boolean[] daysOfWeek = new boolean[7];
        for (DoctorAvailabilityDTO availabilityDTO : availabilityDTOs) {
            validateAvailability(availabilityDTO);

            int day = availabilityDTO.getDayOfWeek();
            if (daysOfWeek[day]) {
                throw new BadRequestException("Duplicate day of week: " + day);
            }
            daysOfWeek[day] = true;
        }
    }

    public void validateTimeSlot(LocalTime startTime, LocalTime endTime, int slotDuration) {
        if (startTime == null) {
            throw new BadRequestException("Start time is required");
        }

        if (endTime == null) {
            throw new BadRequestException("End time is required");
        }

        if (startTime.isAfter(endTime) || startTime.equals(endTime)) {
            throw new BadRequestException("Start time must be before end time");
        }

        if (slotDuration <= 0) {
            throw new BadRequestException("Slot duration must be greater than 0");
        }

        int startMinutes = startTime.getHour() * 60 + startTime.getMinute();
        int endMinutes = endTime.getHour() * 60 + endTime.getMinute();
        int totalMinutes = endMinutes - startMinutes;

        if (totalMinutes % slotDuration != 0) {
            throw new BadRequestException("Slot duration must divide evenly into the time range");
        }
    }
}
