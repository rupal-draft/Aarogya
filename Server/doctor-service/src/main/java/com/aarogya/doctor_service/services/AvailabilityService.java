package com.aarogya.doctor_service.services;

import com.aarogya.doctor_service.dto.AvailableSlotDTO;
import com.aarogya.doctor_service.dto.DoctorAvailabilityDTO;

import java.time.LocalDate;
import java.util.List;

public interface AvailabilityService {

    DoctorAvailabilityDTO setDoctorAvailability(String doctorId, DoctorAvailabilityDTO availabilityDTO);

    List<DoctorAvailabilityDTO> getDoctorAvailability(String doctorId);

    DoctorAvailabilityDTO getDoctorAvailabilityByDay(String doctorId, Integer dayOfWeek);

    List<DoctorAvailabilityDTO> updateAvailabilityBulk(String doctorId, List<DoctorAvailabilityDTO> availabilityDTOs);

    DoctorAvailabilityDTO toggleAvailability(String doctorId, Integer dayOfWeek);

    List<AvailableSlotDTO> getAvailableSlots(String doctorId, LocalDate date);
}
