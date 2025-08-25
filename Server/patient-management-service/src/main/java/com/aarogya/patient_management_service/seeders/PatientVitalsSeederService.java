package com.aarogya.patient_management_service.seeders;

import com.aarogya.patient_management_service.model.PatientVitals;
import com.aarogya.patient_management_service.repository.PatientVitalsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class PatientVitalsSeederService {

    private final PatientVitalsRepository patientVitalsRepository;

    public void seedVitals() {
        patientVitalsRepository.deleteAll();

        PatientVitals vitals = PatientVitals.builder()
                .patientId("68a80e1b0474d478779e5c6c")
                .appointmentId("APPT1001")
                .bloodPressureSystolic(120)
                .bloodPressureDiastolic(80)
                .heartRate(76)
                .temperature(36.8)
                .respiratoryRate(18)
                .oxygenSaturation(98)
                .weight(70.5)
                .height(1.75)
                .bmi(23.0)
                .healthStatus("Normal")
                .notes("Routine check-up, vitals within normal range")
                .recordedBy("Dr. Emily Carter")
                .recordedByType("DOCTOR")
                .recordedAt(LocalDateTime.now().minusDays(1))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        patientVitalsRepository.save(vitals);
    }
}
