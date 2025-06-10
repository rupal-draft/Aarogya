package com.aarogya.appointment_service.service.implementations;

import com.aarogya.appointment_service.auth.UserContextHolder;
import com.aarogya.appointment_service.dto.request.FollowUpRequestDto;
import com.aarogya.appointment_service.dto.response.AppointmentResponseDto;
import com.aarogya.appointment_service.dto.response.FollowUpResponseDto;
import com.aarogya.appointment_service.exceptions.IllegalState;
import com.aarogya.appointment_service.exceptions.ResourceNotFound;
import com.aarogya.appointment_service.exceptions.ServiceUnavailable;
import com.aarogya.appointment_service.models.Appointment;
import com.aarogya.appointment_service.models.FollowUp;
import com.aarogya.appointment_service.models.enums.FollowUpStatus;
import com.aarogya.appointment_service.repository.AppointmentRepository;
import com.aarogya.appointment_service.repository.FollowUpRepository;
import com.aarogya.appointment_service.service.FollowUpService;
import com.aarogya.appointment_service.service.NotificationService;
import com.aarogya.appointment_service.utils.FollowUpValidator;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Valid;
import jakarta.validation.ValidationException;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Validated
public class FollowUpServiceImpl implements FollowUpService {

    private static final String FOLLOW_UP_CACHE = "followUps";
    private static final String DOCTOR_ROLE = "DOCTOR";
    private static final String PATIENT_ROLE = "PATIENT";

    private final FollowUpRepository followUpRepository;
    private final AppointmentRepository appointmentRepository;
    private final ModelMapper modelMapper;
    private final NotificationService notificationService;
    private final FollowUpValidator followUpValidator;

    @Override
    @Transactional
    @CacheEvict(value = FOLLOW_UP_CACHE, allEntries = true)
    public FollowUpResponseDto scheduleFollowUp(
            @NotBlank String originalAppointmentId,
            @Valid FollowUpRequestDto requestDto) {

        log.info("Scheduling follow-up for appointment: {}", originalAppointmentId);

        try {
            String doctorId = UserContextHolder.getUserDetails().getUserId();

            followUpValidator.validateFollowUpRequest(originalAppointmentId, doctorId, requestDto);

            FollowUp followUp = buildFollowUpFromRequest(originalAppointmentId, doctorId, requestDto);
            followUp = followUpRepository.save(followUp);

            Appointment originalAppointment = appointmentRepository.findById(originalAppointmentId)
                    .orElseThrow(() -> new ResourceNotFound("Original appointment not found"));

            notificationService.sendFollowUpScheduledNotification(followUp, originalAppointment);

            log.info("Follow-up scheduled successfully with ID: {}", followUp.getId());
            return mapToResponseDto(followUp);

        } catch (ResourceNotFound e) {
            log.error("Original appointment not found: {}", e.getMessage());
            throw e;
        } catch (ConstraintViolationException e) {
            log.error("Validation error while scheduling follow-up: {}", e.getMessage());
            throw new ValidationException("Invalid follow-up request data");
        } catch (Exception e) {
            log.error("Unexpected error scheduling follow-up", e);
            throw new ServiceUnavailable(e.getLocalizedMessage());
        }
    }

    @Override
    @Cacheable(value = FOLLOW_UP_CACHE, key = "{#status, #page, #size, #userRole}")
    @Transactional(readOnly = true)
    public Page<FollowUpResponseDto> getFollowUps(String status, int page, int size) {
        log.info("Getting follow-ups with status: {}, page: {}, size: {}", status, page, size);

        try {
            String userId = UserContextHolder.getUserDetails().getUserId();
            String userRole = UserContextHolder.getUserDetails().getRole();
            Pageable pageable = PageRequest.of(page, size, Sort.by("recommendedDate").ascending());
            FollowUpStatus followUpStatus = status != null ? FollowUpStatus.valueOf(status.toUpperCase()) : null;
            Page<FollowUp> followUps = fetchFollowUpsBasedOnRole(userId, userRole, followUpStatus, pageable);
            return followUps.map(this::mapToResponseDto);

        } catch (Exception e) {
            log.error("Error fetching follow-ups", e);
            throw new ServiceUnavailable(e.getLocalizedMessage());
        }
    }

    @Override
    @Cacheable(value = FOLLOW_UP_CACHE, key = "{#status, #startDate, #endDate, #page, #size, #userRole}")
    @Transactional(readOnly = true)
    public Page<FollowUpResponseDto> getFollowUpsByDateRange(
            String status,
            @NotNull LocalDate startDate,
            @NotNull LocalDate endDate,
            int page, int size) {

        log.info("Getting follow-ups between {} and {} with status {}", startDate, endDate, status);

        try {
            String userId = UserContextHolder.getUserDetails().getUserId();
            String userRole = UserContextHolder.getUserDetails().getRole();
            Pageable pageable = PageRequest.of(page, size, Sort.by("recommendedDate").ascending());
            FollowUpStatus followUpStatus = status != null ? FollowUpStatus.valueOf(status.toUpperCase()) : null;
            Page<FollowUp> followUps = fetchFollowUpsByDateRange(userId, userRole, followUpStatus, startDate, endDate, pageable);
            return followUps.map(this::mapToResponseDto);

        } catch (Exception e) {
            log.error("Error fetching follow-ups by date range", e);
            throw new ServiceUnavailable(e.getLocalizedMessage());
        }
    }

