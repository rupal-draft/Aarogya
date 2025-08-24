package com.aarogya.patient_management_service.service.implementations;

import com.aarogya.patient_management_service.dto.request.CreateDoctorNoteRequest;
import com.aarogya.patient_management_service.dto.request.UpdateDoctorNoteRequest;
import com.aarogya.patient_management_service.dto.response.DoctorNoteResponse;
import com.aarogya.patient_management_service.exceptions.ResourceNotFoundException;
import com.aarogya.patient_management_service.exceptions.ServiceException;
import com.aarogya.patient_management_service.model.DoctorNote;
import com.aarogya.patient_management_service.repository.DoctorNoteRepository;
import com.aarogya.patient_management_service.service.DoctorNoteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DoctorNoteServiceImpl implements DoctorNoteService {

    private static final String DOCTOR_NOTE_NOT_FOUND = "Doctor note not found with ID: %s for patient: %s";
    private static final int RECENT_DAYS_THRESHOLD = 7;

    private final DoctorNoteRepository doctorNoteRepository;
    private final ModelMapper modelMapper;
    private final CacheManager cacheManager;

    @Override
    @Cacheable(value = "patientNotes", key = "#patientId + '_' + #pageable.pageNumber + '_' + #pageable.pageSize + '_' + #pageable.sort")
    public Page<DoctorNoteResponse> getPatientNotes(String patientId, Pageable pageable) {
        try {
            log.info("Fetching doctor notes for patient: {}, page: {}", patientId, pageable.getPageNumber());
            return doctorNoteRepository.findByPatientIdOrderByCreatedAtDesc(patientId, pageable)
                    .map(this::mapToResponse);
        } catch (DataAccessException e) {
            log.error("Database error while fetching doctor notes for patient: {}", patientId, e);
            throw new ServiceException("Failed to fetch doctor notes due to database error", e);
        }
    }

    @Override
    @Cacheable(value = "doctorNote", key = "#patientId + '_' + #noteId")
    public DoctorNoteResponse getPatientNote(String patientId, String noteId) {
        try {
            log.info("Fetching doctor note {} for patient: {}", noteId, patientId);
            DoctorNote note = doctorNoteRepository.findByIdAndPatientId(noteId, patientId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            String.format(DOCTOR_NOTE_NOT_FOUND, noteId, patientId)));
            return mapToResponse(note);
        } catch (DataAccessException e) {
            log.error("Database error while fetching doctor note {} for patient: {}", noteId, patientId, e);
            throw new ServiceException("Failed to fetch doctor note due to database error", e);
        }
    }

    @Override
    @Cacheable(value = "patientNotesByType", key = "#patientId + '_' + #noteType + '_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<DoctorNoteResponse> getPatientNotesByType(String patientId, String noteType, Pageable pageable) {
        try {
            log.info("Fetching doctor notes by type {} for patient: {}", noteType, patientId);
            return doctorNoteRepository.findByPatientIdAndNoteTypeOrderByCreatedAtDesc(patientId, noteType, pageable)
                    .map(this::mapToResponse);
        } catch (DataAccessException e) {
            log.error("Database error while fetching doctor notes by type {} for patient: {}", noteType, patientId, e);
            throw new ServiceException("Failed to fetch doctor notes by type due to database error", e);
        }
    }

    @Override
    @Cacheable(value = "patientNotesByPriority", key = "#patientId + '_' + #priority + '_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<DoctorNoteResponse> getPatientNotesByPriority(String patientId, String priority, Pageable pageable) {
        try {
            log.info("Fetching doctor notes by priority {} for patient: {}", priority, patientId);
            return doctorNoteRepository.findByPatientIdAndPriorityOrderByCreatedAtDesc(patientId, priority, pageable)
                    .map(this::mapToResponse);
        } catch (DataAccessException e) {
            log.error("Database error while fetching doctor notes by priority {} for patient: {}", priority, patientId, e);
            throw new ServiceException("Failed to fetch doctor notes by priority due to database error", e);
        }
    }

    @Override
    @Cacheable(value = "patientNotesByCategory", key = "#patientId + '_' + #category + '_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<DoctorNoteResponse> getPatientNotesByCategory(String patientId, String category, Pageable pageable) {
        try {
            log.info("Fetching doctor notes by category {} for patient: {}", category, patientId);
            return doctorNoteRepository.findByPatientIdAndCategoryOrderByCreatedAtDesc(patientId, category, pageable)
                    .map(this::mapToResponse);
        } catch (DataAccessException e) {
            log.error("Database error while fetching doctor notes by category {} for patient: {}", category, patientId, e);
            throw new ServiceException("Failed to fetch doctor notes by category due to database error", e);
        }
    }

    @Override
    @Cacheable(value = "nonPrivateNotes", key = "#patientId + '_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<DoctorNoteResponse> getNonPrivateNotes(String patientId, Pageable pageable) {
        try {
            log.info("Fetching non-private doctor notes for patient: {}", patientId);
            return doctorNoteRepository.findByPatientIdAndIsPrivateFalseOrderByCreatedAtDesc(patientId, pageable)
                    .map(this::mapToResponse);
        } catch (DataAccessException e) {
            log.error("Database error while fetching non-private doctor notes for patient: {}", patientId, e);
            throw new ServiceException("Failed to fetch non-private doctor notes due to database error", e);
        }
    }

    @Override
    @Cacheable(value = "urgentNotes", key = "#patientId + '_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<DoctorNoteResponse> getUrgentNotes(String patientId, Pageable pageable) {
        try {
            log.info("Fetching urgent doctor notes for patient: {}", patientId);
            return doctorNoteRepository.findByPatientIdAndIsUrgentTrueOrderByCreatedAtDesc(patientId, pageable)
                    .map(this::mapToResponse);
        } catch (DataAccessException e) {
            log.error("Database error while fetching urgent doctor notes for patient: {}", patientId, e);
            throw new ServiceException("Failed to fetch urgent doctor notes due to database error", e);
        }
    }

    @Override
    public Page<DoctorNoteResponse> getRecentNotes(String patientId, int days, Pageable pageable) {
        try {
            log.info("Fetching recent doctor notes (last {} days) for patient: {}", days, patientId);
            LocalDateTime cutoffDate = LocalDateTime.now().minusDays(days);
            Page<DoctorNote> notes = doctorNoteRepository.findByPatientIdOrderByCreatedAtDesc(patientId, pageable);

            List<DoctorNote> recentNotes = notes.getContent().stream()
                    .filter(note -> note.getCreatedAt().isAfter(cutoffDate))
                    .toList();

            return new PageImpl<>(recentNotes.stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList()), pageable, recentNotes.size());
        } catch (DataAccessException e) {
            log.error("Database error while fetching recent doctor notes for patient: {}", patientId, e);
            throw new ServiceException("Failed to fetch recent doctor notes due to database error", e);
        }
    }

    @Override
    @Transactional
    @CacheEvict(value = {"patientNotes", "doctorNote", "patientNotesByType", "patientNotesByPriority",
            "patientNotesByCategory", "nonPrivateNotes", "urgentNotes"}, allEntries = true)
    public DoctorNoteResponse createDoctorNote(CreateDoctorNoteRequest request) {
        try {
            log.info("Creating doctor note for patient: {}", request.getPatientId());
            DoctorNote note = modelMapper.map(request, DoctorNote.class);
            note.setCreatedAt(LocalDateTime.now());
            note.setUpdatedAt(LocalDateTime.now());

            DoctorNote savedNote = doctorNoteRepository.save(note);
            return mapToResponse(savedNote);
        } catch (DataAccessException e) {
            log.error("Database error while creating doctor note for patient: {}", request.getPatientId(), e);
            throw new ServiceException("Failed to create doctor note due to database error", e);
        }
    }

    @Override
    @Transactional
    @CacheEvict(value = {"patientNotes", "doctorNote", "patientNotesByType", "patientNotesByPriority",
            "patientNotesByCategory", "nonPrivateNotes", "urgentNotes"}, allEntries = true)
    public DoctorNoteResponse updateDoctorNote(String patientId, String noteId, UpdateDoctorNoteRequest request) {
        try {
            log.info("Updating doctor note {} for patient: {}", noteId, patientId);
            DoctorNote existingNote = doctorNoteRepository.findByIdAndPatientId(noteId, patientId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            String.format(DOCTOR_NOTE_NOT_FOUND, noteId, patientId)));

            modelMapper.map(request, existingNote);
            existingNote.setUpdatedAt(LocalDateTime.now());

            DoctorNote updatedNote = doctorNoteRepository.save(existingNote);
            return mapToResponse(updatedNote);
        } catch (DataAccessException e) {
            log.error("Database error while updating doctor note {} for patient: {}", noteId, patientId, e);
            throw new ServiceException("Failed to update doctor note due to database error", e);
        }
    }

    @Override
    @Transactional
    @CacheEvict(value = {"patientNotes", "doctorNote", "patientNotesByType", "patientNotesByPriority",
            "patientNotesByCategory", "nonPrivateNotes", "urgentNotes"}, allEntries = true)
    public void deleteDoctorNote(String patientId, String noteId) {
        try {
            log.info("Deleting doctor note {} for patient: {}", noteId, patientId);
            DoctorNote note = doctorNoteRepository.findByIdAndPatientId(noteId, patientId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            String.format(DOCTOR_NOTE_NOT_FOUND, noteId, patientId)));

            doctorNoteRepository.delete(note);
        } catch (DataAccessException e) {
            log.error("Database error while deleting doctor note {} for patient: {}", noteId, patientId, e);
            throw new ServiceException("Failed to delete doctor note due to database error", e);
        }
    }

    private DoctorNoteResponse mapToResponse(DoctorNote doctorNote) {
        try {
            DoctorNoteResponse response = modelMapper.map(doctorNote, DoctorNoteResponse.class);

            if (response.getNoteType() == null) response.setNoteType("General");
            if (response.getPriority() == null) response.setPriority("Normal");
            if (response.getCategory() == null) response.setCategory("General");
            if (response.getTitle() == null) response.setTitle("Doctor Note");
            if (response.getContent() == null) response.setContent("");
            if (response.getDoctorName() == null) response.setDoctorName("Unknown Doctor");

            response.setFormattedCreatedAt(formatDateTime(doctorNote.getCreatedAt()));
            response.setCategoryBadgeColor(getCategoryBadgeColor(response.getCategory()));
            response.setNoteTypeBadgeColor(getNoteTypeBadgeColor(response.getNoteType()));
            response.setRecent(isRecent(doctorNote.getCreatedAt()));
            response.setTimeAgo(getTimeAgo(doctorNote.getCreatedAt()));

            return response;
        } catch (Exception e) {
            log.error("Error mapping doctor note to response for note ID: {}", doctorNote.getId(), e);
            throw new ServiceException("Failed to map doctor note to response", e);
        }
    }

    private String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) return "";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' hh:mm a");
        return dateTime.format(formatter);
    }

    private String getCategoryBadgeColor(String category) {
        if (category == null) return "gray";
        return switch (category.toLowerCase()) {
            case "diagnosis" -> "blue";
            case "treatment" -> "green";
            case "prescription" -> "purple";
            case "follow-up" -> "orange";
            case "urgent" -> "red";
            case "lab-results" -> "cyan";
            case "consultation" -> "indigo";
            default -> "gray";
        };
    }

    private String getNoteTypeBadgeColor(String noteType) {
        if (noteType == null) return "gray";
        return switch (noteType.toLowerCase()) {
            case "consultation" -> "blue";
            case "examination" -> "green";
            case "lab-review" -> "purple";
            case "follow-up" -> "orange";
            case "emergency" -> "red";
            case "routine" -> "teal";
            default -> "gray";
        };
    }

    private boolean isRecent(LocalDateTime createdAt) {
        if (createdAt == null) return false;
        return createdAt.isAfter(LocalDateTime.now().minusDays(RECENT_DAYS_THRESHOLD));
    }

    private String getTimeAgo(LocalDateTime createdAt) {
        if (createdAt == null) return "";

        Duration duration = Duration.between(createdAt, LocalDateTime.now());
        long days = duration.toDays();
        long hours = duration.toHours();
        long minutes = duration.toMinutes();

        if (minutes < 1) return "Just now";
        if (minutes < 60) return minutes + " minute" + (minutes > 1 ? "s" : "") + " ago";
        if (hours < 24) return hours + " hour" + (hours > 1 ? "s" : "") + " ago";
        if (days == 1) return "Yesterday";
        if (days < 7) return days + " days ago";
        if (days < 30) return (days / 7) + " week" + ((days / 7) > 1 ? "s" : "") + " ago";
        if (days < 365) return (days / 30) + " month" + ((days / 30) > 1 ? "s" : "") + " ago";
        return (days / 365) + " year" + ((days / 365) > 1 ? "s" : "") + " ago";
    }

    public void clearPatientNotesCache(String patientId) {
        Objects.requireNonNull(cacheManager.getCache("patientNotes")).evict(patientId);
        Objects.requireNonNull(cacheManager.getCache("doctorNote")).clear();
        Objects.requireNonNull(cacheManager.getCache("patientNotesByType")).clear();
        Objects.requireNonNull(cacheManager.getCache("patientNotesByPriority")).clear();
        Objects.requireNonNull(cacheManager.getCache("patientNotesByCategory")).clear();
        Objects.requireNonNull(cacheManager.getCache("nonPrivateNotes")).clear();
        Objects.requireNonNull(cacheManager.getCache("urgentNotes")).clear();
    }
}
