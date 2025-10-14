package com.aarogya.doctor_service.seeder;

import com.aarogya.doctor_service.enums.forum.ThreadType;
import com.aarogya.doctor_service.models.forum.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class ForumSeeder implements CommandLineRunner {

    private final MongoTemplate mongoTemplate;

    private static final String DOCTOR_ID = "68eea17f83aa7469053351d5";
    private static final String OTHER_DOCTOR = "68eea20883aa7469053351d6";

    @Override
    public void run(String... args) {
        if (mongoTemplate.exists(new Query(), ForumThread.class)) {
            log.info("⚠️ Forum data already seeded. Skipping...");
            return;
        }

        // --- 1. Tags ---
        ForumTag cardiology = ForumTag.builder()
                .name("Cardiology")
                .description("Heart and vascular health discussions")
                .threadCount(0).followerCount(0).isActive(true)
                .createdAt(LocalDateTime.now()).build();

        ForumTag pediatrics = ForumTag.builder()
                .name("Pediatrics")
                .description("Child health and care")
                .createdAt(LocalDateTime.now()).build();

        ForumTag research = ForumTag.builder()
                .name("Research")
                .description("Latest research and findings")
                .createdAt(LocalDateTime.now()).build();

        mongoTemplate.save(cardiology);
        mongoTemplate.save(pediatrics);
        mongoTemplate.save(research);

        // --- 2. Threads ---
        ForumThread thread1 = ForumThread.builder()
                .authorId(DOCTOR_ID)
                .authorName("Dr. Smith")
                .authorSpecialization("Cardiology")
                .title("Best practices in managing hypertension")
                .content("What are the latest recommended practices for managing hypertension in adults?")
                .tags(List.of(cardiology.getName(), research.getName()))
                .type(ThreadType.QUESTION)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        ForumThread thread2 = ForumThread.builder()
                .authorId(OTHER_DOCTOR)
                .authorName("Dr. Johnson")
                .authorSpecialization("Pediatrics")
                .title("Case study: Persistent cough in toddlers")
                .content("Sharing a case of a 3-year-old with chronic cough. Looking for differential diagnoses.")
                .tags(List.of(pediatrics.getName()))
                .type(ThreadType.CASE_STUDY)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        mongoTemplate.save(thread1);
        mongoTemplate.save(thread2);

        // --- 3. Replies ---
        ForumReply reply1 = ForumReply.builder()
                .threadId(thread1.getId())
                .authorId(OTHER_DOCTOR)
                .authorName("Dr. Johnson")
                .content("ACE inhibitors remain first-line for most patients, but lifestyle modification is equally important.")
                .upvoteCount(2)
                .isSolution(true)
                .createdAt(LocalDateTime.now())
                .build();

        ForumReply reply2 = ForumReply.builder()
                .threadId(thread2.getId())
                .authorId(DOCTOR_ID)
                .authorName("Dr. Smith")
                .content("Consider asthma, GERD, or pertussis in differential diagnosis. Pulmonary function test may help.")
                .createdAt(LocalDateTime.now())
                .build();

        mongoTemplate.save(reply1);
        mongoTemplate.save(reply2);

        // --- 4. Votes ---
        ForumVote vote1 = ForumVote.builder()
                .doctorId(DOCTOR_ID)
                .threadId(thread1.getId())
                .replyId(reply1.getId())
                .voteValue(1)
                .createdAt(LocalDateTime.now())
                .build();

        ForumVote vote2 = ForumVote.builder()
                .doctorId(OTHER_DOCTOR)
                .threadId(thread2.getId())
                .voteValue(1)
                .createdAt(LocalDateTime.now())
                .build();

        mongoTemplate.save(vote1);
        mongoTemplate.save(vote2);

        // --- 5. Bookmarks ---
        ForumBookmark bookmark = ForumBookmark.builder()
                .doctorId(DOCTOR_ID)
                .threadId(thread2.getId())
                .createdAt(LocalDateTime.now())
                .build();

        mongoTemplate.save(bookmark);

        // --- 6. Subscriptions ---
        TagSubscription sub1 = TagSubscription.builder()
                .doctorId(DOCTOR_ID)
                .tagId(cardiology.getId())
                .subscribedAt(LocalDateTime.now())
                .build();

        TagSubscription sub2 = TagSubscription.builder()
                .doctorId(OTHER_DOCTOR)
                .tagId(pediatrics.getId())
                .subscribedAt(LocalDateTime.now())
                .build();

        mongoTemplate.save(sub1);
        mongoTemplate.save(sub2);

        // --- 7. Thread Views ---
        ThreadView view1 = ThreadView.builder()
                .doctorId(DOCTOR_ID)
                .threadId(thread1.getId())
                .viewedAt(LocalDateTime.now())
                .build();

        ThreadView view2 = ThreadView.builder()
                .doctorId(OTHER_DOCTOR)
                .threadId(thread1.getId())
                .viewedAt(LocalDateTime.now())
                .build();

        mongoTemplate.save(view1);
        mongoTemplate.save(view2);

        log.info("✅ Seeded Forum: Tags(3), Threads(2), Replies(2), Votes(2), Bookmark(1), Subscriptions(2), Views(2)");
    }
}