    @Override
    @Transactional
    @Scheduled(cron = "0 0 9 * * ?")
    @CacheEvict(value = FOLLOW_UP_CACHE, allEntries = true)
    public List<FollowUpResponseDto> processOverdueFollowUps() {
        log.info("Processing overdue follow-ups");

        try {
            List<FollowUp> overdueFollowUps = followUpRepository.findOverdueFollowUps(LocalDate.now());

            overdueFollowUps.forEach(followUp -> {
                followUp.setStatus(FollowUpStatus.OVERDUE);
                followUp.setUpdatedAt(LocalDateTime.now());
                followUpRepository.save(followUp);
                notificationService.sendFollowUpStatusNotification(followUp);
            });

            log.info("Marked {} follow-ups as overdue", overdueFollowUps.size());
            return overdueFollowUps.stream()
                    .map(this::mapToResponseDto)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error processing overdue follow-ups", e);
            throw new ServiceUnavailable(e.getLocalizedMessage());
        }
    }

    @Override
    @Transactional
    @CacheEvict(value = FOLLOW_UP_CACHE, key = "#followUpId")
    public FollowUpResponseDto updateFollowUpStatus(
            @NotBlank String followUpId,
            @NotNull String status) {

        log.info("Updating follow-up {} status to {}", followUpId, status);

        try {
            String userId = UserContextHolder.getUserDetails().getUserId();
            String userRole = UserContextHolder.getUserDetails().getRole();

            FollowUp followUp = fetchFollowUpForUpdate(followUpId, userId, userRole);
            FollowUpStatus previousStatus = followUp.getStatus();
            FollowUpStatus followUpStatus = status != null ? FollowUpStatus.valueOf(status.toUpperCase()) : null;
            updateFollowUpStatus(followUp, followUpStatus, userId);
            followUp = followUpRepository.save(followUp);

            if (!previousStatus.equals(status)) {
                notificationService.sendFollowUpStatusNotification(followUp);
            }

            log.info("Follow-up {} status updated to {}", followUpId, status);
            return mapToResponseDto(followUp);

        } catch (ResourceNotFound e) {
            log.error("Follow-up not found: {}", e.getMessage());
            throw e;
        } catch (IllegalStateException e) {
            log.error("Invalid status transition: {}", e.getMessage());
            throw new IllegalState(e.getMessage());
        } catch (Exception e) {
            log.error("Error updating follow-up status", e);
            throw new ServiceUnavailable(e.getLocalizedMessage());
        }
    }

    @Override
    @Cacheable(value = FOLLOW_UP_CACHE, key = "{#followUpId}")
    @Transactional(readOnly = true)
    public FollowUpResponseDto getFollowUpDetails(@NotBlank String followUpId) {
        log.debug("Fetching details for follow-up: {}", followUpId);

        try {

            FollowUp followUp = followUpRepository
                    .findById(followUpId)
                    .orElseThrow(() -> new ResourceNotFound("Follow-up not found"));
            return mapToResponseDto(followUp);

        } catch (ResourceNotFound e) {
            log.error("Follow-up not found: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Error fetching follow-up details", e);
            throw new ServiceUnavailable(e.getLocalizedMessage());
        }
    }

    @Override
    @Cacheable(value = FOLLOW_UP_CACHE, key = "{#patientId, #status}")
    public List<FollowUpResponseDto> getPatientFollowUpSummary(
            @NotBlank String patientId,
            String status) {

        log.debug("Getting follow-up summary for patient: {}", patientId);
        Pageable pageable = PageRequest.of(0, Integer.MAX_VALUE, Sort.by("recommendedDate").ascending());
        try {
            FollowUpStatus followUpStatus = status != null ? FollowUpStatus.valueOf(status.toUpperCase()) : null;
            Page<FollowUp> followUps = status != null
                    ? followUpRepository.findByPatientIdAndStatus(patientId, followUpStatus, pageable)
                    : followUpRepository.findByPatientId(patientId, pageable);

            return followUps.stream()
                    .map(this::mapToResponseDto)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error fetching patient follow-up summary", e);
            throw new ServiceUnavailable(e.getLocalizedMessage());
        }
    }

