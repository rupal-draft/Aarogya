package com.aarogya.patient_management_service.seeders.services;

import com.aarogya.patient_management_service.model.DoctorNote;
import com.aarogya.patient_management_service.repository.DoctorNoteRepository;
import com.aarogya.patient_management_service.seeders.SeederService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DoctorNoteSeederService implements SeederService {

    private final DoctorNoteRepository doctorNoteRepository;

    private static final String DOCTOR_ID = "68a810b60474d478779e5c6d";

    @Override
    public void seed(String PATIENT_ID) {
        if (doctorNoteRepository.count() > 0) {
            doctorNoteRepository.findAll();
            return;
        }

        List<DoctorNote> notes = new ArrayList<>();

        notes.add(DoctorNote.builder()
                .patientId(PATIENT_ID)
                .doctorId(DOCTOR_ID)
                .doctorName("Dr. A. Sharma")
                .appointmentId("APPT-1001")
                .noteType("Consultation")
                .title("Follow-up for Hypertension")
                .content("Patient blood pressure is stable. Continue current medication and lifestyle changes.")
                .category("General Medicine")
                .priority("High")
                .isPrivate(true)
                .isUrgent(false)
                .build());

        notes.add(DoctorNote.builder()
                .patientId(PATIENT_ID)
                .doctorId(DOCTOR_ID)
                .doctorName("Dr. A. Sharma")
                .appointmentId("APPT-1002")
                .noteType("Prescription")
                .title("Diabetes Management Plan")
                .content("Started insulin therapy. Monitor glucose levels daily and report next week.")
                .category("Endocrinology")
                .priority("Critical")
                .isPrivate(false)
                .isUrgent(true)
                .build());

        notes.add(DoctorNote.builder()
                .patientId(PATIENT_ID)
                .doctorId(DOCTOR_ID)
                .doctorName("Dr. A. Sharma")
                .appointmentId("APPT-1003")
                .noteType("Observation")
                .title("Asthma Condition Review")
                .content("Mild wheezing observed. Prescribed inhaler for emergency use.")
                .category("Pulmonology")
                .priority("Medium")
                .isPrivate(true)
                .isUrgent(false)
                .build());

        notes.add(DoctorNote.builder()
                .patientId(PATIENT_ID)
                .doctorId(DOCTOR_ID)
                .doctorName("Dr. A. Sharma")
                .appointmentId("APPT-1004")
                .noteType("Consultation")
                .title("Post-COVID Check-up")
                .content("Patient reports fatigue. Suggested vitamin supplements and regular exercise.")
                .category("General Medicine")
                .priority("Medium")
                .isPrivate(false)
                .isUrgent(false)
                .build());

        notes.add(DoctorNote.builder()
                .patientId(PATIENT_ID)
                .doctorId(DOCTOR_ID)
                .doctorName("Dr. A. Sharma")
                .appointmentId("APPT-1005")
                .noteType("Emergency Note")
                .title("Severe Migraine Episode")
                .content("Patient admitted with severe headache. Prescribed sumatriptan and observation.")
                .category("Neurology")
                .priority("Critical")
                .isPrivate(true)
                .isUrgent(true)
                .build());

        // More dummy notes
        notes.addAll(Arrays.asList(
                DoctorNote.builder().patientId(PATIENT_ID).doctorId(DOCTOR_ID).doctorName("Dr. A. Sharma")
                        .appointmentId("APPT-1006").noteType("Prescription").title("Tuberculosis Treatment Follow-up")
                        .content("Patient completed 3 months of therapy. Continue medication for 3 more months.")
                        .category("Infectious Diseases").priority("High").isPrivate(true).isUrgent(false).build(),

                DoctorNote.builder().patientId(PATIENT_ID).doctorId(DOCTOR_ID).doctorName("Dr. A. Sharma")
                        .appointmentId("APPT-1007").noteType("Observation").title("Allergy Checkup")
                        .content("Patient has seasonal allergies. Recommended antihistamines and pollen avoidance.")
                        .category("Allergy & Immunology").priority("Low").isPrivate(false).isUrgent(false).build(),

                DoctorNote.builder().patientId(PATIENT_ID).doctorId(DOCTOR_ID).doctorName("Dr. A. Sharma")
                        .appointmentId("APPT-1008").noteType("Consultation").title("Routine Health Check")
                        .content("Overall health stable. Suggested regular exercise and balanced diet.")
                        .category("Preventive Care").priority("Medium").isPrivate(false).isUrgent(false).build(),

                DoctorNote.builder().patientId(PATIENT_ID).doctorId(DOCTOR_ID).doctorName("Dr. A. Sharma")
                        .appointmentId("APPT-1009").noteType("Emergency Note").title("Acute Chest Pain")
                        .content("Referred to cardiology. Suspected angina. ECG advised immediately.")
                        .category("Cardiology").priority("Critical").isPrivate(true).isUrgent(true).build(),

                DoctorNote.builder().patientId(PATIENT_ID).doctorId(DOCTOR_ID).doctorName("Dr. A. Sharma")
                        .appointmentId("APPT-1010").noteType("Prescription").title("Anemia Treatment Plan")
                        .content("Started iron supplements. Follow-up in 3 weeks.")
                        .category("Hematology").priority("High").isPrivate(false).isUrgent(false).build()
        ));

        doctorNoteRepository.saveAll(notes);
    }
}

