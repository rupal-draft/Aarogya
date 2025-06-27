package com.aarogya.doctor_service.controller;

import com.aarogya.doctor_service.auth.UserContextHolder;
import com.aarogya.doctor_service.clients.UserGrpcClient;
import com.aarogya.doctor_service.dto.appointments.AvailableSlotDTO;
import com.aarogya.doctor_service.dto.doctor.DoctorAvailabilityDTO;
import com.aarogya.doctor_service.dto.doctor.DoctorResponseDTO;
import com.aarogya.doctor_service.services.AvailabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/availability")
@RequiredArgsConstructor
public class AvailabilityController {

    private final AvailabilityService availabilityService;
    private final UserGrpcClient userGrpcClient;

    @PostMapping
    public ResponseEntity<DoctorAvailabilityDTO> setDoctorAvailability(
            @RequestBody DoctorAvailabilityDTO availabilityDTO) {
        return ResponseEntity.ok(availabilityService.setDoctorAvailability(UserContextHolder.getUserDetails().getUserId(), availabilityDTO));
    }

    @GetMapping("/{doctorId}")
    public ResponseEntity<Map<String, Object>> getDoctorAvailability(
            @PathVariable String doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        int dayOfWeek = date.getDayOfWeek().getValue() % 7;

        DoctorAvailabilityDTO availability = availabilityService.getDoctorAvailabilityByDay(doctorId, dayOfWeek);

        List<AvailableSlotDTO> availableSlots = availabilityService.getAvailableSlots(doctorId, date);

        DoctorResponseDTO doctorResponseDTO = userGrpcClient.getDoctor(doctorId);

        Map<String, Object> response = Map.of(
                "doctor", doctorResponseDTO,
                "availability", availability,
                "availableSlots", availableSlots
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/schedule/bulk")
    public ResponseEntity<List<DoctorAvailabilityDTO>> updateAvailabilityBulk(
            @RequestBody List<DoctorAvailabilityDTO> availabilityDTOs) {

        return ResponseEntity.ok(availabilityService.updateAvailabilityBulk(UserContextHolder.getUserDetails().getUserId(), availabilityDTOs));
    }

    @PatchMapping("/schedule/{dayOfWeek}/toggle")
    public ResponseEntity<DoctorAvailabilityDTO> toggleAvailability(
            @PathVariable Integer dayOfWeek) {

        return ResponseEntity.ok(availabilityService.toggleAvailability(UserContextHolder.getUserDetails().getUserId(), dayOfWeek));
    }
}
