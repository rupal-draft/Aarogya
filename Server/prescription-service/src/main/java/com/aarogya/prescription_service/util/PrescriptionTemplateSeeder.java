package com.aarogya.prescription_service.util;

import com.aarogya.prescription_service.model.*;
import com.aarogya.prescription_service.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class PrescriptionTemplateSeeder implements CommandLineRunner {

    private final MongoTemplate mongoTemplate;
    private final MedicineRepository medicineRepository; // fetch medicines dynamically

    private static final String DOCTOR_ID = "68a810b60474d478779e5c6d";
    private static final List<String> PATIENT_IDS = List.of(
            "68a80e1b0474d478779e5c6c",
            "68be8b448278f71c91f3e685",
            "68be8b448278f71c91f3e686",
            "68be8b448278f71c91f3e687"
    );

    @Override
    public void run(String... args) {

        if (mongoTemplate.count(new Query(), PrescriptionTemplate.class) > 0) {
            log.info("Prescription templates already seeded, skipping...");
            return;
        }

        // 1️⃣ Create Template Categories
        List<TemplateCategory> categories = List.of(
                TemplateCategory.builder()
                        .doctorId(DOCTOR_ID)
                        .name("General")
                        .description("General templates for common ailments")
                        .build(),
                TemplateCategory.builder()
                        .doctorId(DOCTOR_ID)
                        .name("Chronic")
                        .description("Templates for chronic conditions")
                        .build()
        );
        categories.forEach(mongoTemplate::save);

        // 2️⃣ Fetch medicines dynamically
        List<Medicine> medicines = medicineRepository.findAll();
        if (medicines.isEmpty()) {
            log.warn("No medicines found in DB. Cannot seed templates with medicines.");
            return;
        }

        // 3️⃣ Create Prescription Templates
        List<PrescriptionTemplate> templates = new ArrayList<>();

        // Template 1: Cold & Flu
        List<PrescribedMedicine> coldFluMeds = medicines.stream()
                .filter(m -> m.getName().toLowerCase().contains("paracetamol") || m.getName().toLowerCase().contains("vitamin"))
                .map(m -> PrescribedMedicine.builder()
                        .medicineId(m.getId())
                        .medicineName(m.getName())
                        .dosage("500mg")
                        .frequency("Twice a day")
                        .duration(5)
                        .instructions("Take after food")
                        .isSubstitute(false)
                        .build())
                .toList();

        PrescriptionTemplate template1 = PrescriptionTemplate.builder()
                .doctorId(DOCTOR_ID)
                .name("Cold & Flu")
                .description("Common cold treatment template")
                .diagnosis("Cold with mild fever")
                .notes("Take rest and hydrate")
                .categoryId(categories.get(0).getId())
                .tags(List.of("cold", "flu", "fever"))
                .medicines(coldFluMeds)
                .usageCount(3)
                .isFavorite(true)
                .build();

        // Template 2: Hypertension
        List<PrescribedMedicine> hypertensionMeds = medicines.stream()
                .filter(m -> m.getName().toLowerCase().contains("amlodipine") || m.getName().toLowerCase().contains("bp"))
                .map(m -> PrescribedMedicine.builder()
                        .medicineId(m.getId())
                        .medicineName(m.getName())
                        .dosage("5mg")
                        .frequency("Once a day")
                        .duration(30)
                        .instructions("Monitor blood pressure daily")
                        .isSubstitute(false)
                        .build())
                .toList();

        PrescriptionTemplate template2 = PrescriptionTemplate.builder()
                .doctorId(DOCTOR_ID)
                .name("Hypertension")
                .description("Chronic hypertension management")
                .diagnosis("High blood pressure")
                .notes("Monitor BP daily")
                .categoryId(categories.get(1).getId())
                .tags(List.of("hypertension", "bp"))
                .medicines(hypertensionMeds)
                .usageCount(2)
                .isFavorite(false)
                .build();

        templates.add(template1);
        templates.add(template2);
        templates.forEach(mongoTemplate::save);

        // 4️⃣ Create Template Usage Stats
        List<TemplateUsageStat> usageStats = List.of(
                TemplateUsageStat.builder()
                        .doctorId(DOCTOR_ID)
                        .templateId(template1.getId())
                        .patientId(PATIENT_IDS.get(0))
                        .appointmentId("68bee64cf03eb7a07ab61741")
                        .usageDate(LocalDateTime.now().minusDays(5))
                        .wasModified(false)
                        .build(),
                TemplateUsageStat.builder()
                        .doctorId(DOCTOR_ID)
                        .templateId(template1.getId())
                        .patientId(PATIENT_IDS.get(1))
                        .appointmentId("68bee64cf03eb7a07ab61742")
                        .usageDate(LocalDateTime.now().minusDays(3))
                        .wasModified(true)
                        .modifications("Removed Vitamin C")
                        .build(),
                TemplateUsageStat.builder()
                        .doctorId(DOCTOR_ID)
                        .templateId(template2.getId())
                        .patientId(PATIENT_IDS.get(2))
                        .appointmentId("68bee64cf03eb7a07ab61743")
                        .usageDate(LocalDateTime.now().minusDays(2))
                        .wasModified(false)
                        .build()
        );
        usageStats.forEach(mongoTemplate::save);

        log.info("✅ Seeded {} TemplateCategories, {} PrescriptionTemplates, and {} TemplateUsageStats",
                categories.size(), templates.size(), usageStats.size());
    }
}


