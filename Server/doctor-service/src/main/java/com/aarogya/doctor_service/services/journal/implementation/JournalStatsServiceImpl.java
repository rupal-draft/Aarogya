package com.aarogya.doctor_service.services.journal.implementation;

import com.aarogya.doctor_service.dto.journal.response.JournalDashboardResponse;
import com.aarogya.doctor_service.dto.journal.response.JournalTagUsageDto;
import com.aarogya.doctor_service.dto.journal.response.JournalTemplateUsageDto;
import com.aarogya.doctor_service.dto.journal.response.JournalTrendDto;
import com.aarogya.doctor_service.enums.journal.EntryType;
import com.aarogya.doctor_service.models.journal.*;
import com.aarogya.doctor_service.services.journal.JournalStatsService;
import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.ConvertOperators;
import org.springframework.data.mongodb.core.aggregation.ObjectOperators;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

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
                project("doctorId")
                        .and(ObjectOperators.valueOf("tagUsage").toArray()).as("tagUsageArray"),
                unwind("tagUsageArray"),
                group("tagUsageArray.k").sum("tagUsageArray.v").as("usageCount"),
                project("usageCount")
                        .and(ConvertOperators.ToObjectId.toObjectId("$_id")).as("templateId"),
                lookup("journal_templates", "templateId", "_id", "template"),
                unwind("template", true),
                project("usageCount")
                        .and("templateId").as("templateId")
                        .and("template.name").as("templateName"),
                sort(Sort.Direction.DESC, "usageCount"),
                limit(5)
        ), JournalAnalytics.class, JournalTemplateUsageDto.class).getMappedResults();

        Aggregation monthlyTrendAgg = Aggregation.newAggregation(
                match(Criteria.where("doctorId").is(doctorId)),
                project()
                        .andExpression("dateToString('%Y', $date)").as("yearStr")
                        .andExpression("dateToString('%m', $date)").as("monthStr")
                        .and("entriesCreated").as("entriesCreated")
                        .and("totalWords").as("wordsWritten"),
                group("yearStr", "monthStr")
                        .sum("entriesCreated").as("entriesCreated")
                        .sum("wordsWritten").as("wordsWritten"),
                sort(Sort.by(Sort.Order.asc("_id.yearStr"), Sort.Order.asc("_id.monthStr")))
        );

        List<Document> rawResults = mongoTemplate.aggregate(
                monthlyTrendAgg, JournalAnalytics.class, Document.class
        ).getMappedResults();

        List<JournalTrendDto> monthlyTrends = rawResults.stream()
                .map(doc -> {
                    Document idDoc = (Document) doc.get("_id");

                    int year = Integer.parseInt(idDoc.getString("yearStr"));
                    int month = Integer.parseInt(idDoc.getString("monthStr"));

                    long entries = ((Number) doc.get("entriesCreated")).longValue();
                    long words = ((Number) doc.get("wordsWritten")).longValue();

                    return JournalTrendDto.builder()
                            .year(year)
                            .month(month)
                            .entriesCreated(entries)
                            .wordsWritten(words)
                            .build();
                })
                .collect(Collectors.toList());

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
