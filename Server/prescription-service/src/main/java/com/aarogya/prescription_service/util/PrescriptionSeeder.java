package com.aarogya.prescription_service.util;

import com.aarogya.prescription_service.enums.PrescriptionStatus;
import com.aarogya.prescription_service.model.Medicine;
import com.aarogya.prescription_service.model.PrescribedMedicine;
import com.aarogya.prescription_service.model.Prescription;
import com.aarogya.prescription_service.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
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
public class PrescriptionSeeder implements CommandLineRunner {

    private final MongoTemplate mongoTemplate;
    private final MedicineRepository medicineRepository; // inject repository

    private static final String DOCTOR_ID = "68a810b60474d478779e5c6d";
    private static final List<String> PATIENT_IDS = List.of(
            "68a80e1b0474d478779e5c6c",
            "68be8b448278f71c91f3e685",
            "68be8b448278f71c91f3e686",
            "68be8b448278f71c91f3e687"
    );
    private static final List<String> APPOINTMENT_IDS = List.of(
            "68bee64cf03eb7a07ab61741", "68bee64cf03eb7a07ab61742", "68bee64cf03eb7a07ab61743", "68bee64cf03eb7a07ab61744",
            "68bee64cf03eb7a07ab61745", "68bee64cf03eb7a07ab61746", "68bee64cf03eb7a07ab61747", "68bee64cf03eb7a07ab61748"
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

