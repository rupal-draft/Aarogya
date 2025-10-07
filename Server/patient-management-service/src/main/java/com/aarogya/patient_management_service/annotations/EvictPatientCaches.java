package com.aarogya.patient_management_service.annotations;

import org.springframework.cache.annotation.CacheEvict;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@CacheEvict(
        value = {
                "patientDashboard",
                "completePatientProfile",
                "patientAllergies",
                "criticalAllergies",
                "patientMedicalHistory",
                "patientMedications",
                "patientVitals", "diseaseHistory", "activeDiseases", "chronicDiseases",
                "patientNotes", "doctorNote", "patientNotesByType", "patientNotesByPriority",
                "patientNotesByCategory", "nonPrivateNotes", "urgentNotes","patientEmergencyContacts", "primaryContact",
                "patientHealthGoals", "activeHealthGoals", "healthGoalsByType",
                "healthGoalsByPriority", "overdueHealthGoals", "healthGoalsByStatus",
                "medicalHistory", "activeMedicalHistory",
                "patientMedications", "activeMedications",
                "patientVitals", "latestVitals",
                "patientSymptoms", "symptomsByName", "symptomsBySeverity", "recentSymptoms",
                "symptomsByCategory", "severeSymptoms", "symptomStats"
        },
        key = "#patientId",
        allEntries = true
)
public @interface EvictPatientCaches {
}

