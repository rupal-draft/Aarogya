package com.aarogya.doctor_service.services.journal.implementation;

import com.aarogya.doctor_service.dto.forum.response.JournalDashboardResponse;
import com.aarogya.doctor_service.dto.forum.response.JournalTagUsageDto;
import com.aarogya.doctor_service.dto.forum.response.JournalTemplateUsageDto;
import com.aarogya.doctor_service.dto.forum.response.JournalTrendDto;
import com.aarogya.doctor_service.enums.journal.EntryType;
import com.aarogya.doctor_service.models.journal.*;
import com.aarogya.doctor_service.services.journal.JournalStatsService;
import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

@Service
@RequiredArgsConstructor
public class JournalStatsServiceImpl implements JournalStatsService {

    private final MongoTemplate mongoTemplate;

    @Override
    @Cacheable(value = "journalDashboard", key = "#doctorId")
    public JournalDashboardResponse getDoctorJournalStats(String doctorId) {
        long totalEntries = mongoTemplate.count(
                Query.query(Criteria.where("doctorId").is(doctorId)), JournalEntry.class);

        long activeEntries = mongoTemplate.count(
                Query.query(Criteria.where("doctorId").is(doctorId).and("isActive").is(true)), JournalEntry.class);

        long archivedEntries = totalEntries - activeEntries;

        long patientNotes = mongoTemplate.count(
                Query.query(Criteria.where("doctorId").is(doctorId).and("type").is(EntryType.NOTE)), JournalEntry.class);

        long personalNotes = mongoTemplate.count(
                Query.query(Criteria.where("doctorId").is(doctorId).and("type").ne(EntryType.NOTE)), JournalEntry.class);

        Aggregation wordAgg = Aggregation.newAggregation(
                match(Criteria.where("doctorId").is(doctorId)),
                group().sum("wordCount").as("totalWords").avg("wordCount").as("avgWords")
        );
        Document wordStats = mongoTemplate.aggregate(wordAgg, JournalEntry.class, Document.class).getUniqueMappedResult();
        long totalWords = wordStats != null ? ((Number) wordStats.getOrDefault("totalWords", 0)).longValue() : 0;
        double avgWords = wordStats != null ? ((Number) wordStats.getOrDefault("avgWords", 0)).doubleValue() : 0.0;

        long bookmarksCount = mongoTemplate.count(
                Query.query(Criteria.where("doctorId").is(doctorId)), JournalBookmark.class);

        Aggregation versionAgg = Aggregation.newAggregation(
                match(Criteria.where("doctorId").is(doctorId)),
                group("entryId").count().as("versions"),
                group().avg("versions").as("avgVersions").count().as("entriesWithVersions")
        );
        Document versionStats = mongoTemplate.aggregate(versionAgg, JournalEntryVersion.class, Document.class).getUniqueMappedResult();
        double avgVersions = versionStats != null ? ((Number) versionStats.getOrDefault("avgVersions", 0)).doubleValue() : 0.0;
        double modificationRatio;
        if (totalEntries > 0) {
            assert versionStats != null;
            modificationRatio = (double) ((Number) versionStats.getOrDefault("entriesWithVersions", 0)).intValue() / totalEntries;
        } else {
            modificationRatio = 0.0;
        }

        long upcomingReminders = mongoTemplate.count(
                Query.query(Criteria.where("doctorId").is(doctorId).and("reminderDate").gte(LocalDateTime.now())), JournalReminder.class);
        long recurringReminders = mongoTemplate.count(
                Query.query(Criteria.where("doctorId").is(doctorId).and("isRecurring").is(true)), JournalReminder.class);

        long totalTemplates = mongoTemplate.count(
                Query.query(Criteria.where("doctorId").is(doctorId).and("isActive").is(true)), JournalTemplate.class);

        List<JournalTagUsageDto> topTags = mongoTemplate.aggregate(Aggregation.newAggregation(
                match(Criteria.where("doctorId").is(doctorId)),
                unwind("tags"),
                group("tags").count().as("count"),
                project("count").and("_id").as("tag"),
                sort(Sort.Direction.DESC, "count"),
                limit(5)
        ), JournalEntry.class, JournalTagUsageDto.class).getMappedResults();

        List<JournalTemplateUsageDto> topTemplates = mongoTemplate.aggregate(Aggregation.newAggregation(
                match(Criteria.where("doctorId").is(doctorId)),
                unwind("tagUsage"),
                group("tagUsage").count().as("usageCount"),
                project("usageCount").and("_id").as("templateId"),
                sort(Sort.Direction.DESC, "usageCount"),
                limit(5)
        ), JournalAnalytics.class, JournalTemplateUsageDto.class).getMappedResults();

        List<JournalTrendDto> monthlyTrends = mongoTemplate.aggregate(Aggregation.newAggregation(
                match(Criteria.where("doctorId").is(doctorId)),
                project().andExpression("year(date)").as("year")
                        .andExpression("month(date)").as("month")
                        .and("entriesCreated").as("entriesCreated")
                        .and("totalWords").as("wordsWritten"),
                group("year", "month")
                        .sum("entriesCreated").as("entriesCreated")
                        .sum("wordsWritten").as("wordsWritten"),
                sort(Sort.Direction.ASC, "_id.year", "_id.month")
        ), JournalAnalytics.class, JournalTrendDto.class).getMappedResults();

        return JournalDashboardResponse.builder()
                .totalEntries(totalEntries)
                .activeEntries(activeEntries)
                .archivedEntries(archivedEntries)
                .avgWordsPerEntry(avgWords)
                .totalWordsWritten(totalWords)
                .patientNotesCount(patientNotes)
                .personalNotesCount(personalNotes)
                .bookmarksCount(bookmarksCount)
                .modificationRatio(modificationRatio)
                .avgVersionsPerEntry(avgVersions)
                .upcomingReminders(upcomingReminders)
                .recurringReminders(recurringReminders)
                .totalTemplates(totalTemplates)
                .topTags(topTags)
                .topTemplates(topTemplates)
                .monthlyTrends(monthlyTrends)
                .build();
    }
}
