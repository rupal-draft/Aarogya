package com.aarogya.patient_management_service.seeders;

import com.aarogya.patient_management_service.model.PatientMedication;
import com.aarogya.patient_management_service.repository.PatientMedicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PatientMedicationSeederService {

    private final PatientMedicationRepository medicationRepository;

    public String seedPatientMedications() {
        if (medicationRepository.count() > 0) {
            return "Patient Medications already seeded!";
        }

        String patientId = "68a80e1b0474d478779e5c6c";

        List<PatientMedication> medications = Arrays.asList(
                PatientMedication.builder()
                        .patientId(patientId)
                        .medicationName("Metformin")
                        .dosage(new BigDecimal("500"))
                        .dosageUnit("mg")
                        .frequency("Twice daily")
                        .route("Oral")
                        .startDate(LocalDate.of(2024, 1, 10))
                        .prescribedBy("Dr. Sharma")
                        .reason("Type 2 Diabetes")
                        .instructions("Take with meals")
                        .sideEffects("Nausea, diarrhea")
                        .medicationType("Tablet")
                        .purpose("Blood sugar control")
                        .build(),

                PatientMedication.builder()
                        .patientId(patientId)
                        .medicationName("Lisinopril")
                        .dosage(new BigDecimal("10"))
                        .dosageUnit("mg")
                        .frequency("Once daily")
                        .route("Oral")
                        .startDate(LocalDate.of(2023, 11, 5))
                        .prescribedBy("Dr. Patel")
                        .reason("Hypertension")
                        .instructions("Take in the morning")
                        .sideEffects("Dizziness, cough")
                        .medicationType("Tablet")
                        .purpose("Blood pressure control")
                        .build(),

                PatientMedication.builder()
                        .patientId(patientId)
                        .medicationName("Atorvastatin")
                        .dosage(new BigDecimal("20"))
                        .dosageUnit("mg")
                        .frequency("Once daily")
                        .route("Oral")
                        .startDate(LocalDate.of(2024, 2, 1))
                        .prescribedBy("Dr. Mehta")
                        .reason("High cholesterol")
                        .instructions("Take at night")
                        .sideEffects("Muscle pain")
                        .medicationType("Tablet")
                        .purpose("Cholesterol management")
                        .build(),

                PatientMedication.builder()
                        .patientId(patientId)
                        .medicationName("Albuterol")
                        .dosage(new BigDecimal("2"))
                        .dosageUnit("puffs")
                        .frequency("As needed")
                        .route("Inhalation")
                        .startDate(LocalDate.of(2024, 3, 12))
                        .prescribedBy("Dr. Singh")
                        .reason("Asthma")
                        .instructions("Use inhaler during attacks")
                        .sideEffects("Tremors, palpitations")
                        .medicationType("Inhaler")
                        .purpose("Bronchodilator")
                        .build(),

                PatientMedication.builder()
                        .patientId(patientId)
                        .medicationName("Amoxicillin")
                        .dosage(new BigDecimal("500"))
                        .dosageUnit("mg")
                        .frequency("Three times daily")
                        .route("Oral")
                        .startDate(LocalDate.of(2024, 5, 20))
                        .endDate(LocalDate.of(2024, 5, 30))
                        .prescribedBy("Dr. Kumar")
                        .reason("Bacterial infection")
                        .instructions("Complete full course")
                        .sideEffects("Stomach upset, rash")
                        .medicationType("Capsule")
                        .purpose("Antibiotic")
                        .build()
        );

        medicationRepository.saveAll(medications);
        return "5 Patient Medications seeded successfully!";
    }
}
