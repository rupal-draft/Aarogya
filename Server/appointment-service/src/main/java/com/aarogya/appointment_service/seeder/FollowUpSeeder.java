package com.aarogya.appointment_service.seeder;

import com.aarogya.appointment_service.enums.FollowUpStatus;
import com.aarogya.appointment_service.models.Appointment;
import com.aarogya.appointment_service.models.FollowUp;
import com.aarogya.appointment_service.repository.AppointmentRepository;
import com.aarogya.appointment_service.repository.FollowUpRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
@Order(2)
public class FollowUpSeeder implements CommandLineRunner {

    private final FollowUpRepository followUpRepository;
    private final AppointmentRepository appointmentRepository;

    private static final String DOCTOR_ID = "68eea17f83aa7469053351d5";
    private static final List<String> PATIENT_IDS = List.of(
            "68ee9fe183aa7469053351d1",
            "68eea0c583aa7469053351d2",
            "68eea0d183aa7469053351d3",
            "68eea0d983aa7469053351d4"
    );

    @Override
    public void run(String... args) {
        if (followUpRepository.count() == 0) {
            List<FollowUp> followUps = new ArrayList<>();
            LocalDate today = LocalDate.now();
            List<String> APPOINTMENT_IDS = appointmentRepository
                    .findTop8ByOrderByIdAsc()
                    .stream()
                    .map(Appointment::getId)
                    .toList();
            followUps.add(FollowUp.builder()
                    .originalAppointmentId(APPOINTMENT_IDS.get(0))
                    .doctorId(DOCTOR_ID)
                    .patientId(PATIENT_IDS.get(0))
                    .recommendedDate(today.plusDays(3))
                    .reason("Monitor recovery progress")
                    .status(FollowUpStatus.PENDING)
                    .notes("Patient needs to return for checkup after antibiotics")
                    .urgencyLevel(2)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .completedAt(null)
                    .completedBy("")
                    .cancellationReason("")
                    .build());

            followUps.add(FollowUp.builder()
                    .originalAppointmentId(APPOINTMENT_IDS.get(1))
                    .doctorId(DOCTOR_ID)
                    .patientId(PATIENT_IDS.get(1))
                    .recommendedDate(today.plusDays(5))
                    .reason("Blood test review")
                    .status(FollowUpStatus.SCHEDULED)
                    .notes("Discuss test results and plan further treatment")
                    .urgencyLevel(3)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .completedAt(null)
                    .completedBy("")
                    .cancellationReason("")
                    .build());

            followUps.add(FollowUp.builder()
                    .originalAppointmentId(APPOINTMENT_IDS.get(2))
                    .doctorId(DOCTOR_ID)
                    .patientId(PATIENT_IDS.get(2))
                    .recommendedDate(today.plusDays(7))
                    .reason("Check wound healing")
                    .status(FollowUpStatus.COMPLETED)
                    .notes("Wound requires observation, possible dressing change")
                    .urgencyLevel(4)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .completedAt(null)
                    .completedBy("")
                    .cancellationReason("")
                    .build());

            followUps.add(FollowUp.builder()
                    .originalAppointmentId(APPOINTMENT_IDS.get(3))
                    .doctorId(DOCTOR_ID)
                    .patientId(PATIENT_IDS.get(3))
                    .recommendedDate(today.plusDays(2))
                    .reason("Medication adjustment")
                    .status(FollowUpStatus.CANCELLED)
                    .notes("Follow-up cancelled as patient switched doctor")
                    .urgencyLevel(1)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .completedAt(null)
                    .completedBy("")
                    .cancellationReason("Patient requested cancellation")
                    .build());

            followUps.add(FollowUp.builder()
                    .originalAppointmentId(APPOINTMENT_IDS.get(4))
                    .doctorId(DOCTOR_ID)
                    .patientId(PATIENT_IDS.get(0))
                    .recommendedDate(today.plusDays(10))
                    .reason("Routine monitoring")
                    .status(FollowUpStatus.SCHEDULED)
                    .notes("Routine follow-up for chronic condition")
                    .urgencyLevel(2)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .completedAt(null)
                    .completedBy("")
                    .cancellationReason("")
                    .build());

            followUps.add(FollowUp.builder()
                    .originalAppointmentId(APPOINTMENT_IDS.get(5))
                    .doctorId(DOCTOR_ID)
                    .patientId(PATIENT_IDS.get(1))
                    .recommendedDate(today.plusDays(6))
                    .reason("Re-evaluate treatment plan")
                    .status(FollowUpStatus.COMPLETED)
                    .notes("Treatment effective, patient discharged")
                    .urgencyLevel(3)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .completedAt(LocalDateTime.now())
                    .completedBy("Doctor A")
                    .cancellationReason("")
                    .build());

            followUps.add(FollowUp.builder()
                    .originalAppointmentId(APPOINTMENT_IDS.get(6))
                    .doctorId(DOCTOR_ID)
                    .patientId(PATIENT_IDS.get(2))
                    .recommendedDate(today.plusDays(8))
                    .reason("Dietary counseling")
                    .status(FollowUpStatus.CANCELLED)
                    .notes("Rejected due to overlapping schedule")
                    .urgencyLevel(1)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .completedAt(null)
                    .completedBy("")
                    .cancellationReason("Doctor unavailable")
                    .build());

            followUps.add(FollowUp.builder()
                    .originalAppointmentId(APPOINTMENT_IDS.get(7))
                    .doctorId(DOCTOR_ID)
                    .patientId(PATIENT_IDS.get(3))
                    .recommendedDate(today.plusDays(4))
                    .reason("Mental health evaluation")
                    .status(FollowUpStatus.PENDING)
                    .notes("Patient needs counseling session")
                    .urgencyLevel(5)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .completedAt(null)
                    .completedBy("")
                    .cancellationReason("")
                    .build());

            followUpRepository.saveAll(followUps);
            log.info("Seeded {} follow-ups into the database", followUps.size());
        }
    }
}
