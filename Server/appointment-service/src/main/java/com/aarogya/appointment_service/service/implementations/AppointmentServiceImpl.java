package com.aarogya.appointment_service.service.implementations;

import com.aarogya.appointment_service.Clients.UserGrpcClient;
import com.aarogya.appointment_service.auth.UserContextHolder;
import com.aarogya.appointment_service.dto.request.AppointmentRequestDto;
import com.aarogya.appointment_service.dto.request.EmergencyAppointmentDto;
import com.aarogya.appointment_service.dto.request.UpdateAppointmentStatusDto;
import com.aarogya.appointment_service.dto.response.AppointmentResponseDto;
import com.aarogya.appointment_service.exceptions.DataIntegrityViolation;
import com.aarogya.appointment_service.exceptions.ResourceNotFound;
import com.aarogya.appointment_service.exceptions.ServiceUnavailable;
import com.aarogya.appointment_service.models.Appointment;
import com.aarogya.appointment_service.models.enums.AppointmentStatus;
import com.aarogya.appointment_service.models.enums.AppointmentType;
import com.aarogya.appointment_service.repository.AppointmentRepository;
import com.aarogya.appointment_service.service.AppointmentService;
import com.aarogya.appointment_service.service.NotificationService;
import com.aarogya.appointment_service.utils.AppointmentValidator;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.MappingException;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Validated
public class AppointmentServiceImpl implements AppointmentService {

    private static final String APPOINTMENT_CACHE = "appointments";
    private static final String EMERGENCY_APPOINTMENT_LOG_PREFIX = "[EMERGENCY]";
    private static final String REGULAR_APPOINTMENT_LOG_PREFIX = "[REGULAR]";

    private final AppointmentRepository appointmentRepository;
    private final UserGrpcClient authServiceClient;
    private final ModelMapper modelMapper;
    private final NotificationService notificationService;
    private final AppointmentValidator appointmentValidator;

    @Transactional
    @CacheEvict(value = APPOINTMENT_CACHE, allEntries = true)
    @Override
    public AppointmentResponseDto requestAppointment(@Valid AppointmentRequestDto requestDto) {
        final String methodName = "requestAppointment";
        log.info("{} Processing appointment request for doctor: {}", REGULAR_APPOINTMENT_LOG_PREFIX, requestDto.getDoctorId());

        try {
            String patientId = UserContextHolder.getUserDetails().getUserId();
            log.debug("{} Patient ID: {}", REGULAR_APPOINTMENT_LOG_PREFIX, patientId);

            appointmentValidator.validateAppointmentRequest(requestDto, null);

            Appointment appointment = buildAppointmentFromRequest(requestDto, patientId);
            appointment = appointmentRepository.save(appointment);

            notificationService.sendAppointmentRequestNotification(appointment);
            log.info("{} Appointment created successfully with ID: {}", REGULAR_APPOINTMENT_LOG_PREFIX, appointment.getId());

            return mapToResponseDto(appointment);
        } catch (DataIntegrityViolationException e) {
            log.error("{} Data integrity violation while creating appointment", REGULAR_APPOINTMENT_LOG_PREFIX, e);
            throw new DataIntegrityViolation("Error creating appointment due to data constraints");
        } catch (MappingException e) {
            log.error("{} Mapping error while creating appointment", REGULAR_APPOINTMENT_LOG_PREFIX, e);
            throw new ServiceUnavailable("Error processing appointment data");
        } catch (Exception e) {
            log.error("{} Unexpected error while creating appointment", REGULAR_APPOINTMENT_LOG_PREFIX, e);
            throw new ServiceUnavailable(e.getLocalizedMessage());
        }
    }

    @Transactional
    @CacheEvict(value = APPOINTMENT_CACHE, key = "#appointmentId")
    @Override
    public AppointmentResponseDto updateAppointmentStatus(String appointmentId, @Valid UpdateAppointmentStatusDto updateDto) {
        log.info("Updating appointment status for ID: {}", appointmentId);

        try {
            String doctorId = UserContextHolder.getUserDetails().getUserId();
            Appointment appointment = appointmentRepository.findByIdAndDoctorId(appointmentId, doctorId)
                    .orElseThrow(() -> new ResourceNotFound("Appointment not found with ID: " + appointmentId));

            AppointmentStatus oldStatus = appointment.getStatus();
            updateAppointmentStatus(appointment, updateDto);

            appointment = appointmentRepository.save(appointment);

            if (!oldStatus.equals(appointment.getStatus())) {
                notificationService.sendAppointmentStatusUpdateNotification(appointment, oldStatus);
            }

            log.info("Appointment status updated successfully for ID: {}", appointmentId);
            return mapToResponseDto(appointment);
        } catch (ResourceNotFound e) {
            log.error("Appointment not found: {}", e.getMessage());
            throw e;
        } catch (DataIntegrityViolationException e) {
            log.error("Data integrity violation while updating appointment status", e);
            throw new DataIntegrityViolation("Error updating appointment status");
        } catch (Exception e) {
            log.error("Unexpected error updating appointment status", e);
            throw new ServiceUnavailable(e.getLocalizedMessage());
        }
    }

