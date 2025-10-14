package com.aarogya.prescription_service.util;

import com.aarogya.prescription_service.enums.PrescriptionStatus;
import com.aarogya.prescription_service.model.Medicine;
import com.aarogya.prescription_service.model.PrescribedMedicine;
import com.aarogya.prescription_service.model.Prescription;
import com.aarogya.prescription_service.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

@Slf4j
@Component
@RequiredArgsConstructor
@Order(3)
public class PrescriptionSeeder implements CommandLineRunner {

    private final MongoTemplate mongoTemplate;
    private final MedicineRepository medicineRepository; // inject repository

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

    @Override
    public void run(String... args) {
        if (mongoTemplate.count(new Query(), Prescription.class) > 0) {
            log.info("Prescriptions already seeded, skipping...");
            return;
        }

        // Fetch all medicines from DB
        List<Medicine> medicines = medicineRepository.findAll();

        if (medicines.isEmpty()) {
            log.warn("No medicines found in DB. Cannot seed prescriptions.");
            return;
        }

        List<Prescription> prescriptions = new ArrayList<>();

        // Create 5 sample prescriptions
        for (int i = 0; i < APPOINTMENT_IDS.size(); i++) {
            String patientId = PATIENT_IDS.get(i % PATIENT_IDS.size());
            String appointmentId = APPOINTMENT_IDS.get(i);

            // Randomly pick 1-3 medicines
            Collections.shuffle(medicines);
            List<PrescribedMedicine> prescribedMeds = medicines.stream()
                    .limit(1 + new Random().nextInt(3))
                    .map(med -> PrescribedMedicine.builder()
                            .medicineId(med.getId())
                            .medicineName(med.getName())
                            .dosage("500mg")
                            .frequency("Twice a day")
                            .duration(5)
                            .instructions("Take after food")
                            .isSubstitute(false)
                            .build())
                    .toList();

            Prescription prescription = Prescription.builder()
                    .appointmentId(appointmentId)
                    .patientId(patientId)
                    .doctorId(DOCTOR_ID)
                    .medicines(prescribedMeds)
                    .diagnosis("Sample diagnosis " + (i + 1))
                    .notes("Sample notes " + (i + 1))
                    .status(PrescriptionStatus.ACTIVE)
                    .build();

            mongoTemplate.save(prescription);
            prescriptions.add(prescription);
        }

        log.info("✅ Seeded {} prescriptions dynamically with medicines from DB", prescriptions.size());
    }
}

