package com.aarogya.doctor_service.services.journal;

import com.aarogya.doctor_service.dto.journal.request.*;
import com.aarogya.doctor_service.dto.journal.response.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface JournalService {
    JournalEntryResponse createEntry(CreateJournalEntryRequest request);
    JournalEntryResponse getDecryptedEntry(DecryptRequest request);
    Page<JournalEntrySummaryResponse> getEntries(JournalFilterRequest filter, Pageable pageable);
    JournalEntryResponse updateEntry(String entryId, UpdateJournalEntryRequest request);
    void deleteEntry(String entryId);
    void restoreEntry(String entryId);
    JournalEntryResponse bookmarkEntry(BookmarkEntryRequest request);
    JournalEntryResponse pinEntry(PinEntryRequest request);
    List<EntryVersionResponse> getEntryVersions(String entryId);
    JournalEntryResponse revertToVersion(String entryId, Integer version);
    ReminderResponse createReminder(CreateReminderRequest request);
    List<ReminderResponse> getUpcomingReminders();
    void deleteReminder(String reminderId);
    TemplateResponse createTemplate(CreateTemplateRequest request);
    List<TemplateResponse> getTemplates();
    JournalEntryResponse createFromTemplate(String templateId, Map<String, String> variables);
    JournalStatsResponse getJournalStats();
    List<JournalEntrySummaryResponse> getRecentEntries(int limit);
    SearchSuggestionResponse getSearchSuggestions();
}
