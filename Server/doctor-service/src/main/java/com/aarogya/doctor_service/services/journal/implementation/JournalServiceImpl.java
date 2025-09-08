package com.aarogya.doctor_service.services.journal.implementation;

import com.aarogya.doctor_service.auth.UserContextHolder;
import com.aarogya.doctor_service.clients.UserGrpcClient;
import com.aarogya.doctor_service.dto.grpc.auth.PatientResponseDTO;
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
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
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
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = JOURNAL_CACHE, allEntries = true),
            @CacheEvict(value = STATS_CACHE, allEntries = true)
    })
    public JournalEntryResponse createEntry(CreateJournalEntryRequest request) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Creating journal entry for doctor: {}", doctorId);

        validateEntryRequest(request);

        String patientName = null;
        if (request.getPatientId() != null) {
            patientName = getPatientName(request.getPatientId());
        }

        boolean isEncrypted = Boolean.TRUE.equals(request.getIsEncrypted());
        String encryptedContent = request.getContent();
        String encryptionKeyHash = null;

        if (isEncrypted && request.getEncryptionKey() != null) {
            encryptedContent = encryptionService.encrypt(request.getContent(), request.getEncryptionKey());
            encryptionKeyHash = encryptionService.hashKey(request.getEncryptionKey());
        }

        JournalEntry entry = buildJournalEntry(request, doctorId, patientName, encryptedContent,
                isEncrypted, encryptionKeyHash);

        JournalEntry savedEntry = entryRepository.save(entry);

        saveEntryVersion(savedEntry, "Initial version", 1);

        updateAnalytics(doctorId, 1, 0, savedEntry.getWordCount());

        log.info("Journal entry created successfully with ID: {}", savedEntry.getId());
        return convertToEntryResponse(savedEntry, doctorId);
    }

    @Override
    @Cacheable(
            value = JOURNAL_CACHE,
            key = "'decrypted_' + #request.entryId + '_' + T(java.util.Objects).hash(#request.encryptionKey)"
    )
    public JournalEntryResponse getDecryptedEntry(DecryptRequest request) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.debug("Fetching encrypted journal entry: {}", request.getEntryId());

        JournalEntry entry = entryRepository.findById(request.getEntryId())
                .orElseThrow(() -> new ResourceNotFoundException("Journal entry not found with id: " + request.getEntryId()));

        validateEntryAccess(entry, doctorId);

        if (!Boolean.TRUE.equals(entry.getIsEncrypted())) {
            return convertToEntryResponse(entry, doctorId);
        }

        String providedHash = encryptionService.hashKey(request.getEncryptionKey());
        if (!providedHash.equals(entry.getEncryptionKeyHash())) {
            throw new BadRequestException("Invalid encryption key");
        }

        String decryptedContent = encryptionService.decrypt(entry.getContent(), request.getEncryptionKey());
        entry.setContent(decryptedContent);

        return convertToEntryResponse(entry, doctorId);
    }

    @Override
    @Cacheable(value = JOURNAL_CACHE, key = "#filter.toString() + '_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<JournalEntrySummaryResponse> getEntries(JournalFilterRequest filter, Pageable pageable) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.debug("Fetching journal entries with filter: {}", filter);

        Page<JournalEntry> entriesPage = applyJournalFilters(doctorId, filter, pageable);

        return entriesPage.map(entry -> convertToEntrySummaryResponse(entry, doctorId));
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = JOURNAL_CACHE, key = "#entryId"),
            @CacheEvict(value = JOURNAL_CACHE, allEntries = true),
            @CacheEvict(value = STATS_CACHE, allEntries = true)
    })
    public JournalEntryResponse updateEntry(String entryId, UpdateJournalEntryRequest request) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Updating journal entry: {}", entryId);

        JournalEntry entry = entryRepository.findById(entryId)
                .orElseThrow(() -> new ResourceNotFoundException("Journal entry not found with id: " + entryId));

        validateEntryAccess(entry, doctorId);

        String patientName = entry.getPatientName();
        if (request.getPatientId() != null && !request.getPatientId().equals(entry.getPatientId())) {
            patientName = getPatientName(request.getPatientId());
        }

        int newVersion = entry.getVersion() + 1;
        saveEntryVersion(entry, request.getChangeSummary(), newVersion);

        updateEntryFields(entry, request, patientName, newVersion);
        JournalEntry updatedEntry = entryRepository.save(entry);

        updateAnalytics(doctorId, 0, 1, 0);

        log.info("Journal entry updated successfully: {}", entryId);
        return convertToEntryResponse(updatedEntry, doctorId);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = JOURNAL_CACHE, key = "#entryId"),
            @CacheEvict(value = JOURNAL_CACHE, allEntries = true),
            @CacheEvict(value = STATS_CACHE, allEntries = true)
    })
    public void deleteEntry(String entryId) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Deleting journal entry: {}", entryId);

        JournalEntry entry = entryRepository.findById(entryId)
                .orElseThrow(() -> new ResourceNotFoundException("Journal entry not found with id: " + entryId));

        validateEntryAccess(entry, doctorId);

        entry.setIsActive(false);
        entryRepository.save(entry);

        bookmarkRepository.deleteByDoctorIdAndEntryId(doctorId, entryId);
        reminderRepository.deleteByDoctorIdAndEntryId(doctorId, entryId);

        log.info("Journal entry deleted successfully: {}", entryId);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = JOURNAL_CACHE, key = "#entryId"),
            @CacheEvict(value = JOURNAL_CACHE, allEntries = true),
            @CacheEvict(value = STATS_CACHE, allEntries = true)
    })
    public void restoreEntry(String entryId) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Restoring journal entry: {}", entryId);

        JournalEntry entry = entryRepository.findById(entryId)
                .orElseThrow(() -> new ResourceNotFoundException("Journal entry not found with id: " + entryId));

        validateEntryAccess(entry, doctorId);

        entry.setIsActive(true);
        entryRepository.save(entry);

        log.info("Journal entry restored successfully: {}", entryId);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = JOURNAL_CACHE, key = "#request.entryId")
    })
    public JournalEntryResponse bookmarkEntry(BookmarkEntryRequest request) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Updating bookmark for entry: {}", request.getEntryId());

        JournalEntry entry = entryRepository.findById(request.getEntryId())
                .orElseThrow(() -> new ResourceNotFoundException("Journal entry not found with id: " + request.getEntryId()));

        validateEntryAccess(entry, doctorId);

        if (Boolean.TRUE.equals(request.getIsBookmarked())) {
            if (!bookmarkRepository.existsByDoctorIdAndEntryId(doctorId, request.getEntryId())) {
                JournalBookmark bookmark = JournalBookmark.builder()
                        .doctorId(doctorId)
                        .entryId(request.getEntryId())
                        .bookmarkedAt(LocalDateTime.now())
                        .build();
                bookmarkRepository.save(bookmark);
            }
        } else {
            bookmarkRepository.deleteByDoctorIdAndEntryId(doctorId, request.getEntryId());
        }

        entry.setIsBookmarked(request.getIsBookmarked());
        JournalEntry updatedEntry = entryRepository.save(entry);

        return convertToEntryResponse(updatedEntry, doctorId);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = JOURNAL_CACHE, key = "#request.entryId")
    })
    public JournalEntryResponse pinEntry(PinEntryRequest request) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Updating pin for entry: {}", request.getEntryId());

        JournalEntry entry = entryRepository.findById(request.getEntryId())
                .orElseThrow(() -> new ResourceNotFoundException("Journal entry not found with id: " + request.getEntryId()));

        validateEntryAccess(entry, doctorId);

        entry.setIsPinned(request.getIsPinned());
        JournalEntry updatedEntry = entryRepository.save(entry);

        return convertToEntryResponse(updatedEntry, doctorId);
    }

    @Override
    public List<EntryVersionResponse> getEntryVersions(String entryId) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.debug("Fetching versions for entry: {}", entryId);

        JournalEntry entry = entryRepository.findById(entryId)
                .orElseThrow(() -> new ResourceNotFoundException("Journal entry not found with id: " + entryId));

        validateEntryAccess(entry, doctorId);

        List<JournalEntryVersion> versions = versionRepository.findByEntryIdOrderByVersionDesc(entryId);

        return versions.stream()
                .map(this::convertToVersionResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = JOURNAL_CACHE, key = "#entryId"),
            @CacheEvict(value = JOURNAL_CACHE, allEntries = true)
    })
    public JournalEntryResponse revertToVersion(String entryId, Integer version) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Reverting entry {} to version {}", entryId, version);

        JournalEntry entry = entryRepository.findById(entryId)
                .orElseThrow(() -> new ResourceNotFoundException("Journal entry not found with id: " + entryId));

        validateEntryAccess(entry, doctorId);

        JournalEntryVersion targetVersion = versionRepository.findByEntryIdAndVersion(entryId, version)
                .orElseThrow(() -> new ResourceNotFoundException("Version not found"));

        int newVersion = entry.getVersion() + 1;
        saveEntryVersion(entry, "Reverted to version " + version, newVersion);

        entry.setTitle(targetVersion.getTitle());
        entry.setContent(targetVersion.getContent());
        entry.setTags(targetVersion.getTags());
        entry.setVersion(newVersion);
        entry.setUpdatedAt(LocalDateTime.now());

        JournalEntry revertedEntry = entryRepository.save(entry);

        log.info("Entry reverted successfully to version: {}", version);
        return convertToEntryResponse(revertedEntry, doctorId);
    }

    @Override
    @Transactional
    public ReminderResponse createReminder(CreateReminderRequest request) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Creating reminder for entry: {}", request.getEntryId());

        JournalEntry entry = entryRepository.findById(request.getEntryId())
                .orElseThrow(() -> new ResourceNotFoundException("Journal entry not found with id: " + request.getEntryId()));

        validateEntryAccess(entry, doctorId);

        reminderRepository.deleteByDoctorIdAndEntryId(doctorId, request.getEntryId());

        JournalReminder reminder = JournalReminder.builder()
                .doctorId(doctorId)
                .entryId(request.getEntryId())
                .title(request.getTitle())
                .reminderDate(request.getReminderDate())
                .notes(request.getNotes())
                .isActive(true)
                .isRecurring(Boolean.TRUE.equals(request.getIsRecurring()))
                .recurrencePattern(request.getRecurrencePattern())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        JournalReminder savedReminder = reminderRepository.save(reminder);

        entry.setReminderDate(request.getReminderDate());
        entryRepository.save(entry);

        return convertToReminderResponse(savedReminder);
    }

    @Override
    public List<ReminderResponse> getUpcomingReminders() {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.debug("Fetching upcoming reminders for doctor: {}", doctorId);

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime tomorrow = now.plusDays(1);

        List<JournalReminder> reminders = reminderRepository.findByDoctorIdAndReminderDateBetweenAndIsActiveTrue(
                doctorId, now, tomorrow);

        return reminders.stream()
                .map(this::convertToReminderResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteReminder(String reminderId) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Deleting reminder: {}", reminderId);

        JournalReminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder not found with id: " + reminderId));

        if (!reminder.getDoctorId().equals(doctorId)) {
            throw new BadRequestException("Cannot delete another doctor's reminder");
        }

        entryRepository.findById(reminder.getEntryId()).ifPresent(entry -> {
            entry.setReminderDate(null);
            entryRepository.save(entry);
        });

        reminderRepository.delete(reminder);
    }

    @Override
    @Transactional
    public TemplateResponse createTemplate(CreateTemplateRequest request) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Creating journal template for doctor: {}", doctorId);

        validateTemplateRequest(request);

        if (templateRepository.findByDoctorIdAndNameAndIsActiveTrue(doctorId, request.getName()).isPresent()) {
            throw new BadRequestException("Template with this name already exists");
        }

        JournalTemplate template = buildJournalTemplate(request, doctorId);
        JournalTemplate savedTemplate = templateRepository.save(template);

        return convertToTemplateResponse(savedTemplate);
    }

    @Override
    public List<TemplateResponse> getTemplates() {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.debug("Fetching templates for doctor: {}", doctorId);

        List<JournalTemplate> templates = templateRepository.findByDoctorIdOrIsSystemTrueAndIsActiveTrue(doctorId);

        return templates.stream()
                .map(this::convertToTemplateResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public JournalEntryResponse createFromTemplate(String templateId, Map<String, String> variables) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Creating entry from template: {}", templateId);

        JournalTemplate template = templateRepository.findById(templateId)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found with id: " + templateId));

        if (!template.getDoctorId().equals(doctorId) && !Boolean.TRUE.equals(template.getIsSystem())) {
            throw new BadRequestException("Cannot access another doctor's template");
        }

        String title = applyTemplateVariables(template.getTitleTemplate(), variables);
        String content = applyTemplateVariables(template.getContentTemplate(), variables);

        CreateJournalEntryRequest request = CreateJournalEntryRequest.builder()
                .title(title)
                .content(content)
                .tags(template.getDefaultTags())
                .type(template.getDefaultType() != null ? template.getDefaultType().name() : null)
                .build();

        return createEntry(request);
    }

    @Override
    @Cacheable(value = STATS_CACHE, key = "'stats'")
    public JournalStatsResponse getJournalStats() {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.debug("Fetching journal statistics for doctor: {}", doctorId);

        Integer totalEntries = entryRepository.countByDoctorIdAndIsActiveTrue(doctorId);
        Integer patientNotes = entryRepository.countByDoctorIdAndPatientIdNotNullAndIsActiveTrue(doctorId);
        Integer bookmarked = entryRepository.countByDoctorIdAndIsBookmarkedTrueAndIsActiveTrue(doctorId);
        Integer pinned = entryRepository.countByDoctorIdAndIsPinnedTrueAndIsActiveTrue(doctorId);

        Integer totalWords = entryRepository.findByDoctorIdAndIsActiveTrue(doctorId, Pageable.unpaged())
                .getContent()
                .stream()
                .mapToInt(JournalEntry::getWordCount)
                .sum();

        Map<String, Integer> tagStats = calculateTagStatistics(doctorId);

        Map<String, Integer> typeStats = calculateTypeStatistics(doctorId);

        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        int entriesThisWeek = entryRepository.findByDoctorIdAndIsActiveTrue(doctorId, Pageable.unpaged())
                .getContent()
                .stream()
                .filter(entry -> entry.getCreatedAt().isAfter(oneWeekAgo))
                .mapToInt(entry -> 1)
                .sum();

        Optional<JournalEntry> lastEntry = entryRepository.findByDoctorIdAndIsActiveTrue(doctorId, PageRequest.of(0, 1))
                .getContent()
                .stream()
                .findFirst();

        return JournalStatsResponse.builder()
                .totalEntries(totalEntries)
                .activeEntries(totalEntries)
                .bookmarkedEntries(bookmarked)
                .pinnedEntries(pinned)
                .totalWords(totalWords)
                .patientNotes(patientNotes)
                .personalNotes(totalEntries - patientNotes)
                .tagStatistics(tagStats)
                .typeStatistics(typeStats)
                .lastEntryDate(lastEntry.map(JournalEntry::getCreatedAt).orElse(null))
                .entriesThisWeek(entriesThisWeek)
                .entriesThisMonth(entriesThisWeek * 4)
                .build();
    }

    @Override
    public List<JournalEntrySummaryResponse> getRecentEntries(int limit) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.debug("Fetching recent journal entries for doctor: {}", doctorId);

        Page<JournalEntry> entries = entryRepository.findByDoctorIdAndIsActiveTrue(
                doctorId, PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "updatedAt")));

        return entries.getContent()
                .stream()
                .map(entry -> convertToEntrySummaryResponse(entry, doctorId))
                .collect(Collectors.toList());
    }

    @Override
    public SearchSuggestionResponse getSearchSuggestions() {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.debug("Fetching search suggestions for doctor: {}", doctorId);

        List<String> tags = entryRepository.findTagsByDoctorId(doctorId)
                .stream()
                .flatMap(entry -> entry.getTags().stream())
                .distinct()
                .sorted()
                .collect(Collectors.toList());

        List<String> patients = new ArrayList<>();

        List<String> titles = entryRepository.findByDoctorIdAndIsActiveTrue(doctorId, PageRequest.of(0, 10))
                .getContent()
                .stream()
                .map(JournalEntry::getTitle)
                .collect(Collectors.toList());

        return SearchSuggestionResponse.builder()
                .tagSuggestions(tags)
                .patientSuggestions(patients)
                .titleSuggestions(titles)
                .build();
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
