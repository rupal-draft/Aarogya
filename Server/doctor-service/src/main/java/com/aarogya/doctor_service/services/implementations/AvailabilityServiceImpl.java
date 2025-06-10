package com.aarogya.doctor_service.services.implementations;

import com.aarogya.doctor_service.dto.AvailableSlotDTO;
import com.aarogya.doctor_service.dto.DoctorAvailabilityDTO;
import com.aarogya.doctor_service.exceptions.BadRequestException;
import com.aarogya.doctor_service.exceptions.ResourceNotFoundException;
import com.aarogya.doctor_service.models.DoctorAvailability;
import com.aarogya.doctor_service.repositories.DoctorAvailabilityRepository;
import com.aarogya.doctor_service.services.AvailabilityService;
import com.aarogya.doctor_service.utility.DateTimeUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AvailabilityServiceImpl implements AvailabilityService {

    private final DoctorAvailabilityRepository availabilityRepository;
    private final ModelMapper modelMapper;
    private final AppointmentServiceClient appointmentServiceClient;

    @Override
    @Transactional
    @CacheEvict(value = "doctorAvailability", key = "#doctorId")
    public DoctorAvailabilityDTO setDoctorAvailability(String doctorId, DoctorAvailabilityDTO availabilityDTO) {

        validateTimeRanges(availabilityDTO);

        DoctorAvailability availability = availabilityRepository
                .findByDoctorIdAndDayOfWeek(doctorId, availabilityDTO.getDayOfWeek())
                .orElse(new DoctorAvailability());

        availability.setDoctorId(doctorId);
        availability.setDayOfWeek(availabilityDTO.getDayOfWeek());
        availability.setStartTime(availabilityDTO.getStartTime());
        availability.setEndTime(availabilityDTO.getEndTime());
        availability.setBreakStart(availabilityDTO.getBreakStart());
        availability.setBreakEnd(availabilityDTO.getBreakEnd());
        availability.setSlotDuration(availabilityDTO.getSlotDuration() != null ? availabilityDTO.getSlotDuration() : 30);
        availability.setIsAvailable(availabilityDTO.getIsAvailable() != null ? availabilityDTO.getIsAvailable() : true);

        DoctorAvailability savedAvailability = availabilityRepository.save(availability);
        return modelMapper.map(savedAvailability, DoctorAvailabilityDTO.class);
    }


    @Override
    @Cacheable(value = "doctorAvailability", key = "#doctorId")
    public List<DoctorAvailabilityDTO> getDoctorAvailability(String doctorId) {

        List<DoctorAvailability> availabilities = availabilityRepository.findByDoctorId(doctorId);
        return availabilities.stream()
                .map(availability -> modelMapper.map(availability, DoctorAvailabilityDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "doctorAvailability", key = "#doctorId + ':day:' + #dayOfWeek")
    public DoctorAvailabilityDTO getDoctorAvailabilityByDay(String doctorId, Integer dayOfWeek) {

        DoctorAvailability availability = availabilityRepository.findByDoctorIdAndDayOfWeek(doctorId, dayOfWeek)
                .orElseThrow(() -> new ResourceNotFoundException("Availability", "day of week", dayOfWeek));

        return modelMapper.map(availability, DoctorAvailabilityDTO.class);
    }


    @Override
    @Transactional
    @CacheEvict(value = "doctorAvailability", key = "#doctorId")
    public List<DoctorAvailabilityDTO> updateAvailabilityBulk(String doctorId, List<DoctorAvailabilityDTO> availabilityDTOs) {

        List<DoctorAvailabilityDTO> updatedAvailabilities = new ArrayList<>();

        for (DoctorAvailabilityDTO availabilityDTO : availabilityDTOs) {
            // Validate each availability
            validateTimeRanges(availabilityDTO);

            // Set doctor ID to ensure consistency
            availabilityDTO.setDoctorId(doctorId);

            updatedAvailabilities.add(setDoctorAvailability(doctorId, availabilityDTO));
        }

        return updatedAvailabilities;
    }

    @Override
    @Transactional
    @CacheEvict(value = "doctorAvailability", allEntries = true)
    public DoctorAvailabilityDTO toggleAvailability(String doctorId, Integer dayOfWeek) {

        DoctorAvailability availability = availabilityRepository.findByDoctorIdAndDayOfWeek(doctorId, dayOfWeek)
                .orElseThrow(() -> new ResourceNotFoundException("Availability", "day of week", dayOfWeek));

        availability.setIsAvailable(!availability.getIsAvailable());

        DoctorAvailability updatedAvailability = availabilityRepository.save(availability);
        return modelMapper.map(updatedAvailability, DoctorAvailabilityDTO.class);
    }

    @Override
    @Cacheable(value = "availableSlots", key = "#doctorId + ':date:' + #date")
    public List<AvailableSlotDTO> getAvailableSlots(String doctorId, LocalDate date) {

        int dayOfWeek = DateTimeUtil.getDayOfWeek(date);

        DoctorAvailability availability = availabilityRepository.findByDoctorIdAndDayOfWeek(doctorId, dayOfWeek)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor is not available on this day"));

        if (!availability.getIsAvailable()) {
            return new ArrayList<>();
        }

        var appointments = appointmentServiceClient.getDoctorAppointmentsByDate(doctorId, date);
        List<LocalTime> allSlots = DateTimeUtil.generateTimeSlots(
                availability.getStartTime(),
                availability.getEndTime(),
                availability.getSlotDuration(),
                availability.getBreakStart(),
                availability.getBreakEnd()
        );

        // Filter out booked slots
        List<AvailableSlotDTO> availableSlots = new ArrayList<>();
        for (LocalTime slotStart : allSlots) {
            LocalTime slotEnd = slotStart.plusMinutes(availability.getSlotDuration());

            boolean isBooked = appointments.stream().anyMatch(apt -> {
                LocalTime aptStart = apt.getStartTime();
                LocalTime aptEnd = apt.getEndTime();

                return (slotStart.equals(aptStart) || slotStart.isAfter(aptStart)) && slotStart.isBefore(aptEnd)
                        || (slotEnd.isAfter(aptStart) && (slotEnd.equals(aptEnd) || slotEnd.isBefore(aptEnd)));
            });

            if (!isBooked) {
                availableSlots.add(AvailableSlotDTO.builder()
                        .startTime(slotStart)
                        .endTime(slotEnd)
                        .available(true)
                        .build());
            }
        }

        return availableSlots;
    }

    private void validateTimeRanges(DoctorAvailabilityDTO availabilityDTO) {
        if (availabilityDTO.getStartTime() == null || availabilityDTO.getEndTime() == null) {
            throw new BadRequestException("Start time and end time are required");
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

        if (availabilityDTO.getDayOfWeek() == null || availabilityDTO.getDayOfWeek() < 0 || availabilityDTO.getDayOfWeek() > 6) {
            throw new BadRequestException("Day of week must be between 0 (Sunday) and 6 (Saturday)");
        }
    }
}
