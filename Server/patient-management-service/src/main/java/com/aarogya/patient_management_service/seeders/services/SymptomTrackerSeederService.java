package com.aarogya.patient_management_service.seeders.services;



import com.aarogya.patient_management_service.model.SymptomTracker;
import com.aarogya.patient_management_service.repository.SymptomTrackerRepository;
import com.aarogya.patient_management_service.seeders.SeederService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SymptomTrackerSeederService implements SeederService {

    private final SymptomTrackerRepository symptomTrackerRepository;

    @Override
    public void seed(String patientId) {
        symptomTrackerRepository.deleteAll();


        SymptomTracker headache = SymptomTracker.builder()
                .patientId(patientId)
                .symptomName("Headache")
                .category("Neurological")
                .severity(6)
                .description("Throbbing headache lasting for hours")
                .triggers(Arrays.asList("Stress", "Lack of sleep"))
                .duration("3 hours")
                .frequency("Daily")
                .associatedSymptoms(Arrays.asList("Nausea", "Light sensitivity"))
                .notes("Occurs mostly in the evening")
                .recordedAt(LocalDateTime.now().minusDays(5))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        SymptomTracker fatigue = SymptomTracker.builder()
                .patientId(patientId)
                .symptomName("Fatigue")
                .category("General")
                .severity(7)
                .description("Feeling tired despite sleeping 8 hours")
                .triggers(List.of("Work stress"))
                .duration("All day")
                .frequency("Frequent")
                .associatedSymptoms(Arrays.asList("Headache", "Irritability"))
                .notes("Started after long work shifts")
                .recordedAt(LocalDateTime.now().minusDays(4))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        SymptomTracker cough = SymptomTracker.builder()
                .patientId(patientId)
                .symptomName("Cough")
                .category("Respiratory")
                .severity(5)
                .description("Dry cough worsening at night")
                .triggers(List.of("Cold air"))
                .duration("2 weeks")
                .frequency("Intermittent")
                .associatedSymptoms(Arrays.asList("Sore throat"))
                .notes("No fever observed")
                .recordedAt(LocalDateTime.now().minusDays(3))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        SymptomTracker dizziness = SymptomTracker.builder()
                .patientId(patientId)
                .symptomName("Dizziness")
                .category("Neurological")
                .severity(4)
                .description("Lightheaded feeling when standing up quickly")
                .triggers(List.of("Standing up too fast"))
                .duration("A few minutes")
                .frequency("Occasional")
                .associatedSymptoms(List.of("Blurred vision"))
                .notes("Not severe but noticeable")
                .recordedAt(LocalDateTime.now().minusDays(2))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        SymptomTracker stomachPain = SymptomTracker.builder()
                .patientId(patientId)
                .symptomName("Stomach Pain")
                .category("Gastrointestinal")
                .severity(6)
                .description("Sharp abdominal pain after meals")
                .triggers(List.of("Spicy food"))
                .duration("1-2 hours")
                .frequency("Every other day")
                .associatedSymptoms(Arrays.asList("Bloating", "Acid reflux"))
                .notes("Improves after medication")
                .recordedAt(LocalDateTime.now().minusDays(1))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        symptomTrackerRepository.saveAll(Arrays.asList(headache, fatigue, cough, dizziness, stomachPain));
    }
}