    @Override
    @Cacheable(value = FOLLOW_UP_CACHE, key = "{#doctorId, #urgencyLevel}")
    public List<FollowUpResponseDto> getUrgentFollowUps(
            @NotBlank String doctorId,
            @Min(1) @Max(5) Integer urgencyLevel) {

        log.debug("Getting urgent follow-ups for doctor: {} with level: {}", doctorId, urgencyLevel);

        try {
            List<FollowUp> followUps = followUpRepository.findByDoctorIdAndStatusAndUrgencyLevelGreaterThanEqual(
                    doctorId, FollowUpStatus.PENDING, urgencyLevel, Sort.by("recommendedDate").ascending());

            return followUps.stream()
                    .map(this::mapToResponseDto)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error fetching urgent follow-ups", e);
            throw new ServiceUnavailable(e.getLocalizedMessage());
        }
    }

    private FollowUpResponseDto mapToResponseDto(FollowUp followUp) {
        Appointment originalAppointment = appointmentRepository
                .findById(followUp.getOriginalAppointmentId()).orElseThrow(() -> new ResourceNotFound("Original appointment not found"));
        AppointmentResponseDto originalAppointmentDto = modelMapper.map(originalAppointment, AppointmentResponseDto.class);
        FollowUpResponseDto responseDto = modelMapper.map(followUp, FollowUpResponseDto.class);
        responseDto.setOriginalAppointment(originalAppointmentDto);
        return responseDto;
    }

    private FollowUp buildFollowUpFromRequest(String originalAppointmentId, String doctorId, FollowUpRequestDto requestDto) {
        return FollowUp.builder()
                .originalAppointmentId(originalAppointmentId)
                .doctorId(doctorId)
                .patientId(requestDto.getPatientId())
                .recommendedDate(requestDto.getRecommendedDate())
                .reason(requestDto.getReason())
                .status(FollowUpStatus.PENDING)
                .notes(requestDto.getNotes())
                .urgencyLevel(requestDto.getUrgencyLevel())
                .build();
    }

    private Page<FollowUp> fetchFollowUpsBasedOnRole(String userId, String userRole, FollowUpStatus status, Pageable pageable) {
        if (DOCTOR_ROLE.equals(userRole)) {
            return status != null
                    ? followUpRepository.findByDoctorIdAndStatus(userId, status, pageable)
                    : followUpRepository.findByDoctorId(userId, pageable);
        } else if (PATIENT_ROLE.equals(userRole)) {
            return status != null
                    ? followUpRepository.findByPatientIdAndStatus(userId, status, pageable)
                    : followUpRepository.findByPatientId(userId, pageable);
        }
        return status != null
                ? followUpRepository.findByStatus(status, pageable)
                : followUpRepository.findAll(pageable);
    }

    private Page<FollowUp> fetchFollowUpsByDateRange(String userId, String userRole, FollowUpStatus status,
                                                     LocalDate startDate, LocalDate endDate, Pageable pageable) {
        if (DOCTOR_ROLE.equals(userRole)) {
            return status != null
                    ? followUpRepository.findByDoctorIdAndStatusAndRecommendedDateBetween(userId, status, startDate, endDate, pageable)
                    : followUpRepository.findByDoctorIdAndRecommendedDateBetween(userId, startDate, endDate, pageable);
        } else if (PATIENT_ROLE.equals(userRole)) {
            return status != null
                    ? followUpRepository.findByPatientIdAndStatusAndRecommendedDateBetween(userId, status, startDate, endDate, pageable)
                    : followUpRepository.findByPatientIdAndRecommendedDateBetween(userId, startDate, endDate, pageable);
        }
        return status != null
                ? followUpRepository.findByStatusAndRecommendedDateBetween(status, startDate, endDate, pageable)
                : followUpRepository.findByRecommendedDateBetween(startDate, endDate, pageable);
    }

    private FollowUp fetchFollowUpForUpdate(String followUpId, String userId, String userRole) {
        if (DOCTOR_ROLE.equals(userRole)) {
            return followUpRepository.findByIdAndDoctorId(followUpId, userId)
                    .orElseThrow(() -> new ResourceNotFound("Follow-up not found"));
        } else if (PATIENT_ROLE.equals(userRole)) {
            return followUpRepository.findByIdAndPatientId(followUpId, userId)
                    .orElseThrow(() -> new ResourceNotFound("Follow-up not found"));
        }
        return followUpRepository.findById(followUpId)
                .orElseThrow(() -> new ResourceNotFound("Follow-up not found"));
    }

    private void updateFollowUpStatus(FollowUp followUp, FollowUpStatus newStatus, String updatedBy) {
        if (FollowUpStatus.COMPLETED.equals(newStatus)) {
            followUp.setCompletedAt(LocalDateTime.now());
            followUp.setCompletedBy(updatedBy);
        }
        followUp.setStatus(newStatus);
        followUp.setUpdatedAt(LocalDateTime.now());
    }
}
