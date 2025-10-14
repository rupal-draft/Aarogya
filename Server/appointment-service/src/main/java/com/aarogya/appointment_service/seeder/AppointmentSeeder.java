package com.aarogya.appointment_service.seeder;

import com.aarogya.appointment_service.enums.AppointmentStatus;
import com.aarogya.appointment_service.enums.AppointmentType;
import com.aarogya.appointment_service.models.Appointment;
import com.aarogya.appointment_service.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
@Slf4j
@Order(1)
public class AppointmentSeeder implements CommandLineRunner {

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
        if (appointmentRepository.count() == 0) {
            Random random = new Random();
            LocalDate today = LocalDate.now();

            List<Appointment> appointments = Arrays.asList(
                    Appointment.builder()
                            .doctorId(DOCTOR_ID)
                            .patientId(PATIENT_IDS.get(0))
                            .appointmentDate(today.plusDays(1))
                            .startTime(LocalTime.of(10, 0))
                            .endTime(LocalTime.of(10, 30))
                            .status(AppointmentStatus.PENDING)
                            .type(AppointmentType.REGULAR)
                            .reason("General checkup")
                            .symptoms(List.of("Headache", "Fever"))
                            .notes("Patient reported mild symptoms")
                            .doctorNotes("Prescribe paracetamol")
                            .paymentId("Not paid yet")
                            .priority(1)
                            .meetingLink("https://meet.example.com/appointment1")
                            .isVirtual(true)
                            .cancellationReason("")
                            .createdAt(LocalDateTime.now())
                            .updatedAt(LocalDateTime.now())
                            .build(),

                    Appointment.builder()
                            .doctorId(DOCTOR_ID)
                            .patientId(PATIENT_IDS.get(1))
                            .appointmentDate(today.plusDays(2))
                            .startTime(LocalTime.of(11, 0))
                            .endTime(LocalTime.of(11, 30))
                            .status(AppointmentStatus.APPROVED)
                            .type(AppointmentType.FOLLOW_UP)
                            .reason("Follow-up for diabetes")
                            .symptoms(List.of("Fatigue"))
                            .notes("Patient needs sugar level monitoring")
                            .doctorNotes("Continue medication")
                            .paymentId("PAY123456")
                            .priority(2)
                            .meetingLink("https://meet.example.com/appointment2")
                            .isVirtual(false)
                            .cancellationReason("")
                            .createdAt(LocalDateTime.now())
                            .updatedAt(LocalDateTime.now())
                            .build(),

                    Appointment.builder()
                            .doctorId(DOCTOR_ID)
                            .patientId(PATIENT_IDS.get(2))
                            .appointmentDate(today.plusDays(3))
                            .startTime(LocalTime.of(9, 0))
                            .endTime(LocalTime.of(9, 30))
                            .status(AppointmentStatus.CANCELLED)
                            .type(AppointmentType.EMERGENCY)
                            .reason("Severe stomach pain")
                            .symptoms(List.of("Nausea", "Vomiting"))
                            .notes("Emergency appointment requested")
                            .doctorNotes("")
                            .paymentId("REF12345")
                            .priority(1)
                            .meetingLink("https://meet.example.com/appointment3")
                            .isVirtual(false)
                            .cancellationReason("Patient unavailable")
                            .createdAt(LocalDateTime.now())
                            .updatedAt(LocalDateTime.now())
                            .build(),

                    Appointment.builder()
                            .doctorId(DOCTOR_ID)
                            .patientId(PATIENT_IDS.get(3))
                            .appointmentDate(today.plusDays(4))
                            .startTime(LocalTime.of(14, 0))
                            .endTime(LocalTime.of(14, 30))
                            .status(AppointmentStatus.COMPLETED)
                            .type(AppointmentType.REGULAR)
                            .reason("Routine health check")
                            .symptoms(List.of("None"))
                            .notes("All vitals normal")
                            .doctorNotes("No issues found")
                            .paymentId("PAY987654")
                            .priority(1)
                            .meetingLink("https://meet.example.com/appointment4")
                            .isVirtual(true)
                            .cancellationReason("")
                            .createdAt(LocalDateTime.now())
                            .updatedAt(LocalDateTime.now())
                            .build(),
                    Appointment.builder()
                            .doctorId(DOCTOR_ID)
                            .patientId(PATIENT_IDS.get(0))
                            .appointmentDate(today.plusDays(5))
                            .startTime(LocalTime.of(15, 0))
                            .endTime(LocalTime.of(15, 45))
                            .status(AppointmentStatus.IN_PROGRESS)
                            .type(AppointmentType.CONSULTATION)
                            .reason("Back pain consultation")
                            .symptoms(List.of("Back pain", "Stiffness"))
                            .notes("Needs physiotherapy advice")
                            .doctorNotes("Recommend exercise and posture correction")
                            .paymentId("PAY654321")
                            .priority(2)
                            .meetingLink("https://meet.example.com/appointment5")
                            .isVirtual(false)
                            .cancellationReason("")
                            .createdAt(LocalDateTime.now())
                            .updatedAt(LocalDateTime.now())
                            .build(),

                    Appointment.builder()
                            .doctorId(DOCTOR_ID)
                            .patientId(PATIENT_IDS.get(1))
                            .appointmentDate(today.plusDays(6))
                            .startTime(LocalTime.of(16, 0))
                            .endTime(LocalTime.of(16, 30))
                            .status(AppointmentStatus.REJECTED)
                            .type(AppointmentType.REGULAR)
                            .reason("Diet consultation")
                            .symptoms(List.of("Obesity"))
                            .notes("Rejected due to scheduling conflict")
                            .doctorNotes("")
                            .paymentId("Not paid yet")
                            .priority(1)
                            .meetingLink("https://meet.example.com/appointment6")
                            .isVirtual(true)
                            .cancellationReason("Doctor unavailable")
                            .createdAt(LocalDateTime.now())
                            .updatedAt(LocalDateTime.now())
                            .build(),

                    Appointment.builder()
                            .doctorId(DOCTOR_ID)
                            .patientId(PATIENT_IDS.get(2))
                            .appointmentDate(today.plusDays(7))
                            .startTime(LocalTime.of(17, 0))
                            .endTime(LocalTime.of(17, 45))
                            .status(AppointmentStatus.NO_SHOW)
                            .type(AppointmentType.VIRTUAL)
                            .reason("Dermatology consultation")
                            .symptoms(List.of("Skin rash"))
                            .notes("Patient did not attend the session")
                            .doctorNotes("Reschedule if patient contacts")
                            .paymentId("PAY112233")
                            .priority(3)
                            .meetingLink("https://meet.example.com/appointment7")
                            .isVirtual(true)
                            .cancellationReason("Patient did not join")
                            .createdAt(LocalDateTime.now())
                            .updatedAt(LocalDateTime.now())
                            .build(),

                    Appointment.builder()
                            .doctorId(DOCTOR_ID)
                            .patientId(PATIENT_IDS.get(3))
                            .appointmentDate(today.plusDays(8))
                            .startTime(LocalTime.of(18, 0))
                            .endTime(LocalTime.of(18, 30))
                            .status(AppointmentStatus.APPROVED)
                            .type(AppointmentType.EMERGENCY)
                            .reason("Severe allergy")
                            .symptoms(List.of("Swelling", "Redness"))
                            .notes("Emergency approved")
                            .doctorNotes("Administer antihistamines")
                            .paymentId("PAY445566")
                            .priority(1)
                            .meetingLink("https://meet.example.com/appointment8")
                            .isVirtual(false)
                            .cancellationReason("")
                            .createdAt(LocalDateTime.now())
                            .updatedAt(LocalDateTime.now())
                            .build()
            );

            appointmentRepository.saveAll(appointments);
            log.info("Seeded {} appointments into the database", appointments.size());
        }
    }
}
