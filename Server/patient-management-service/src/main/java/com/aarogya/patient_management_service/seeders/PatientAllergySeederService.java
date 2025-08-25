package com.aarogya.patient_management_service.seeders;

import com.aarogya.patient_management_service.model.PatientAllergy;
import com.aarogya.patient_management_service.repository.PatientAllergyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PatientAllergySeederService {

    private final PatientAllergyRepository patientAllergyRepository;

    public List<PatientAllergy> seedPatientAllergies() {
        if (patientAllergyRepository.count() > 0) {
            return patientAllergyRepository.findAll();
        }

        String patientId = "68a80e1b0474d478779e5c6c";

        List<PatientAllergy> allergies = Arrays.asList(
                PatientAllergy.builder()
                        .patientId(patientId)
                        .allergen("Peanuts")
                        .allergyType("Food")
                        .severity("SEVERE")
                        .symptoms(Arrays.asList("Swelling", "Hives", "Shortness of breath"))
                        .reaction("Anaphylaxis")
                        .emergencyAction("Carry Epinephrine auto-injector")
                        .diagnosedDate(LocalDate.of(2020, 5, 12))
                        .diagnosedBy("Dr. Sharma")
                        .notes("Strict avoidance recommended")
                        .build(),

                PatientAllergy.builder()
                        .patientId(patientId)
                        .allergen("Penicillin")
                        .allergyType("Drug")
                        .severity("CRITICAL")
                        .symptoms(Arrays.asList("Rash", "Difficulty breathing"))
                        .reaction("Severe skin rash and respiratory distress")
                        .emergencyAction("Avoid all Penicillin family drugs")
                        .diagnosedDate(LocalDate.of(2018, 3, 10))
                        .diagnosedBy("Dr. Gupta")
                        .notes("Use alternatives like azithromycin")
                        .build(),

                PatientAllergy.builder()
                        .patientId(patientId)
                        .allergen("Dust Mites")
                        .allergyType("Environmental")
                        .severity("MODERATE")
                        .symptoms(Arrays.asList("Sneezing", "Cough", "Watery eyes"))
                        .reaction("Allergic rhinitis")
                        .emergencyAction("Use antihistamines and keep room dust-free")
                        .diagnosedDate(LocalDate.of(2021, 7, 19))
                        .diagnosedBy("Dr. Patel")
                        .notes("Air purifier recommended")
                        .build(),

                PatientAllergy.builder()
                        .patientId(patientId)
                        .allergen("Shellfish")
                        .allergyType("Food")
                        .severity("SEVERE")
                        .symptoms(Arrays.asList("Swelling", "Vomiting", "Hives"))
                        .reaction("Anaphylaxis")
                        .emergencyAction("Immediate Epinephrine injection")
                        .diagnosedDate(LocalDate.of(2019, 8, 22))
                        .diagnosedBy("Dr. Mehta")
                        .notes("Avoid shrimp, crab, lobster")
                        .build(),

                PatientAllergy.builder()
                        .patientId(patientId)
                        .allergen("Bee Stings")
                        .allergyType("Insect")
                        .severity("CRITICAL")
                        .symptoms(Arrays.asList("Severe swelling", "Difficulty breathing"))
                        .reaction("Anaphylactic shock")
                        .emergencyAction("Carry Epinephrine auto-injector")
                        .diagnosedDate(LocalDate.of(2017, 4, 30))
                        .diagnosedBy("Dr. Reddy")
                        .notes("Patient enrolled in venom immunotherapy")
                        .build()
        );

        return patientAllergyRepository.saveAll(allergies);
    }
}
