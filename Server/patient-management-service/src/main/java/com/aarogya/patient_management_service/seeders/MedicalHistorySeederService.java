package com.aarogya.patient_management_service.seeders;

import com.aarogya.patient_management_service.model.MedicalHistory;
import com.aarogya.patient_management_service.repository.MedicalHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MedicalHistorySeederService {

    private final MedicalHistoryRepository medicalHistoryRepository;

    private static final String PATIENT_ID = "68a80e1b0474d478779e5c6c";

    public List<MedicalHistory> seedMedicalHistory() {
        if (medicalHistoryRepository.count() > 0) {
            return medicalHistoryRepository.findAll();
        }

        List<MedicalHistory> histories = new ArrayList<>();

        histories.add(MedicalHistory.builder()
                .patientId(PATIENT_ID)
                .conditionName("Hypertension")
                .diagnosisDate(LocalDate.of(2020, 3, 15))
                .status("Active")
                .severity("Moderate")
                .category("Chronic")
                .notes("Patient requires regular monitoring")
                .isActive(true)
                .build());

        histories.add(MedicalHistory.builder()
                .patientId(PATIENT_ID)
                .conditionName("Type 2 Diabetes")
                .diagnosisDate(LocalDate.of(2018, 7, 22))
                .status("Active")
                .severity("Severe")
                .category("Chronic")
                .notes("Blood sugar monitoring required")
                .isActive(true)
                .build());

        histories.add(MedicalHistory.builder()
                .patientId(PATIENT_ID)
                .conditionName("Asthma")
                .diagnosisDate(LocalDate.of(2015, 1, 10))
                .status("Active")
                .severity("Mild")
                .category("Respiratory")
                .notes("Triggered by dust and pollen")
                .isActive(true)
                .build());

        histories.add(MedicalHistory.builder()
                .patientId(PATIENT_ID)
                .conditionName("COVID-19")
                .diagnosisDate(LocalDate.of(2021, 4, 10))
                .status("Recovered")
                .severity("Moderate")
                .category("Infectious Disease")
                .notes("Recovered fully after 15 days")
                .isActive(false)
                .build());

        histories.add(MedicalHistory.builder()
                .patientId(PATIENT_ID)
                .conditionName("Migraine")
                .diagnosisDate(LocalDate.of(2019, 2, 18))
                .status("Active")
                .severity("Moderate")
                .category("Neurological")
                .notes("Triggered by stress and lack of sleep")
                .isActive(true)
                .build());

        histories.addAll(Arrays.asList(
                MedicalHistory.builder().patientId(PATIENT_ID).conditionName("Tuberculosis")
                        .diagnosisDate(LocalDate.of(2016, 8, 9)).status("Recovered").severity("Severe")
                        .category("Infectious Disease").notes("Completed DOTS therapy").isActive(false).build(),

                MedicalHistory.builder().patientId(PATIENT_ID).conditionName("Chickenpox")
                        .diagnosisDate(LocalDate.of(2005, 3, 5)).status("Recovered").severity("Mild")
                        .category("Viral").notes("No complications").isActive(false).build(),

                MedicalHistory.builder().patientId(PATIENT_ID).conditionName("Allergic Rhinitis")
                        .diagnosisDate(LocalDate.of(2022, 9, 11)).status("Active").severity("Mild")
                        .category("Allergy").notes("Triggered during spring season").isActive(true).build(),

                MedicalHistory.builder().patientId(PATIENT_ID).conditionName("Anemia")
                        .diagnosisDate(LocalDate.of(2021, 11, 15)).status("Active").severity("Mild")
                        .category("Blood Disorder").notes("Treated with supplements").isActive(true).build(),

                MedicalHistory.builder().patientId(PATIENT_ID).conditionName("Chronic Kidney Disease")
                        .diagnosisDate(LocalDate.of(2016, 7, 12)).status("Active").severity("Severe")
                        .category("Renal").notes("Regular nephrologist follow-up").isActive(true).build()
        ));

        return medicalHistoryRepository.saveAll(histories);
    }
}
