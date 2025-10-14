package com.aarogya.prescription_service.util;

import com.aarogya.prescription_service.model.Medicine;
import com.aarogya.prescription_service.model.MedicineInteraction;
import com.aarogya.prescription_service.repository.MedicineInteractionRepository;
import com.aarogya.prescription_service.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
@Order(1)
public class MedicineDataLoader implements CommandLineRunner {

    private final MedicineRepository medicineRepository;
    private final MedicineInteractionRepository interactionRepository;
    private final ResourceLoader resourceLoader;

    @Override
    public void run(String... args) throws Exception {
        if (medicineRepository.count() == 0) {
            loadMedicines();
        }
        if (interactionRepository.count() == 0) {
            loadInteractions();
        }
    }

    private void loadMedicines() {
        try {
            Resource resource = resourceLoader.getResource("classpath:medicines.csv");
            CSVParser parser = CSVParser.parse(
                    new InputStreamReader(resource.getInputStream()),
                    CSVFormat.DEFAULT.builder()
                            .setHeader()
                            .setSkipHeaderRecord(true)
                            .build()
            );

            List<Medicine> medicines = new ArrayList<>();
            for (CSVRecord record : parser) {
                Medicine medicine = parseMedicine(record);
                medicines.add(medicine);

                if (medicines.size() % 1000 == 0) {
                    medicineRepository.saveAll(medicines);
                    medicines.clear();
                }
            }

            if (!medicines.isEmpty()) {
                medicineRepository.saveAll(medicines);
            }

            log.info("Loaded {} medicines", medicineRepository.count());
        } catch (Exception e) {
            log.error("Failed to load medicines: {}", e.getMessage());
        }
    }

    private Medicine parseMedicine(CSVRecord record) {
        List<String> substitutes = new ArrayList<>();
        List<String> sideEffects = new ArrayList<>();
        List<String> uses = new ArrayList<>();

        // Parse substitutes
        for (int i = 0; i < 5; i++) {
            String substitute = record.get("substitute" + i);
            if (substitute != null && !substitute.trim().isEmpty()) {
                substitutes.add(substitute.trim());
            }
        }

        // Parse side effects
        for (int i = 0; i < 42; i++) {
            String sideEffect = record.get("sideEffect" + i);
            if (sideEffect != null && !sideEffect.trim().isEmpty()) {
                sideEffects.add(sideEffect.trim());
            }
        }

        // Parse uses
        for (int i = 0; i < 5; i++) {
            String use = record.get("use" + i);
            if (use != null && !use.trim().isEmpty()) {
                uses.add(use.trim());
            }
        }

        return Medicine.builder()
                .medicineId(Long.parseLong(record.get("id")))
                .name(record.get("name"))
                .substitutes(substitutes)
                .sideEffects(sideEffects)
                .uses(uses)
                .chemicalClass(record.get("Chemical Class"))
                .habitForming("Yes".equalsIgnoreCase(record.get("Habit Forming")))
                .therapeuticClass(record.get("Therapeutic Class"))
                .actionClass(record.get("Action Class"))
                .build();
    }

    private void loadInteractions() {
        try {
            Resource resource = resourceLoader.getResource("classpath:interactions.csv");
            CSVParser parser = CSVParser.parse(
                    new InputStreamReader(resource.getInputStream()),
                    CSVFormat.DEFAULT.builder()
                            .setHeader()
                            .setSkipHeaderRecord(true)
                            .build()
            );

            List<MedicineInteraction> interactions = new ArrayList<>();
            for (CSVRecord record : parser) {
                MedicineInteraction interaction = MedicineInteraction.builder()
                        .drug1(record.get("Drug 1").trim())
                        .drug2(record.get("Drug 2").trim())
                        .interactionDescription(record.get("Interaction Description").trim())
                        .build();

                interactions.add(interaction);

                if (interactions.size() % 1000 == 0) {
                    interactionRepository.saveAll(interactions);
                    interactions.clear();
                }
            }

            if (!interactions.isEmpty()) {
                interactionRepository.saveAll(interactions);
            }

            log.info("Loaded {} medicine interactions", interactionRepository.count());
        } catch (Exception e) {
            log.error("Failed to load interactions: {}", e.getMessage());
        }
    }
}
