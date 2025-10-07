package com.aarogya.patient_management_service.service.implementations;

import com.aarogya.patient_management_service.auth.UserContextHolder;
import com.aarogya.patient_management_service.clients.UserGrpcClient;
import com.aarogya.patient_management_service.dto.response.*;
import com.aarogya.patient_management_service.exceptions.ResourceNotFoundException;
import com.aarogya.patient_management_service.service.PatientManagementDashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.LimitOperation;
import org.springframework.data.mongodb.core.aggregation.MatchOperation;
import org.springframework.data.mongodb.core.aggregation.SortOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PatientManagementDashboardServiceImpl implements PatientManagementDashboardService {

    private final MongoTemplate mongoTemplate;
    private final UserGrpcClient userGrpcClient;

    private static final int RECENT_NOTES_LIMIT = 10;
    private static final int ACTIVE_MED_LIMIT = 50;
    private static final int RECENT_SYMPTOMS_LIMIT = 20;

    @Override
    @Cacheable(cacheNames = "patientDashboard", key = "#patientId")
    public PatientDashboardResponseDTO getPatientDashboard(String patientId) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Doctor {} requested dashboard for patient {}", doctorId, patientId);

        PatientResponseDTO grpcPatient = userGrpcClient.getPatient(patientId);
        if (grpcPatient == null || grpcPatient.getId() == null) {
            log.warn("Patient {} not found in auth service", patientId);
            throw new ResourceNotFoundException("Patient not found");
        }

        LatestVitalsDTO latestVitals = fetchLatestVitals(patientId);

        List<ActiveMedicationDTO> activeMeds = fetchActiveMedications(patientId);

        List<RecentDoctorNoteDTO> recentNotes = fetchRecentDoctorNotes(patientId, doctorId);

        List<DiseaseSummaryDTO> diseases = fetchDiseaseSummary(patientId);

        List<AllergyDTO> allergies = fetchAllergies(patientId);

        List<HealthGoalDTO> healthGoals = fetchHealthGoals(patientId);

        EmergencyContactDTO emergencyContact = fetchPrimaryEmergencyContact(patientId);

        List<SymptomDTO> symptoms = fetchRecentSymptoms(patientId);

        List<MedicalHistoryDTO> medicalHistory = fetchMedicalHistory(patientId);

        PatientDashboardResponseDTO response = PatientDashboardResponseDTO.builder()
                .patient(grpcPatient)
                .latestVitals(latestVitals)
                .activeMedications(CollectionUtils.isEmpty(activeMeds) ? null : activeMeds)
                .recentDoctorNotes(CollectionUtils.isEmpty(recentNotes) ? null : recentNotes)
                .diseases(CollectionUtils.isEmpty(diseases) ? null : diseases)
                .allergies(CollectionUtils.isEmpty(allergies) ? null : allergies)
                .healthGoals(CollectionUtils.isEmpty(healthGoals) ? null : healthGoals)
                .primaryEmergencyContact(emergencyContact)
                .recentSymptoms(CollectionUtils.isEmpty(symptoms) ? null : symptoms)
                .medicalHistory(CollectionUtils.isEmpty(medicalHistory) ? null : medicalHistory)
                .build();

        log.debug("Built dashboard response for patient {} (size fields: meds={}, notes={}, diseases={})",
                patientId,
                activeMeds.size(),
                recentNotes.size(),
                diseases.size());

        return response;
    }

    private LatestVitalsDTO fetchLatestVitals(String patientId) {
        try {
            MatchOperation match = match(Criteria.where("patientId").is(patientId));
            SortOperation sort = sort(Sort.by(Sort.Direction.DESC, "recordedAt"));
            LimitOperation limit = limit(1);
            Aggregation agg = newAggregation(match, sort, limit);
            Document doc = mongoTemplate.aggregate(agg, "patient_vitals", Document.class)
                    .getUniqueMappedResult();
            if (doc == null) return null;

            return LatestVitalsDTO.builder()
                    .recordedAt( optToLocalDateTime(doc.get("recordedAt")) )
                    .bloodPressureSystolic(asIntegerSafe(doc.get("bloodPressureSystolic")))
                    .bloodPressureDiastolic(asIntegerSafe(doc.get("bloodPressureDiastolic")))
                    .heartRate(asIntegerSafe(doc.get("heartRate")))
                    .temperature(asDoubleSafe(doc.get("temperature")))
                    .respiratoryRate(asIntegerSafe(doc.get("respiratoryRate")))
                    .oxygenSaturation(asIntegerSafe(doc.get("oxygenSaturation")))
                    .weight(asDoubleSafe(doc.get("weight")))
                    .height(asDoubleSafe(doc.get("height")))
                    .bmi(asDoubleSafe(doc.get("bmi")))
                    .recordedBy(asStringSafe(doc.get("recordedBy")))
                    .recordedByType(asStringSafe(doc.get("recordedByType")))
                    .notes(asStringSafe(doc.get("notes")))
                    .build();
        } catch (DataAccessException ex) {
            log.error("Error fetching latest vitals for {}: {}", patientId, ex.getMessage(), ex);
            return null;
        }
    }

    private List<ActiveMedicationDTO> fetchActiveMedications(String patientId) {
        try {
            // match active status and patientId and (endDate null or > now)
            Date now = new Date();
            MatchOperation match = match(new Criteria().andOperator(
                    Criteria.where("patientId").is(patientId),
                    Criteria.where("status").in("ACTIVE", "COMPLETED"),
                    new Criteria().orOperator(
                            Criteria.where("endDate").exists(false),
                            Criteria.where("endDate").gt(now)
                    )
            ));
            SortOperation sort = sort(Sort.by(Sort.Direction.DESC, "startDate"));
            LimitOperation limit = limit(ACTIVE_MED_LIMIT);
            Aggregation agg = newAggregation(match, sort, limit,
                    project("id", "medicationName", "dosage", "dosageUnit", "frequency", "route",
                            "startDate", "endDate", "prescribedBy", "status", "reminderEnabled", "instructions")
            );
            return mongoTemplate.aggregate(agg, "patient_medications", Document.class)
                    .getMappedResults()
                    .stream()
                    .map(d -> ActiveMedicationDTO.builder()
                            .id(asStringSafe(d.get("_id") != null ? d.get("_id").toString() : d.get("id")))
                            .medicationName(asStringSafe(d.get("medicationName")))
                            .dosage(asBigDecimalSafe(d.get("dosage")))
                            .dosageUnit(asStringSafe(d.get("dosageUnit")))
                            .frequency(asStringSafe(d.get("frequency")))
                            .route(asStringSafe(d.get("route")))
                            .startDate(optToLocalDate(d.get("startDate")))
                            .endDate(optToLocalDate(d.get("endDate")))
                            .prescribedBy(asStringSafe(d.get("prescribedBy")))
                            .status(asStringSafe(d.get("status")))
                            .reminderEnabled(asBooleanSafe(d.get("reminderEnabled")))
                            .instructions(asStringSafe(d.get("instructions")))
                            .build()
                    ).collect(Collectors.toList());
        } catch (Exception ex) {
            log.error("Error fetching active medications for {}: {}", patientId, ex.getMessage(), ex);
            return Collections.emptyList();
        }
    }

    private List<RecentDoctorNoteDTO> fetchRecentDoctorNotes(String patientId, String doctorId) {
        try {
            MatchOperation match = match(Criteria.where("patientId").is(patientId));
            SortOperation sort = sort(Sort.by(Sort.Direction.DESC, "createdAt"));
            LimitOperation limit = limit(RECENT_NOTES_LIMIT);

            Aggregation agg = newAggregation(match, sort, limit,
                    project("id", "doctorId", "doctorName", "noteType", "title", "content", "priority", "isPrivate", "isUrgent", "createdAt")
            );

            List<Document> docs = mongoTemplate.aggregate(agg, "doctor_notes", Document.class).getMappedResults();
            if (docs.isEmpty()) return Collections.emptyList();

            List<RecentDoctorNoteDTO> mapped = new ArrayList<>();
            for (Document d : docs) {
                Boolean isPrivate = asBooleanSafe(d.get("isPrivate"));
                String noteDoctorId = asStringSafe(d.get("doctorId"));
                if (Boolean.TRUE.equals(isPrivate) && (noteDoctorId == null || !noteDoctorId.equals(doctorId))) {
                    continue;
                }
                mapped.add(RecentDoctorNoteDTO.builder()
                        .id(asStringSafe(d.get("_id") != null ? d.get("_id").toString() : d.get("id")))
                        .doctorId(noteDoctorId)
                        .doctorName(asStringSafe(d.get("doctorName")))
                        .noteType(asStringSafe(d.get("noteType")))
                        .title(asStringSafe(d.get("title")))
                        .content(asStringSafe(d.get("content")))
                        .priority(asStringSafe(d.get("priority")))
                        .isPrivate(isPrivate)
                        .isUrgent(asBooleanSafe(d.get("isUrgent")))
                        .createdAt(optToLocalDateTime(d.get("createdAt")))
                        .build());
            }
            return mapped;
        } catch (Exception ex) {
            log.error("Error fetching doctor notes for {}: {}", patientId, ex.getMessage(), ex);
            return Collections.emptyList();
        }
    }

    private List<DiseaseSummaryDTO> fetchDiseaseSummary(String patientId) {
        try {
            MatchOperation match = match(Criteria.where("patientId").is(patientId));
            SortOperation sort = sort(Sort.by(Sort.Direction.DESC, "diagnosisDate"));
            Aggregation agg = newAggregation(match, sort,
                    project("_id","diseaseName", "diseaseCode", "diagnosisDate", "recoveryDate", "status", "severity", "isChronic")
            );
            return mongoTemplate.aggregate(agg, "disease_history", Document.class)
                    .getMappedResults().stream().map(d ->
                            DiseaseSummaryDTO.builder()
                                    .id(asStringSafe(d.get("_id") != null ? d.get("_id").toString() : null))
                                    .diseaseName(asStringSafe(d.get("diseaseName")))
                                    .diseaseCode(asStringSafe(d.get("diseaseCode")))
                                    .diagnosisDate(optToLocalDate(d.get("diagnosisDate")))
                                    .recoveryDate(optToLocalDate(d.get("recoveryDate")))
                                    .status(asStringSafe(d.get("status")))
                                    .severity(asStringSafe(d.get("severity")))
                                    .isChronic(asBooleanSafe(d.get("isChronic")))
                                    .build()
                    ).collect(Collectors.toList());
        } catch (Exception ex) {
            log.error("Error fetching disease history {}: {}", patientId, ex.getMessage(), ex);
            return Collections.emptyList();
        }
    }

    private List<AllergyDTO> fetchAllergies(String patientId) {
        try {
            MatchOperation match = match(Criteria.where("patientId").is(patientId));
            Aggregation agg = newAggregation(match,
                    project("_id", "allergen", "allergyType", "severity", "diagnosedDate", "reaction", "emergencyAction", "isActive")
            );
            return mongoTemplate.aggregate(agg, "patient_allergies", Document.class)
                    .getMappedResults().stream().map(d ->
                            AllergyDTO.builder()
                                    .id(asStringSafe(d.get("_id") != null ? d.get("_id").toString() : null))
                                    .allergen(asStringSafe(d.get("allergen")))
                                    .allergyType(asStringSafe(d.get("allergyType")))
                                    .severity(asStringSafe(d.get("severity")))
                                    .diagnosedDate(optToLocalDate(d.get("diagnosedDate")))
                                    .reaction(asStringSafe(d.get("reaction")))
                                    .emergencyAction(asStringSafe(d.get("emergencyAction")))
                                    .isActive(asBooleanSafe(d.get("isActive")))
                                    .build()
                    ).collect(Collectors.toList());
        } catch (Exception ex) {
            log.error("Error fetching allergies for {}: {}", patientId, ex.getMessage(), ex);
            return Collections.emptyList();
        }
    }

    private List<HealthGoalDTO> fetchHealthGoals(String patientId) {
        try {
            MatchOperation match = match(Criteria.where("patientId").is(patientId));
            SortOperation sort = sort(Sort.by(Sort.Direction.ASC, "targetDate"));
            Aggregation agg = newAggregation(match, sort,
                    project("id", "goalType", "title", "description", "targetValue", "currentValue", "unit", "targetDate", "status", "priority")
            );
            return mongoTemplate.aggregate(agg, "health_goals", Document.class)
                    .getMappedResults().stream().map(d ->
                            HealthGoalDTO.builder()
                                    .id(asStringSafe(d.get("_id") != null ? d.get("_id").toString() : asStringSafe(d.get("id"))))
                                    .goalType(asStringSafe(d.get("goalType")))
                                    .title(asStringSafe(d.get("title")))
                                    .description(asStringSafe(d.get("description")))
                                    .targetValue(asBigDecimalSafe(d.get("targetValue")))
                                    .currentValue(asBigDecimalSafe(d.get("currentValue")))
                                    .unit(asStringSafe(d.get("unit")))
                                    .targetDate(optToLocalDate(d.get("targetDate")))
                                    .status(asStringSafe(d.get("status")))
                                    .priority(asStringSafe(d.get("priority")))
                                    .build()
                    ).collect(Collectors.toList());
        } catch (Exception ex) {
            log.error("Error fetching health goals for {}: {}", patientId, ex.getMessage(), ex);
            return Collections.emptyList();
        }
    }

    private EmergencyContactDTO fetchPrimaryEmergencyContact(String patientId) {
        try {
            MatchOperation match = match(new Criteria().andOperator(
                    Criteria.where("patientId").is(patientId),
                    Criteria.where("isActive").is(true),
                    Criteria.where("isPrimary").is(true)
            ));
            LimitOperation limit = limit(1);
            Aggregation agg = newAggregation(match, limit,
                    project("_id","contactName", "relationship", "phoneNumber", "secondaryPhone", "email", "address", "isPrimary", "isActive")
            );
            Document d = mongoTemplate.aggregate(agg, "emergency_contacts", Document.class).getUniqueMappedResult();
            if (d == null) {
                Aggregation fallback = newAggregation(match(Criteria.where("patientId").is(patientId).and("isActive").is(true)),
                        sort(Sort.by(Sort.Direction.DESC, "createdAt")), limit(1),
                        project("_id","contactName", "relationship", "phoneNumber", "secondaryPhone", "email", "address", "isPrimary", "isActive")
                );
                d = mongoTemplate.aggregate(fallback, "emergency_contacts", Document.class).getUniqueMappedResult();
            }
            if (d == null) return null;
            return EmergencyContactDTO.builder()
                    .id(asStringSafe(d.get("_id") != null ? d.get("_id").toString() : null))
                    .contactName(asStringSafe(d.get("contactName")))
                    .relationship(asStringSafe(d.get("relationship")))
                    .phoneNumber(asStringSafe(d.get("phoneNumber")))
                    .secondaryPhone(asStringSafe(d.get("secondaryPhone")))
                    .email(asStringSafe(d.get("email")))
                    .address(asStringSafe(d.get("address")))
                    .isPrimary(asBooleanSafe(d.get("isPrimary")))
                    .isActive(asBooleanSafe(d.get("isActive")))
                    .build();
        } catch (Exception ex) {
            log.error("Error fetching emergency contact for {}: {}", patientId, ex.getMessage(), ex);
            return null;
        }
    }

    private List<SymptomDTO> fetchRecentSymptoms(String patientId) {
        try {
            MatchOperation match = match(Criteria.where("patientId").is(patientId));
            SortOperation sort = sort(Sort.by(Sort.Direction.DESC, "recordedAt"));
            LimitOperation limit = limit(RECENT_SYMPTOMS_LIMIT);
            Aggregation agg = newAggregation(match, sort, limit,
                    project("_id","symptomName", "severity", "description", "duration", "frequency", "recordedAt")
            );
            return mongoTemplate.aggregate(agg, "symptom_tracker", Document.class)
                    .getMappedResults().stream().map(d ->
                            SymptomDTO.builder()
                                    .id(asStringSafe(d.get("_id") != null ? d.get("_id").toString() : null))
                                    .symptomName(asStringSafe(d.get("symptomName")))
                                    .severity(asIntegerSafe(d.get("severity")))
                                    .description(asStringSafe(d.get("description")))
                                    .duration(asStringSafe(d.get("duration")))
                                    .frequency(asStringSafe(d.get("frequency")))
                                    .recordedAt(optToLocalDateTime(d.get("recordedAt")))
                                    .build()
                    ).collect(Collectors.toList());
        } catch (Exception ex) {
            log.error("Error fetching symptoms for {}: {}", patientId, ex.getMessage(), ex);
            return Collections.emptyList();
        }
    }

    private List<MedicalHistoryDTO> fetchMedicalHistory(String patientId) {
        try {
            MatchOperation match = match(Criteria.where("patientId").is(patientId));
            SortOperation sort = sort(Sort.by(Sort.Direction.DESC, "diagnosisDate"));
            Aggregation agg = newAggregation(match, sort,
                    project("_id","conditionName", "diagnosisDate", "status", "severity", "notes", "category")
            );
            return mongoTemplate.aggregate(agg, "medical_history", Document.class)
                    .getMappedResults().stream().map(d ->
                            MedicalHistoryDTO.builder()
                                    .id(asStringSafe(d.get("_id") != null ? d.get("_id").toString() : null))
                                    .conditionName(asStringSafe(d.get("conditionName")))
                                    .diagnosisDate(optToLocalDate(d.get("diagnosisDate")))
                                    .status(asStringSafe(d.get("status")))
                                    .severity(asStringSafe(d.get("severity")))
                                    .notes(asStringSafe(d.get("notes")))
                                    .category(asStringSafe(d.get("category")))
                                    .build()
                    ).collect(Collectors.toList());
        } catch (Exception ex) {
            log.error("Error fetching medical history for {}: {}", patientId, ex.getMessage(), ex);
            return Collections.emptyList();
        }
    }

    private String asStringSafe(Object obj) {
        if (obj == null) return null;
        return obj.toString();
    }

    private Integer asIntegerSafe(Object obj) {
        if (obj == null) return null;
        if (obj instanceof Number) return ((Number) obj).intValue();
        try { return Integer.parseInt(obj.toString()); } catch (NumberFormatException ex) { return null; }
    }

    private Double asDoubleSafe(Object obj) {
        if (obj == null) return null;
        if (obj instanceof Number) return ((Number) obj).doubleValue();
        try { return Double.parseDouble(obj.toString()); } catch (NumberFormatException ex) { return null; }
    }

    private Boolean asBooleanSafe(Object obj) {
        if (obj == null) return null;
        if (obj instanceof Boolean) return (Boolean) obj;
        return Boolean.valueOf(obj.toString());
    }

    private java.math.BigDecimal asBigDecimalSafe(Object obj) {
        if (obj == null) return null;
        try {
            if (obj instanceof Number) return new java.math.BigDecimal(((Number) obj).toString());
            return new java.math.BigDecimal(obj.toString());
        } catch (Exception ex) {
            return null;
        }
    }

    private java.time.LocalDate optToLocalDate(Object obj) {
        if (obj == null) return null;
        if (obj instanceof Date) {
            return ((Date) obj).toInstant().atZone(ZoneOffset.UTC).toLocalDate();
        }
        try {
            return java.time.LocalDate.parse(obj.toString());
        } catch (Exception ex) {
            return null;
        }
    }

    private java.time.LocalDateTime optToLocalDateTime(Object obj) {
        if (obj == null) return null;
        if (obj instanceof Date) {
            return ((Date) obj).toInstant().atZone(ZoneOffset.UTC).toLocalDateTime();
        }
        try {
            return java.time.LocalDateTime.parse(obj.toString());
        } catch (Exception ex) {
            return null;
        }
    }
}
