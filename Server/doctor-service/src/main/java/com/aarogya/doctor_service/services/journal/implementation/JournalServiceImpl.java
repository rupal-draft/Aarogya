package com.aarogya.doctor_service.services.journal.implementation;

import com.aarogya.doctor_service.clients.UserGrpcClient;
import com.aarogya.doctor_service.dto.grpc.PatientResponseDTO;
import com.aarogya.doctor_service.dto.journal.request.*;
import com.aarogya.doctor_service.dto.journal.response.*;
import com.aarogya.doctor_service.enums.journal.EntryType;
import com.aarogya.doctor_service.enums.journal.Priority;
import com.aarogya.doctor_service.exceptions.BadRequestException;
import com.aarogya.doctor_service.exceptions.ResourceNotFoundException;
import com.aarogya.doctor_service.models.journal.*;
import com.aarogya.doctor_service.repositories.journal.*;
import com.aarogya.doctor_service.services.journal.JournalService;
import com.aarogya.doctor_service.utility.EncryptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class JournalServiceImpl implements JournalService {

    private final JournalEntryRepository entryRepository;
    private final JournalEntryVersionRepository versionRepository;
    private final JournalBookmarkRepository bookmarkRepository;
    private final JournalReminderRepository reminderRepository;
    private final JournalTemplateRepository templateRepository;
    private final JournalAnalyticsRepository analyticsRepository;
    private final ModelMapper modelMapper;
    private final UserGrpcClient userGrpcClient;
    private final EncryptionService encryptionService;
    private final MongoTemplate mongoTemplate;

    private static final String JOURNAL_CACHE = "journalEntries";
    private static final String STATS_CACHE = "journalStats";

    @Override
    public JournalEntryResponse createEntry(CreateJournalEntryRequest request) {
        return null;
    }

    @Override
    public JournalEntryResponse getEntry(String entryId) {
        return null;
    }

    @Override
    public Page<JournalEntrySummaryResponse> getEntries(JournalFilterRequest filter, Pageable pageable) {
        return null;
    }

    @Override
    public JournalEntryResponse updateEntry(String entryId, UpdateJournalEntryRequest request) {
        return null;
    }

    @Override
    public void deleteEntry(String entryId) {

    }

    @Override
    public void restoreEntry(String entryId) {

    }

    @Override
    public JournalEntryResponse bookmarkEntry(BookmarkEntryRequest request) {
        return null;
    }

    @Override
    public JournalEntryResponse pinEntry(PinEntryRequest request) {
        return null;
    }

    @Override
    public List<EntryVersionResponse> getEntryVersions(String entryId) {
        return List.of();
    }

    @Override
    public JournalEntryResponse revertToVersion(String entryId, Integer version) {
        return null;
    }

    @Override
    public ReminderResponse createReminder(CreateReminderRequest request) {
        return null;
    }

    @Override
    public List<ReminderResponse> getUpcomingReminders() {
        return List.of();
    }

    @Override
    public void deleteReminder(String reminderId) {

    }

    @Override
    public TemplateResponse createTemplate(CreateTemplateRequest request) {
        return null;
    }

    @Override
    public List<TemplateResponse> getTemplates() {
        return List.of();
    }

    @Override
    public JournalEntryResponse createFromTemplate(String templateId, Map<String, String> variables) {
        return null;
    }

    @Override
    public JournalStatsResponse getJournalStats() {
        return null;
    }

    @Override
    public List<JournalEntrySummaryResponse> getRecentEntries(int limit) {
        return List.of();
    }

    @Override
    public SearchSuggestionResponse getSearchSuggestions() {
        return null;
    }

    @Override
    public String exportEntries(ExportRequest request) {
        return "";
    }

    @Override
    public void processScheduledReminders() {

    }

    private void validateEntryRequest(CreateJournalEntryRequest request) {
        if (request.getEncryptionKey() != null && request.getEncryptionKey().length() < 8) {
            throw new BadRequestException("Encryption key must be at least 8 characters long");
        }
    }

    private void validateTemplateRequest(CreateTemplateRequest request) {
        if (request.getTitleTemplate() == null || request.getTitleTemplate().trim().isEmpty()) {
            throw new BadRequestException("Title template is required");
        }
        if (request.getContentTemplate() == null || request.getContentTemplate().trim().isEmpty()) {
            throw new BadRequestException("Content template is required");
        }
    }

    private void validateEntryAccess(JournalEntry entry, String doctorId) {
        if (!entry.getDoctorId().equals(doctorId)) {
            throw new BadRequestException("Access denied to this journal entry");
        }
        if (Boolean.FALSE.equals(entry.getIsActive())) {
            throw new ResourceNotFoundException("Journal entry not found");
        }
    }

    private String getPatientName(String patientId) {
        PatientResponseDTO patientResponseDTO = userGrpcClient.getPatient(patientId);
        log.debug("Fetching patient name for ID: {}", patientId);
        return patientResponseDTO.getFirstName() + patientResponseDTO.getLastName();
    }

    private JournalEntry buildJournalEntry(CreateJournalEntryRequest request, String doctorId,
                                           String patientName, String content,
                                           boolean isEncrypted, String encryptionKeyHash) {

        int wordCount = countWords(content);

        return JournalEntry.builder()
                .doctorId(doctorId)
                .patientId(request.getPatientId())
                .patientName(patientName)
                .title(request.getTitle())
                .content(content)
                .tags(request.getTags() != null ? request.getTags() : new ArrayList<>())
                .type(request.getType() != null ? EntryType.valueOf(request.getType().toUpperCase()) : EntryType.NOTE)
                .priority(request.getPriority() != null ? Priority.valueOf(request.getPriority().toUpperCase()) : Priority.NORMAL)
                .isBookmarked(false)
                .isPinned(false)
                .isActive(true)
                .isEncrypted(isEncrypted)
                .encryptionKeyHash(encryptionKeyHash)
                .wordCount(wordCount)
                .version(1)
                .parentEntryId(request.getParentEntryId())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .reminderDate(request.getReminderDate())
                .build();
    }

    private JournalTemplate buildJournalTemplate(CreateTemplateRequest request, String doctorId) {
        return JournalTemplate.builder()
                .doctorId(doctorId)
                .name(request.getName())
                .description(request.getDescription())
                .titleTemplate(request.getTitleTemplate())
                .contentTemplate(request.getContentTemplate())
                .defaultTags(request.getDefaultTags())
                .defaultType(request.getDefaultType() != null ? EntryType.valueOf(request.getDefaultType().toUpperCase()) : EntryType.NOTE)
                .isActive(true)
                .isSystem(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    private void saveEntryVersion(JournalEntry entry, String changeSummary, int version) {
        JournalEntryVersion entryVersion = JournalEntryVersion.builder()
                .entryId(entry.getId())
                .doctorId(entry.getDoctorId())
                .title(entry.getTitle())
                .content(entry.getContent())
                .tags(entry.getTags())
                .version(version)
                .changeSummary(changeSummary)
                .createdAt(LocalDateTime.now())
                .build();

        versionRepository.save(entryVersion);
    }

    private void updateEntryFields(JournalEntry entry, UpdateJournalEntryRequest request,
                                   String patientName, int newVersion) {

        if (request.getTitle() != null) {
            entry.setTitle(request.getTitle());
        }
        if (request.getContent() != null) {
            entry.setContent(request.getContent());
            entry.setWordCount(countWords(request.getContent()));
        }
        if (request.getPatientId() != null) {
            entry.setPatientId(request.getPatientId());
            entry.setPatientName(patientName);
        }
        if (request.getTags() != null) {
            entry.setTags(request.getTags());
        }
        if (request.getType() != null) {
            entry.setType(EntryType.valueOf(request.getType().toUpperCase()));
        }
        if (request.getPriority() != null) {
            entry.setPriority(Priority.valueOf(request.getPriority().toUpperCase()));
        }
        if (request.getIsBookmarked() != null) {
            entry.setIsBookmarked(request.getIsBookmarked());
        }
        if (request.getIsPinned() != null) {
            entry.setIsPinned(request.getIsPinned());
        }
        if (request.getReminderDate() != null) {
            entry.setReminderDate(request.getReminderDate());
        }

        entry.setVersion(newVersion);
        entry.setUpdatedAt(LocalDateTime.now());
    }

    private int countWords(String text) {
        if (text == null || text.trim().isEmpty()) {
            return 0;
        }
        return text.trim().split("\\s+").length;
    }

    private String applyTemplateVariables(String template, Map<String, String> variables) {
        String result = template;
        for (Map.Entry<String, String> entry : variables.entrySet()) {
            result = result.replace("{{" + entry.getKey() + "}}", entry.getValue());
        }
        return result;
    }

    private Page<JournalEntry> applyJournalFilters(String doctorId, JournalFilterRequest filter, Pageable pageable) {
        if (filter == null) {
            return entryRepository.findByDoctorIdAndIsActiveTrue(doctorId, pageable);
        }

        if (filter.getSearchQuery() != null && !filter.getSearchQuery().isBlank()) {
            return entryRepository.search(doctorId, filter.getSearchQuery(), pageable);
        }

        Query query = new Query();

        query.addCriteria(Criteria.where("doctorId").is(doctorId));

        if (filter.getPatientId() != null) {
            query.addCriteria(Criteria.where("patientId").is(filter.getPatientId()));
        }

        if (filter.getTags() != null && !filter.getTags().isEmpty()) {
            query.addCriteria(Criteria.where("tags").in(filter.getTags()));
        }

        if (filter.getTypes() != null && !filter.getTypes().isEmpty()) {
            query.addCriteria(Criteria.where("type").in(filter.getTypes()));
        }

        if (filter.getPriorities() != null && !filter.getPriorities().isEmpty()) {
            query.addCriteria(Criteria.where("priority").in(filter.getPriorities()));
        }

        if (filter.getBookmarked() != null) {
            query.addCriteria(Criteria.where("isBookmarked").is(filter.getBookmarked()));
        }

        if (filter.getPinned() != null) {
            query.addCriteria(Criteria.where("isPinned").is(filter.getPinned()));
        }

        if (filter.getHasReminder() != null) {
            if (filter.getHasReminder()) {
                query.addCriteria(Criteria.where("reminder").ne(null));
            } else {
                query.addCriteria(Criteria.where("reminder").is(null));
            }
        }

        if (filter.getStartDate() != null && filter.getEndDate() != null) {
            query.addCriteria(Criteria.where("createdAt")
                    .gte(filter.getStartDate())
                    .lte(filter.getEndDate()));
        } else if (filter.getStartDate() != null) {
            query.addCriteria(Criteria.where("createdAt").gte(filter.getStartDate()));
        } else if (filter.getEndDate() != null) {
            query.addCriteria(Criteria.where("createdAt").lte(filter.getEndDate()));
        }

        if (filter.getIncludeInactive() == null || !filter.getIncludeInactive()) {
            query.addCriteria(Criteria.where("isActive").is(true));
        }

        if (filter.getSortBy() != null) {
            Sort.Direction direction = (filter.getSortOrder() != null && filter.getSortOrder().equalsIgnoreCase("desc"))
                    ? Sort.Direction.DESC : Sort.Direction.ASC;
            query.with(Sort.by(direction, filter.getSortBy()));
        } else {
            query.with(Sort.by(Sort.Direction.DESC, "updatedAt"));
        }

        query.with(pageable);

        List<JournalEntry> entries = mongoTemplate.find(query, JournalEntry.class);
        long total = mongoTemplate.count(Query.of(query).limit(-1).skip(-1), JournalEntry.class);

        return new PageImpl<>(entries, pageable, total);
    }


    private void updateAnalytics(String doctorId, int entriesCreated, int entriesUpdated, int wordsAdded) {
        LocalDateTime today = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);

        JournalAnalytics analytics = analyticsRepository.findByDoctorIdAndDate(doctorId, today)
                .orElse(JournalAnalytics.builder()
                        .doctorId(doctorId)
                        .date(today)
                        .entriesCreated(0)
                        .entriesUpdated(0)
                        .totalWords(0)
                        .patientNotes(0)
                        .personalNotes(0)
                        .tagUsage(new HashMap<>())
                        .createdAt(LocalDateTime.now())
                        .build());

        analytics.setEntriesCreated(analytics.getEntriesCreated() + entriesCreated);
        analytics.setEntriesUpdated(analytics.getEntriesUpdated() + entriesUpdated);
        analytics.setTotalWords(analytics.getTotalWords() + wordsAdded);

        analyticsRepository.save(analytics);
    }

    private Map<String, Integer> calculateTagStatistics(String doctorId) {
        return entryRepository.findByDoctorIdAndIsActiveTrue(doctorId, Pageable.unpaged())
                .getContent()
                .stream()
                .flatMap(entry -> entry.getTags().stream())
                .collect(Collectors.groupingBy(
                        tag -> tag,
                        Collectors.summingInt(tag -> 1)
                ));
    }

    private Map<String, Integer> calculateTypeStatistics(String doctorId) {
        return entryRepository.findByDoctorIdAndIsActiveTrue(doctorId, Pageable.unpaged())
                .getContent()
                .stream()
                .collect(Collectors.groupingBy(
                        entry -> entry.getType().name(),
                        Collectors.summingInt(entry -> 1)
                ));
    }

    private JournalEntryResponse convertToEntryResponse(JournalEntry entry, String doctorId) {
        JournalEntryResponse response = modelMapper.map(entry, JournalEntryResponse.class);

        response.setHasReminder(entry.getReminderDate() != null);
        response.setVersionHistory(getVersionHistory(entry.getId()));

        return response;
    }

    private JournalEntrySummaryResponse convertToEntrySummaryResponse(JournalEntry entry, String doctorId) {
        JournalEntrySummaryResponse response = modelMapper.map(entry, JournalEntrySummaryResponse.class);

        if (entry.getContent().length() > 150) {
            response.setContentPreview(entry.getContent().substring(0, 150) + "...");
        } else {
            response.setContentPreview(entry.getContent());
        }

        response.setHasReminder(entry.getReminderDate() != null);

        return response;
    }

    private EntryVersionResponse convertToVersionResponse(JournalEntryVersion version) {
        EntryVersionResponse response = modelMapper.map(version, EntryVersionResponse.class);

        if (version.getContent().length() > 100) {
            response.setContentPreview(version.getContent().substring(0, 100) + "...");
        } else {
            response.setContentPreview(version.getContent());
        }

        return response;
    }

    private ReminderResponse convertToReminderResponse(JournalReminder reminder) {
        return modelMapper.map(reminder, ReminderResponse.class);
    }

    private TemplateResponse convertToTemplateResponse(JournalTemplate template) {
        return modelMapper.map(template, TemplateResponse.class);
    }

    private List<EntryVersionResponse> getVersionHistory(String entryId) {
        List<JournalEntryVersion> versions = versionRepository.findByEntryIdOrderByVersionDesc(entryId);
        return versions.stream()
                .map(this::convertToVersionResponse)
                .collect(Collectors.toList());
    }
}