    @Transactional
    @CacheEvict(value = APPOINTMENT_CACHE, allEntries = true)
    @Override
    public AppointmentResponseDto requestEmergencyAppointment(@Valid EmergencyAppointmentDto emergencyDto) {
        log.info("{} Processing emergency appointment request", EMERGENCY_APPOINTMENT_LOG_PREFIX);

        try {
            String patientId = UserContextHolder.getUserDetails().getUserId();
            String doctorId = findAvailableDoctorForEmergency(emergencyDto.getPreferredSpecialization());

            LocalTime currentTime = LocalTime.now();
            LocalTime endTime = currentTime.plusMinutes(30);

            Appointment appointment = buildEmergencyAppointment(emergencyDto, patientId, doctorId, currentTime, endTime);
            appointment = appointmentRepository.save(appointment);

            notificationService.sendEmergencyAppointmentNotification(appointment);
            log.info("{} Emergency appointment created successfully with ID: {}", EMERGENCY_APPOINTMENT_LOG_PREFIX, appointment.getId());

            return mapToResponseDto(appointment);
        } catch (ResourceNotFound e) {
            log.error("{} No available doctor found for emergency",e);
            throw new ResourceNotFound("No available doctor found for emergency");
        } catch (DataIntegrityViolationException e) {
            log.error("{} Data integrity violation while creating emergency appointment", EMERGENCY_APPOINTMENT_LOG_PREFIX, e);
            throw new DataIntegrityViolation("Error creating emergency appointment");
        } catch (Exception e) {
            log.error("{} Unexpected error creating emergency appointment", EMERGENCY_APPOINTMENT_LOG_PREFIX, e);
            throw new ServiceUnavailable(e.getLocalizedMessage());
        }
    }

    private String findAvailableDoctorForEmergency(String preferredSpecialization) {
        return "682c9dadc231b526e2eecca7";
    }

    @Cacheable(value = APPOINTMENT_CACHE, key = "#appointmentId")
    @Transactional(readOnly = true)
    @Override
    public AppointmentResponseDto getAppointmentDetails(String appointmentId) {
        log.debug("Fetching appointment details for ID: {}", appointmentId);

        try {
            String userId = UserContextHolder.getUserDetails().getUserId();
            String userRole = UserContextHolder.getUserDetails().getRole();

            Appointment appointment = fetchAppointmentBasedOnRole(appointmentId, userId, userRole);
            return mapToResponseDto(appointment);
        } catch (ResourceNotFound e) {
            log.error("Appointment not found: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Error fetching appointment details", e);
            throw new ServiceUnavailable(e.getLocalizedMessage());
        }
    }

    @Cacheable(value = APPOINTMENT_CACHE, key = "{#status, #date, #page, #size, 'patient'}")
    @Transactional(readOnly = true)
    @Override
    public Page<AppointmentResponseDto> getPatientAppointments(AppointmentStatus status, LocalDate date, int page, int size) {
        log.debug("Fetching patient appointments with status: {}, date: {}, page: {}, size: {}", status, date, page, size);

        try {
            String patientId = UserContextHolder.getUserDetails().getUserId();
            Pageable pageable = PageRequest.of(page, size, Sort.by("appointmentDate").descending().and(Sort.by("startTime").descending()));

            Page<Appointment> appointments = fetchPatientAppointments(patientId, status, date, pageable);
            return appointments.map(this::mapToResponseDto);
        } catch (Exception e) {
            log.error("Error fetching patient appointments", e);
            throw new ServiceUnavailable(e.getLocalizedMessage());
        }
    }

