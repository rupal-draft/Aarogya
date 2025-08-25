package com.aarogya.patient_management_service.seeders.services;

import com.aarogya.patient_management_service.model.DiseaseHistory;
import com.aarogya.patient_management_service.repository.DiseaseHistoryRepository;
import com.aarogya.patient_management_service.seeders.SeederService;
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
public class DiseaseHistorySeederService implements SeederService {

    private final DiseaseHistoryRepository diseaseHistoryRepository;

    @Override
    public void seed(String PATIENT_ID) {
        if (diseaseHistoryRepository.count() > 0) {
            diseaseHistoryRepository.findAll();
            return;
        }

        List<DiseaseHistory> histories = new ArrayList<>();

        histories.add(DiseaseHistory.builder()
                .patientId(PATIENT_ID)
                .diseaseName("Hypertension")
                .diseaseCode("I10")
                .diagnosisDate(LocalDate.of(2020, 3, 15))
                .recoveryDate(null)
                .status("Active")
                .severity("Moderate")
                .diagnosedBy("Dr. Sharma")
                .treatmentPlan("Lifestyle modification, medication")
                .symptoms(Arrays.asList("Headache", "Dizziness"))
                .complications(Arrays.asList("Stroke", "Heart disease"))
                .notes("Patient requires regular monitoring")
                .description("High blood pressure condition")
                .treatment("Amlodipine 5mg daily")
                .isChronic(true)
                .isHereditary(true)
                .familyHistory("Father had hypertension")
                .build());

        histories.add(DiseaseHistory.builder()
                .patientId(PATIENT_ID)
                .diseaseName("Diabetes Mellitus Type 2")
                .diseaseCode("E11")
                .diagnosisDate(LocalDate.of(2018, 7, 22))
                .status("Active")
                .severity("Severe")
                .diagnosedBy("Dr. Banerjee")
                .treatmentPlan("Insulin therapy, diet control")
                .symptoms(Arrays.asList("Frequent urination", "Excessive thirst", "Fatigue"))
                .complications(Arrays.asList("Neuropathy", "Kidney disease"))
                .notes("Blood sugar monitoring required")
                .description("Chronic condition affecting glucose metabolism")
                .treatment("Insulin + Metformin")
                .isChronic(true)
                .isHereditary(true)
                .familyHistory("Mother has diabetes")
                .build());

        histories.add(DiseaseHistory.builder()
                .patientId(PATIENT_ID)
                .diseaseName("Asthma")
                .diseaseCode("J45")
                .diagnosisDate(LocalDate.of(2015, 1, 10))
                .status("Active")
                .severity("Mild")
                .diagnosedBy("Dr. Mehta")
                .treatmentPlan("Inhaler therapy as required")
                .symptoms(Arrays.asList("Shortness of breath", "Coughing"))
                .complications(List.of("Respiratory infections"))
                .notes("Triggered by dust and pollen")
                .description("Chronic inflammatory disease of the airways")
                .treatment("Salbutamol inhaler")
                .isChronic(true)
                .isHereditary(false)
                .familyHistory("None")
                .build());

        histories.add(DiseaseHistory.builder()
                .patientId(PATIENT_ID)
                .diseaseName("COVID-19")
                .diseaseCode("U07.1")
                .diagnosisDate(LocalDate.of(2021, 4, 10))
                .recoveryDate(LocalDate.of(2021, 4, 25))
                .status("Recovered")
                .severity("Moderate")
                .diagnosedBy("Dr. Sinha")
                .treatmentPlan("Isolation, supportive treatment")
                .symptoms(Arrays.asList("Fever", "Cough", "Loss of taste"))
                .complications(List.of("Mild pneumonia"))
                .notes("Recovered fully after 15 days")
                .description("Coronavirus disease infection")
                .treatment("Paracetamol, Vitamin supplements")
                .isChronic(false)
                .isHereditary(false)
                .familyHistory("None")
                .build());

        histories.add(DiseaseHistory.builder()
                .patientId(PATIENT_ID)
                .diseaseName("Migraine")
                .diseaseCode("G43")
                .diagnosisDate(LocalDate.of(2019, 2, 18))
                .status("Active")
                .severity("Moderate")
                .diagnosedBy("Dr. Ghosh")
                .treatmentPlan("Pain management, avoid triggers")
                .symptoms(Arrays.asList("Headache", "Sensitivity to light"))
                .notes("Triggered by stress and lack of sleep")
                .description("Neurological condition with intense headaches")
                .treatment("Sumatriptan")
                .isChronic(true)
                .isHereditary(true)
                .familyHistory("Mother had migraines")
                .build());

        // Add more dummy records to reach 10–15
        histories.addAll(Arrays.asList(
                DiseaseHistory.builder().patientId(PATIENT_ID).diseaseName("Tuberculosis").diseaseCode("A15")
                        .diagnosisDate(LocalDate.of(2016, 8, 9)).recoveryDate(LocalDate.of(2017, 2, 15))
                        .status("Recovered").severity("Severe").diagnosedBy("Dr. Kapoor")
                        .treatmentPlan("6-month antibiotic course").symptoms(Arrays.asList("Cough", "Weight loss"))
                        .complications(List.of("Lung scarring")).notes("Completed DOTS therapy")
                        .description("Infectious bacterial disease").treatment("Rifampicin, Isoniazid")
                        .isChronic(false).isHereditary(false).familyHistory("None").build(),

                DiseaseHistory.builder().patientId(PATIENT_ID).diseaseName("Chickenpox").diseaseCode("B01")
                        .diagnosisDate(LocalDate.of(2005, 3, 5)).recoveryDate(LocalDate.of(2005, 3, 20))
                        .status("Recovered").severity("Mild").diagnosedBy("Dr. Mukherjee")
                        .treatmentPlan("Symptomatic treatment").symptoms(Arrays.asList("Rash", "Fever"))
                        .notes("No complications").description("Viral infection caused by varicella-zoster virus")
                        .treatment("Antihistamines, rest").isChronic(false).isHereditary(false).familyHistory("None")
                        .build(),

                DiseaseHistory.builder().patientId(PATIENT_ID).diseaseName("Allergic Rhinitis").diseaseCode("J30")
                        .diagnosisDate(LocalDate.of(2022, 9, 11)).status("Active").severity("Mild")
                        .diagnosedBy("Dr. Roy").treatmentPlan("Antihistamines, avoid allergens")
                        .symptoms(Arrays.asList("Runny nose", "Sneezing"))
                        .notes("Triggered during spring season").description("Allergic reaction causing nasal symptoms")
                        .treatment("Cetirizine").isChronic(false).isHereditary(true).familyHistory("Mother has allergy")
                        .build()
        ));

        diseaseHistoryRepository.saveAll(histories);
    }
}

