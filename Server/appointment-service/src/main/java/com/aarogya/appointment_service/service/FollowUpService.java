package com.aarogya.appointment_service.service;

import com.aarogya.appointment_service.dto.request.FollowUpRequestDto;
import com.aarogya.appointment_service.dto.response.FollowUpResponseDto;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.util.List;

public interface FollowUpService {

    FollowUpResponseDto scheduleFollowUp(String originalAppointmentId, FollowUpRequestDto requestDto);

    Page<FollowUpResponseDto> getFollowUps(String status, int page, int size);

    FollowUpResponseDto updateFollowUpStatus(String followUpId, String status);

    List<FollowUpResponseDto> getUrgentFollowUps(
            String doctorId,
            Integer urgencyLevel);

    List<FollowUpResponseDto> getPatientFollowUpSummary(
            String patientId,
            String status);

    List<FollowUpResponseDto> processOverdueFollowUps();

    FollowUpResponseDto getFollowUpDetails(String followUpId);

    Page<FollowUpResponseDto> getFollowUpsByDateRange(
            String status,
            LocalDate startDate,
            LocalDate endDate,
            int page, int size);
}
