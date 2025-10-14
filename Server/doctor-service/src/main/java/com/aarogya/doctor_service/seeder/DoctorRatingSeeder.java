package com.aarogya.doctor_service.seeder;

import com.aarogya.doctor_service.models.rating.DoctorRating;
import com.aarogya.doctor_service.models.rating.DoctorRatingSummary;
import com.aarogya.doctor_service.models.rating.HelpfulVote;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

@Slf4j
@Component
@RequiredArgsConstructor
public class DoctorRatingSeeder implements CommandLineRunner {

    private final MongoTemplate mongoTemplate;
    private final Random random = new Random();

    private static final String DOCTOR_ID = "68eea17f83aa7469053351d5";
    private static final List<String> PATIENT_IDS = List.of(
            "68ee9fe183aa7469053351d1",
            "68eea0c583aa7469053351d2",
            "68eea0d183aa7469053351d3",
            "68eea0d983aa7469053351d4"
    );
    private static final List<String> APPOINTMENT_IDS = java.util.List.of(
            "68eea3692c9ff586d897599f", "68eea3692c9ff586d89759a0", "68eea3692c9ff586d89759a1", "68eea3692c9ff586d89759a2",
            "68eea3692c9ff586d89759a3", "68eea3692c9ff586d89759a4", "68eea3692c9ff586d89759a5", "68eea3692c9ff586d89759a6"
    );
    private static final List<String> PRESCRIPTION_IDs = java.util.List.of(
            "68eea5c94ace190f4ae9ab15",
            "68eea5c94ace190f4ae9ab16",
            "68eea5c94ace190f4ae9ab17",
            "68eea5c94ace190f4ae9ab18",
            "68eea5c94ace190f4ae9ab19",
            "68eea5c94ace190f4ae9ab1a"
    );

    @Override
    public void run(String... args) {
        if (mongoTemplate.count(new Query(), DoctorRating.class) > 0) {
            log.info("⭐ Doctor ratings already exist, skipping seeding.");
            return;
        }

        log.info("⭐ Seeding doctor ratings...");

        // ---- Seed Ratings ----
        List<String> commonTags = List.of("friendly", "professional", "quick service", "clean facility", "long wait");
        List<DoctorRating> ratings = IntStream.range(0, PATIENT_IDS.size())
                .mapToObj(i -> {
                    int stars = random.nextInt(5) + 1;
                    return DoctorRating.builder()
                            .doctorId(DOCTOR_ID)
                            .patientId(PATIENT_IDS.get(i))
                            .patientName("Patient " + (i + 1))
                            .rating(stars)
                            .review("This is a sample review with " + stars + " stars.")
                            .appointmentId(APPOINTMENT_IDS.get(i))
                            .prescriptionId(PRESCRIPTION_IDs.get(i))
                            .tags(randomTags(commonTags))
                            .wouldRecommend(stars >= 4)
                            .waitTimeRating(2 + random.nextInt(4))     // 2–5
                            .staffRating(3 + random.nextInt(3))        // 3–5
                            .facilityRating(3 + random.nextInt(3))     // 3–5
                            .isVerified(true)
                            .isAnonymous(random.nextBoolean())
                            .createdAt(LocalDateTime.now().minusDays(random.nextInt(30)))
                            .updatedAt(LocalDateTime.now())
                            .build();
                }).toList();

        mongoTemplate.insertAll(ratings);

        // ---- Seed Helpful Votes ----
        List<HelpfulVote> helpfulVotes = new ArrayList<>();
        for (DoctorRating rating : ratings) {
            // 50% chance this rating has helpful votes
            if (random.nextBoolean()) {
                int voteCount = 1 + random.nextInt(2); // 1–2 helpful votes
                for (int j = 0; j < voteCount; j++) {
                    String voter = PATIENT_IDS.get(random.nextInt(PATIENT_IDS.size()));
                    // avoid self-vote
                    if (!voter.equals(rating.getPatientId())) {
                        helpfulVotes.add(HelpfulVote.builder()
                                .ratingId(rating.getId())
                                .patientId(voter)
                                .createdAt(LocalDateTime.now())
                                .build());
                    }
                }
            }
        }
        mongoTemplate.insertAll(helpfulVotes);

        // ---- Compute Rating Summary ----
        DoctorRatingSummary summary = buildSummary(ratings);
        mongoTemplate.save(summary);

        log.info("✅ Seeded {} ratings, {} helpful votes, and 1 summary for doctor {}",
                ratings.size(), helpfulVotes.size(), DOCTOR_ID);
    }

    private List<String> randomTags(List<String> tags) {
        List<String> mutable = new ArrayList<>(tags);
        Collections.shuffle(mutable);
        return mutable.subList(0, 1 + random.nextInt(2));
    }


    private DoctorRatingSummary buildSummary(List<DoctorRating> ratings) {
        int total = ratings.size();
        if (total == 0) return DoctorRatingSummary.builder().doctorId(DoctorRatingSeeder.DOCTOR_ID).build();

        Map<Integer, Long> dist = ratings.stream()
                .collect(Collectors.groupingBy(DoctorRating::getRating, Collectors.counting()));

        double avg = ratings.stream().mapToInt(DoctorRating::getRating).average().orElse(0.0);
        double avgWait = ratings.stream().mapToInt(DoctorRating::getWaitTimeRating).average().orElse(0.0);
        double avgStaff = ratings.stream().mapToInt(DoctorRating::getStaffRating).average().orElse(0.0);
        double avgFacility = ratings.stream().mapToInt(DoctorRating::getFacilityRating).average().orElse(0.0);
        double recommendRate = ratings.stream().filter(r -> Boolean.TRUE.equals(r.getWouldRecommend())).count() * 100.0 / total;

        Map<String, Integer> tagFreq = ratings.stream()
                .flatMap(r -> r.getTags() != null ? r.getTags().stream() : Stream.empty())
                .collect(Collectors.toMap(tag -> tag, tag -> 1, Integer::sum));

        return DoctorRatingSummary.builder()
                .doctorId(DoctorRatingSeeder.DOCTOR_ID)
                .averageRating(round(avg))
                .totalRatings(total)
                .rating1Count(dist.getOrDefault(1, 0L).intValue())
                .rating2Count(dist.getOrDefault(2, 0L).intValue())
                .rating3Count(dist.getOrDefault(3, 0L).intValue())
                .rating4Count(dist.getOrDefault(4, 0L).intValue())
                .rating5Count(dist.getOrDefault(5, 0L).intValue())
                .averageWaitTimeRating(round(avgWait))
                .averageStaffRating(round(avgStaff))
                .averageFacilityRating(round(avgFacility))
                .recommendationRate(round(recommendRate))
                .tagFrequency(tagFreq)
                .lastUpdated(LocalDateTime.now())
                .build();
    }

    private double round(double value) {
        return Math.round(value * 10.0) / 10.0; // 1 decimal place
    }
}