    @Cacheable(value = APPOINTMENT_CACHE, key = "{#status, #date, #page, #size, 'doctor'}")
    @Transactional(readOnly = true)
    @Override
    public Page<AppointmentResponseDto> getDoctorAppointments(AppointmentStatus status, LocalDate date, int page, int size) {
        log.debug("Fetching doctor appointments with status: {}, date: {}, page: {}, size: {}", status, date, page, size);

        try {
            String doctorId = UserContextHolder.getUserDetails().getUserId();
            Pageable pageable = PageRequest.of(page, size, Sort.by("appointmentDate").descending().and(Sort.by("startTime").descending()));

            Page<Appointment> appointments = fetchDoctorAppointments(doctorId, status, date, pageable);
            return appointments.map(this::mapToResponseDto);
        } catch (Exception e) {
            log.error("Error fetching doctor appointments", e);
            throw new ServiceUnavailable(e.getLocalizedMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = APPOINTMENT_CACHE, key = "#fromDate")
    public List<AppointmentResponseDto> getUpcomingAppointments(LocalDate fromDate) {
        log.info("Fetching upcoming appointments from date: {}", fromDate);
        List<Appointment> appointments = appointmentRepository.findUpcomingAppointments(fromDate);
        return appointments.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = APPOINTMENT_CACHE, key = "{#doctorId, #startDate, #endDate}")
    public List<AppointmentResponseDto> getDoctorAppointmentsBetweenDates(
            String doctorId, LocalDate startDate, LocalDate endDate) {
        log.info("Fetching doctor appointments between {} and {} for doctor {}", startDate, endDate, doctorId);
        Sort sort = Sort.by("appointmentDate").ascending()
                .and(Sort.by("startTime").ascending());
        List<Appointment> appointments = appointmentRepository.findByDoctorIdAndAppointmentDateBetween(
                doctorId, startDate, endDate, sort);
        return appointments.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = APPOINTMENT_CACHE, key = "{#patientId, #startDate, #endDate}")
    public List<AppointmentResponseDto> getPatientAppointmentsBetweenDates(
            String patientId, LocalDate startDate, LocalDate endDate) {
        log.info("Fetching patient appointments between {} and {} for patient {}", startDate, endDate, patientId);
        Sort sort = Sort.by("appointmentDate").ascending()
                .and(Sort.by("startTime").ascending());
        List<Appointment> appointments = appointmentRepository.findByPatientIdAndAppointmentDateBetween(
                patientId, startDate, endDate, sort);
        return appointments.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    private Appointment buildAppointmentFromRequest(AppointmentRequestDto requestDto, String patientId) {
        Appointment appointment = modelMapper.map(requestDto, Appointment.class);
        appointment.setPatientId(patientId);
        appointment.setStatus(AppointmentStatus.PENDING);
        if (Boolean.TRUE.equals(requestDto.getIsVirtual())) {
            appointment.setMeetingLink(generateMeetingLink());
        }
        return appointment;
    }

    private void updateAppointmentStatus(Appointment appointment, UpdateAppointmentStatusDto updateDto) {
        appointment.setStatus(updateDto.getStatus());
        appointment.setNotes(updateDto.getNotes());
        appointment.setDoctorNotes(updateDto.getDoctorNotes());
    }

    private Appointment buildEmergencyAppointment(EmergencyAppointmentDto emergencyDto, String patientId,
                                                  String doctorId, LocalTime startTime, LocalTime endTime) {
        Appointment appointment = new Appointment();
        appointment.setDoctorId(doctorId);
        appointment.setPatientId(patientId);
        appointment.setAppointmentDate(LocalDate.now());
        appointment.setStartTime(startTime);
        appointment.setEndTime(endTime);
        appointment.setType(AppointmentType.EMERGENCY);
        appointment.setReason(emergencyDto.getEmergencyDescription());
        appointment.setSymptoms(emergencyDto.getSymptoms());
        appointment.setStatus(AppointmentStatus.APPROVED);
        appointment.setPriority(emergencyDto.getPriority());
        appointment.setMeetingLink(generateMeetingLink());

        return appointment;
    }

    private Appointment fetchAppointmentBasedOnRole(String appointmentId, String userId, String userRole) {
        return "DOCTOR".equals(userRole)
                ? appointmentRepository.findByIdAndDoctorId(appointmentId, userId)
                .orElseThrow(() -> new ResourceNotFound("Appointment not found"))
                : appointmentRepository.findByIdAndPatientId(appointmentId, userId)
                .orElseThrow(() -> new ResourceNotFound("Appointment not found"));
    }

    private Page<Appointment> fetchPatientAppointments(String patientId, AppointmentStatus status,
                                                       LocalDate date, Pageable pageable) {
        if (status != null && date != null) {
            return appointmentRepository.findByPatientIdAndStatusAndAppointmentDate(
                    patientId, status, date, pageable);
        } else if (status != null) {
            return appointmentRepository.findByPatientIdAndStatus(patientId, status, pageable);
        } else if (date != null) {
            return appointmentRepository.findByPatientIdAndAppointmentDate(patientId, date, pageable);
        }
        return appointmentRepository.findByPatientId(patientId, pageable);
    }

    private Page<Appointment> fetchDoctorAppointments(String doctorId, AppointmentStatus status,
                                                      LocalDate date, Pageable pageable) {
        if (status != null && date != null) {
            return appointmentRepository.findByDoctorIdAndStatusAndAppointmentDate(
                    doctorId, status, date, pageable);
        } else if (status != null) {
            return appointmentRepository.findByDoctorIdAndStatus(doctorId, status, pageable);
        } else if (date != null) {
            return appointmentRepository.findByDoctorIdAndAppointmentDate(doctorId, date, pageable);
        }
        return appointmentRepository.findByDoctorId(doctorId, pageable);
    }

    private String generateMeetingLink() {
        return "https://meet.aarogya.com/room/" + UUID.randomUUID();
    }

    private AppointmentResponseDto mapToResponseDto(Appointment appointment) {
        AppointmentResponseDto responseDto = modelMapper.map(appointment, AppointmentResponseDto.class);

        try {
            responseDto.setDoctor(authServiceClient.getDoctor(appointment.getDoctorId()));
            responseDto.setPatientDetails(authServiceClient.getPatient(appointment.getPatientId()));
        } catch (Exception e) {
            log.warn("Failed to fetch user details for appointment: {}", appointment.getId(), e);
            throw e;
        }

        return responseDto;
    }
}
