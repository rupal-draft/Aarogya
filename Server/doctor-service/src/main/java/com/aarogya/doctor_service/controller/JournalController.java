package com.aarogya.doctor_service.controller;

import com.aarogya.doctor_service.dto.journal.request.*;
import com.aarogya.doctor_service.dto.journal.response.*;
import com.aarogya.doctor_service.services.journal.JournalService;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/journal")
@Slf4j
@RequiredArgsConstructor
@Validated
public class JournalController {

    private final JournalService journalService;

    // Entry endpoints
    @PostMapping("/entries")
    @CircuitBreaker(name = "journalController", fallbackMethod = "createEntryFallback")
    @RateLimiter(name = "journalController")
    public ResponseEntity<JournalEntryResponse> createEntry(@Valid @RequestBody CreateJournalEntryRequest request) {
        log.info("Creating new journal entry");
        JournalEntryResponse response = journalService.createEntry(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/entries/{entryId}")
    public ResponseEntity<JournalEntryResponse> getEntry(@RequestBody DecryptRequest decryptRequest) {
        log.debug("Fetching journal entry: {}", decryptRequest.getEntryId());
        JournalEntryResponse response = journalService.getDecryptedEntry(decryptRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/entries")
    public ResponseEntity<Page<JournalEntrySummaryResponse>> getEntries(
            @ModelAttribute JournalFilterRequest filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "updatedAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortOrder) {

        log.debug("Fetching journal entries with filter: {}", filter);
        Sort sort = sortOrder.equalsIgnoreCase("ASC") ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<JournalEntrySummaryResponse> response = journalService.getEntries(filter, pageable);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/entries/{entryId}")
    @CircuitBreaker(name = "journalController", fallbackMethod = "updateEntryFallback")
    public ResponseEntity<JournalEntryResponse> updateEntry(
            @PathVariable String entryId,
            @Valid @RequestBody UpdateJournalEntryRequest request) {
        log.info("Updating journal entry: {}", entryId);
        JournalEntryResponse response = journalService.updateEntry(entryId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/entries/{entryId}")
    public ResponseEntity<Void> deleteEntry(@PathVariable String entryId) {
        log.info("Deleting journal entry: {}", entryId);
        journalService.deleteEntry(entryId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/entries/{entryId}/restore")
    public ResponseEntity<Void> restoreEntry(@PathVariable String entryId) {
        log.info("Restoring journal entry: {}", entryId);
        journalService.restoreEntry(entryId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/entries/bookmark")
    public ResponseEntity<JournalEntryResponse> bookmarkEntry(@Valid @RequestBody BookmarkEntryRequest request) {
        log.info("Updating entry bookmark status");
        JournalEntryResponse response = journalService.bookmarkEntry(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/entries/pin")
    public ResponseEntity<JournalEntryResponse> pinEntry(@Valid @RequestBody PinEntryRequest request) {
        log.info("Updating entry pin status");
        JournalEntryResponse response = journalService.pinEntry(request);
        return ResponseEntity.ok(response);
    }

    // Version endpoints
    @GetMapping("/entries/{entryId}/versions")
    public ResponseEntity<List<EntryVersionResponse>> getEntryVersions(@PathVariable String entryId) {
        log.debug("Fetching versions for entry: {}", entryId);
        List<EntryVersionResponse> response = journalService.getEntryVersions(entryId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/entries/{entryId}/revert/{version}")
    public ResponseEntity<JournalEntryResponse> revertToVersion(
            @PathVariable String entryId,
            @PathVariable Integer version) {
        log.info("Reverting entry {} to version {}", entryId, version);
        JournalEntryResponse response = journalService.revertToVersion(entryId, version);
        return ResponseEntity.ok(response);
    }

    // Reminder endpoints
    @PostMapping("/reminders")
    public ResponseEntity<ReminderResponse> createReminder(@Valid @RequestBody CreateReminderRequest request) {
        log.info("Creating reminder");
        ReminderResponse response = journalService.createReminder(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/reminders/upcoming")
    public ResponseEntity<List<ReminderResponse>> getUpcomingReminders() {
        log.debug("Fetching upcoming reminders");
        List<ReminderResponse> response = journalService.getUpcomingReminders();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/reminders/{reminderId}")
    public ResponseEntity<Void> deleteReminder(@PathVariable String reminderId) {
        log.info("Deleting reminder: {}", reminderId);
        journalService.deleteReminder(reminderId);
        return ResponseEntity.noContent().build();
    }

    // Template endpoints
    @PostMapping("/templates")
    public ResponseEntity<TemplateResponse> createTemplate(@Valid @RequestBody CreateTemplateRequest request) {
        log.info("Creating journal template");
        TemplateResponse response = journalService.createTemplate(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/templates")
    public ResponseEntity<List<TemplateResponse>> getTemplates() {
        log.debug("Fetching journal templates");
        List<TemplateResponse> response = journalService.getTemplates();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/templates/{templateId}/create-entry")
    public ResponseEntity<JournalEntryResponse> createFromTemplate(
            @PathVariable String templateId,
            @RequestBody Map<String, String> variables) {
        log.info("Creating entry from template: {}", templateId);
        JournalEntryResponse response = journalService.createFromTemplate(templateId, variables);
        return ResponseEntity.ok(response);
    }

    // Stats and utility endpoints
    @GetMapping("/stats")
    public ResponseEntity<JournalStatsResponse> getJournalStats() {
        log.debug("Fetching journal statistics");
        JournalStatsResponse response = journalService.getJournalStats();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<JournalEntrySummaryResponse>> getRecentEntries(
            @RequestParam(defaultValue = "10") int limit) {
        log.debug("Fetching recent journal entries");
        List<JournalEntrySummaryResponse> response = journalService.getRecentEntries(limit);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search-suggestions")
    public ResponseEntity<SearchSuggestionResponse> getSearchSuggestions() {
        log.debug("Fetching search suggestions");
        SearchSuggestionResponse response = journalService.getSearchSuggestions();
        return ResponseEntity.ok(response);
    }

    // Fallback methods
    public ResponseEntity<JournalEntryResponse> createEntryFallback(CreateJournalEntryRequest request, Throwable t) {
        log.error("Fallback triggered for createEntry: {}", t.getMessage());
        return ResponseEntity.badRequest().build();
    }

    public ResponseEntity<JournalEntryResponse> updateEntryFallback(String entryId, UpdateJournalEntryRequest request, Throwable t) {
        log.error("Fallback triggered for updateEntry: {}", t.getMessage());
        return ResponseEntity.badRequest().build();
    }
}
