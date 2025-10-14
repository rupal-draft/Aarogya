package com.aarogya.doctor_service.seeder;

import com.aarogya.doctor_service.enums.journal.EntryType;
import com.aarogya.doctor_service.enums.journal.Priority;
import com.aarogya.doctor_service.models.journal.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Slf4j
@Component
@RequiredArgsConstructor
public class JournalSeeder implements CommandLineRunner {

    private final MongoTemplate mongoTemplate;
    private final Random random = new Random();

    private static final String DOCTOR_ID = "68eea17f83aa7469053351d5";
    private static final List<String> PATIENT_IDS = List.of(
            "68ee9fe183aa7469053351d1",
            "68eea0c583aa7469053351d2",
            "68eea0d183aa7469053351d3",
            "68eea0d983aa7469053351d4"
    );

    @Override
    public void run(String... args) {
        if (mongoTemplate.count(new Query(), JournalEntry.class) > 0) {
            log.info("📘 Journal data already exists, skipping seeding.");
            return;
        }

        log.info("📘 Starting Journal data seeding...");

        // ---- Seed Entries ----
        List<JournalEntry> entries = IntStream.range(0, PATIENT_IDS.size())
                .mapToObj(i -> JournalEntry.builder()
                        .doctorId(DOCTOR_ID)
                        .patientId(PATIENT_IDS.get(i))
                        .patientName("Patient " + (i + 1))
                        .title("Clinical Note " + (i + 1))
                        .content("This is a sample journal entry content for patient " + (i + 1))
                        .tags(List.of("tag" + (i + 1), "general"))
                        .type(randomEntryType())
                        .priority(randomPriority())
                        .wordCount(50 + random.nextInt(200))
                        .createdAt(LocalDateTime.now().minusDays(random.nextInt(30)))
                        .updatedAt(LocalDateTime.now())
                        .build())
                .toList();

        mongoTemplate.insertAll(entries);

        // ---- Seed Versions ----
        List<JournalEntryVersion> versions = entries.stream()
                .map(entry -> JournalEntryVersion.builder()
                        .entryId(entry.getId())
                        .doctorId(DOCTOR_ID)
                        .title(entry.getTitle())
                        .content(entry.getContent())
                        .tags(entry.getTags())
                        .version(1)
                        .changeSummary("Initial version")
                        .createdAt(entry.getCreatedAt())
                        .build())
                .toList();

        mongoTemplate.insertAll(versions);

        // ---- Seed Bookmarks ----
        List<JournalBookmark> bookmarks = entries.stream()
                .limit(2) // only bookmark first 2
                .map(entry -> JournalBookmark.builder()
                        .doctorId(DOCTOR_ID)
                        .entryId(entry.getId())
                        .bookmarkedAt(LocalDateTime.now())
                        .build())
                .toList();

        mongoTemplate.insertAll(bookmarks);

        // ---- Seed Reminders ----
        List<JournalReminder> reminders = entries.stream()
                .limit(2)
                .map(entry -> JournalReminder.builder()
                        .doctorId(DOCTOR_ID)
                        .entryId(entry.getId())
                        .title("Reminder for " + entry.getTitle())
                        .reminderDate(LocalDateTime.now().plusDays(3))
                        .isActive(true)
                        .isRecurring(false)
                        .build())
                .toList();

        mongoTemplate.insertAll(reminders);

        // ---- Seed Templates ----
        List<JournalTemplate> templates = List.of(
                JournalTemplate.builder()
                        .doctorId(DOCTOR_ID)
                        .name("General Clinical Note")
                        .description("Template for standard clinical notes")
                        .titleTemplate("Clinical Note - {{patientName}}")
                        .contentTemplate("Patient: {{patientName}}\nSymptoms: ...\nDiagnosis: ...\nPlan: ...")
                        .defaultTags(List.of("clinical", "patient"))
                        .defaultType(EntryType.CLINICAL_OBSERVATION)
                        .isSystem(true)
                        .build(),

                JournalTemplate.builder()
                        .doctorId(DOCTOR_ID)
                        .name("Research Idea")
                        .description("Template for research-related notes")
                        .titleTemplate("Research Idea - {{topic}}")
                        .contentTemplate("Hypothesis: ...\nMethodology: ...\nReferences: ...")
                        .defaultTags(List.of("research", "idea"))
                        .defaultType(EntryType.RESEARCH_IDEA)
                        .isSystem(false)
                        .build()
        );

        mongoTemplate.insertAll(templates);

        Map<String, Integer> tagUsage = templates.stream()
                .collect(Collectors.toMap(
                        JournalTemplate::getId,
                        t -> random.nextInt(5) + 1
                ));

        JournalAnalytics analytics = JournalAnalytics.builder()
                .doctorId(DOCTOR_ID)
                .date(LocalDate.now().atStartOfDay())
                .entriesCreated(entries.size())
                .entriesUpdated(2)
                .totalWords(entries.stream().mapToInt(JournalEntry::getWordCount).sum())
                .patientNotes((int) entries.stream().filter(e -> e.getPatientId() != null).count())
                .personalNotes((int) entries.stream().filter(e -> e.getPatientId() == null).count())
                .tagUsage(tagUsage)
                .createdAt(LocalDateTime.now())
                .build();

        mongoTemplate.insert(analytics);

        log.info("✅ Journal data seeding complete.");
    }

    private EntryType randomEntryType() {
        EntryType[] values = EntryType.values();
        return values[random.nextInt(values.length)];
    }

    private Priority randomPriority() {
        Priority[] values = Priority.values();
        return values[random.nextInt(values.length)];
    }
}

