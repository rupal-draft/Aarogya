package com.aarogya.patient_management_service.service.implementations;

import com.aarogya.patient_management_service.dto.response.*;
import com.aarogya.patient_management_service.exceptions.ServiceException;
import com.aarogya.patient_management_service.model.*;
import com.aarogya.patient_management_service.repository.*;
import com.aarogya.patient_management_service.service.PatientProfileDashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PatientProfileDashboardServiceImpl implements PatientProfileDashboardService {

    private final DiseaseHistoryRepository diseaseHistoryRepository;
    private final MedicalHistoryRepository medicalHistoryRepository;
    private final PatientAllergyRepository patientAllergyRepository;
    private final PatientMedicationRepository patientMedicationRepository;
    private final PatientVitalsRepository patientVitalsRepository;
    private final SymptomTrackerRepository symptomTrackerRepository;
    private final HealthGoalRepository healthGoalRepository;
    private final EmergencyContactRepository emergencyContactRepository;
    private final DoctorNoteRepository doctorNoteRepository;
    private final ModelMapper modelMapper;

    @Override
    @Cacheable(value = "completePatientProfile", key = "#patientId")
    public CompletePatientProfileResponse getCompletePatientProfile(String patientId) {
        try {
            log.info("Fetching complete patient profile for patient: {}", patientId);

            validatePatientId(patientId);

            // Execute all repository calls in parallel for better performance
            CompletableFuture<List<DiseaseHistory>> diseaseHistoryFuture = CompletableFuture.supplyAsync(() ->
                    diseaseHistoryRepository.findByPatientId(patientId));

            CompletableFuture<List<MedicalHistory>> medicalHistoryFuture = CompletableFuture.supplyAsync(() ->
                    medicalHistoryRepository.findByPatientId(patientId));

            CompletableFuture<List<PatientAllergy>> allergiesFuture = CompletableFuture.supplyAsync(() ->
                    patientAllergyRepository.findByPatientIdAndIsActiveTrue(patientId));

            CompletableFuture<List<PatientMedication>> medicationsFuture = CompletableFuture.supplyAsync(() ->
                    patientMedicationRepository.findByPatientId(patientId));

            CompletableFuture<List<PatientVitals>> vitalsFuture = CompletableFuture.supplyAsync(() ->
                    patientVitalsRepository.findTop5ByPatientIdOrderByRecordedAtDesc(patientId));

            CompletableFuture<List<SymptomTracker>> symptomsFuture = CompletableFuture.supplyAsync(() ->
                    symptomTrackerRepository.findTop10ByPatientIdOrderByRecordedAtDesc(patientId));

            CompletableFuture<List<HealthGoal>> healthGoalsFuture = CompletableFuture.supplyAsync(() ->
                    healthGoalRepository.findByPatientId(patientId));

            CompletableFuture<List<EmergencyContact>> emergencyContactsFuture = CompletableFuture.supplyAsync(() ->
                    emergencyContactRepository.findByPatientIdAndIsActiveTrue(patientId));

            CompletableFuture<List<DoctorNote>> doctorNotesFuture = CompletableFuture.supplyAsync(() ->
                    doctorNoteRepository.findTop5ByPatientIdOrderByCreatedAtDesc(patientId));

            // Wait for all futures to complete
            CompletableFuture.allOf(
                    diseaseHistoryFuture, medicalHistoryFuture, allergiesFuture, medicationsFuture,
                    vitalsFuture, symptomsFuture, healthGoalsFuture, emergencyContactsFuture, doctorNotesFuture
            ).join();

            // Get results from futures
            List<DiseaseHistory> diseaseHistory = diseaseHistoryFuture.get();
            List<MedicalHistory> medicalHistory = medicalHistoryFuture.get();
            List<PatientAllergy> allergies = allergiesFuture.get();
            List<PatientMedication> medications = medicationsFuture.get();
            List<PatientVitals> recentVitals = vitalsFuture.get();
            List<SymptomTracker> recentSymptoms = symptomsFuture.get();
            List<HealthGoal> healthGoals = healthGoalsFuture.get();
            List<EmergencyContact> emergencyContacts = emergencyContactsFuture.get();
            List<DoctorNote> doctorNotes = doctorNotesFuture.get();

            // Build the complete response
            return CompletePatientProfileResponse.builder()
                    .dashboard(buildPatientDashboard(patientId, recentVitals, medicalHistory, allergies, medications, healthGoals, doctorNotes))
                    .healthOverview(buildHealthOverview(patientId, medications, allergies, medicalHistory, recentVitals, healthGoals))
                    .diseaseHistory(mapToDiseaseHistoryResponse(diseaseHistory))
                    .medicalHistory(mapToMedicalHistoryResponse(medicalHistory))
                    .allergies(mapToPatientAllergyResponse(allergies))
                    .medications(mapToPatientMedicationResponse(medications))
                    .healthGoals(mapToHealthGoalResponse(healthGoals))
                    .emergencyContacts(mapToEmergencyContactResponse(emergencyContacts))
                    .doctorNotes(mapToDoctorNoteResponse(doctorNotes))
                    .analytics(buildHealthAnalytics(patientId, medications, recentVitals, recentSymptoms, healthGoals))
                    .statistics(buildProfileStatistics(diseaseHistory, medicalHistory, allergies, medications, recentVitals, recentSymptoms, healthGoals, emergencyContacts))
                    .symptomStatsResponse(buildSymptomStats(patientId, recentSymptoms))
                    .vitalsStats(buildVitalsStats(patientId, recentVitals))
                    .goalStats(buildGoalStats(healthGoals))
                    .build();

        } catch (InterruptedException | ExecutionException e) {
            log.error("Error fetching complete patient profile for patient: {}", patientId, e);
            Thread.currentThread().interrupt();
            throw new ServiceException("Failed to fetch complete patient profile due to execution error", e);
        } catch (DataAccessException e) {
            log.error("Database error while fetching complete patient profile for patient: {}", patientId, e);
            throw new ServiceException("Failed to fetch complete patient profile due to database error", e);
        } catch (Exception e) {
            log.error("Unexpected error while fetching complete patient profile for patient: {}", patientId, e);
            throw new ServiceException("Failed to fetch complete patient profile", e);
        }
    }

    private PatientDashboardResponse buildPatientDashboard(String patientId, List<PatientVitals> recentVitals,
                                                           List<MedicalHistory> medicalHistory, List<PatientAllergy> allergies,
                                                           List<PatientMedication> medications, List<HealthGoal> healthGoals,
                                                           List<DoctorNote> doctorNotes) {
        PatientVitalsResponse latestVitals = recentVitals.isEmpty() ?
                createDefaultVitalsResponse(patientId) :
                mapToPatientVitalsResponse(List.of(recentVitals.getFirst())).getFirst();

        return PatientDashboardResponse.builder()
                .latestVitals(latestVitals)
                .activeMedicalConditions(mapToMedicalHistoryResponse(
                        medicalHistory.stream()
                                .filter(mh -> "Active".equalsIgnoreCase(mh.getStatus()))
                                .collect(Collectors.toList())
                ))
                .criticalAllergies(mapToPatientAllergyResponse(
                        allergies.stream()
                                .filter(a -> Arrays.asList("SEVERE", "CRITICAL").contains(a.getSeverity().toUpperCase()))
                                .collect(Collectors.toList())
                ))
                .activeMedications(mapToPatientMedicationResponse(
                        medications.stream()
                                .filter(m -> "ACTIVE".equalsIgnoreCase(m.getStatus()))
                                .collect(Collectors.toList())
                ))
                .activeGoals(mapToHealthGoalResponse(
                        healthGoals.stream()
                                .filter(g -> "ACTIVE".equalsIgnoreCase(g.getStatus()))
                                .collect(Collectors.toList())
                ))
                .recentDoctorNotes(mapToDoctorNoteResponse(doctorNotes))
                .healthSummary(buildPatientHealthSummary(medicalHistory, allergies, medications, healthGoals))
                .build();
    }

    private PatientDashboardResponse.PatientHealthSummary buildPatientHealthSummary(
            List<MedicalHistory> medicalHistory, List<PatientAllergy> allergies,
            List<PatientMedication> medications, List<HealthGoal> healthGoals) {

        return PatientDashboardResponse.PatientHealthSummary.builder()
                .totalMedicalConditions(medicalHistory.size())
                .totalAllergies(allergies.size())
                .activeMedications((int) medications.stream()
                        .filter(m -> "ACTIVE".equalsIgnoreCase(m.getStatus()))
                        .count())
                .activeGoals((int) healthGoals.stream()
                        .filter(g -> "ACTIVE".equalsIgnoreCase(g.getStatus()))
                        .count())
                .completedGoals((int) healthGoals.stream()
                        .filter(g -> "COMPLETED".equalsIgnoreCase(g.getStatus()))
                        .count())
                .overallHealthStatus(calculateOverallHealthStatus(medicalHistory, allergies, medications))
                .build();
    }

    private HealthOverviewResponse buildHealthOverview(String patientId, List<PatientMedication> medications,
                                                       List<PatientAllergy> allergies, List<MedicalHistory> medicalHistory,
                                                       List<PatientVitals> recentVitals, List<HealthGoal> healthGoals) {

        return HealthOverviewResponse.builder()
                .overallHealthStatus(calculateOverallHealthStatus(medicalHistory, allergies, medications))
                .healthScore(calculateHealthScore(medicalHistory, allergies, medications, recentVitals))
                .healthTrend(calculateHealthTrend(patientId))
                .activeMedications((int) medications.stream()
                        .filter(m -> "ACTIVE".equalsIgnoreCase(m.getStatus()))
                        .count())
                .criticalAllergies((int) allergies.stream()
                        .filter(a -> Arrays.asList("SEVERE", "CRITICAL").contains(a.getSeverity().toUpperCase()))
                        .count())
                .activeConditions((int) medicalHistory.stream()
                        .filter(mh -> "Active".equalsIgnoreCase(mh.getStatus()))
                        .count())
                .lastVitalsCheck(recentVitals.isEmpty() ? null : recentVitals.getFirst().getRecordedAt())
                .latestVitals(buildLatestVitalsStats(recentVitals))
                .healthAlerts(buildHealthAlerts(medicalHistory, allergies, medications))
                .medicationSummary(buildMedicationSummary(medications))
                .upcomingReminders(buildUpcomingReminders(medications, healthGoals))
                .goalProgress(buildGoalProgress(healthGoals))
                .build();
    }

    private HealthAnalyticsResponse buildHealthAnalytics(String patientId, List<PatientMedication> medications,
                                                         List<PatientVitals> vitals, List<SymptomTracker> symptoms,
                                                         List<HealthGoal> healthGoals) {
        return HealthAnalyticsResponse.builder()
                .patientId(patientId)
                .analysisPeriodDays(30) // Last 30 days analysis
                .overallHealthScore(calculateOverallHealthScore(vitals, symptoms))
                .healthTrend(calculateHealthTrend(patientId))
                .vitalsAnalytics(buildVitalsAnalytics(vitals))
                .medicationAnalytics(buildMedicationAnalytics(medications))
                .symptomAnalytics(buildSymptomAnalytics(symptoms))
                .goalAnalytics(buildGoalAnalytics(healthGoals))
                .healthAlerts(buildAnalyticsHealthAlerts(medications, vitals, symptoms))
                .recommendations(buildHealthRecommendations(medications, vitals, symptoms, healthGoals))
                .build();
    }

    private CompletePatientProfileResponse.ProfileStatistics buildProfileStatistics(
            List<DiseaseHistory> diseaseHistory, List<MedicalHistory> medicalHistory,
            List<PatientAllergy> allergies, List<PatientMedication> medications,
            List<PatientVitals> vitals, List<SymptomTracker> symptoms,
            List<HealthGoal> healthGoals, List<EmergencyContact> emergencyContacts) {

        return CompletePatientProfileResponse.ProfileStatistics.builder()
                .totalDiseases(diseaseHistory.size())
                .activeDiseases((int) diseaseHistory.stream()
                        .filter(dh -> "Active".equalsIgnoreCase(dh.getStatus()))
                        .count())
                .chronicDiseases((int) diseaseHistory.stream()
                        .filter(DiseaseHistory::isChronic)
                        .count())
                .totalAllergies(allergies.size())
                .criticalAllergies((int) allergies.stream()
                        .filter(a -> Arrays.asList("SEVERE", "CRITICAL").contains(a.getSeverity().toUpperCase()))
                        .count())
                .totalMedications(medications.size())
                .activeMedications((int) medications.stream()
                        .filter(m -> "ACTIVE".equalsIgnoreCase(m.getStatus()))
                        .count())
                .totalVitalsRecords(vitals.size())
                .totalSymptomRecords(symptoms.size())
                .activeGoals((int) healthGoals.stream()
                        .filter(g -> "ACTIVE".equalsIgnoreCase(g.getStatus()))
                        .count())
                .completedGoals((int) healthGoals.stream()
                        .filter(g -> "COMPLETED".equalsIgnoreCase(g.getStatus()))
                        .count())
                .emergencyContacts(emergencyContacts.size())
                .profileCompleteness(calculateProfileCompleteness(
                        diseaseHistory, medicalHistory, allergies, medications,
                        vitals, symptoms, healthGoals, emergencyContacts))
                .lastUpdated(LocalDateTime.now().toString())
                .build();
    }

    private SymptomStatsResponse buildSymptomStats(String patientId, List<SymptomTracker> symptoms) {
        List<SymptomTrackerRepository.SymptomSummary> summaries = symptomTrackerRepository.getSymptomSummary(patientId);
        List<SymptomSummaryResponse> dtoList = summaries.stream()
                .map(s -> SymptomSummaryResponse.builder()
                        .symptomName(s.getSymptomName())
                        .count(s.getCount())
                        .avgSeverity(s.getAvgSeverity())
                        .build())
                .toList();
        return SymptomStatsResponse.builder()
                .symptomSummaries(dtoList) // Would be populated from repository
                .recentSymptoms(mapToSymptomTrackerResponse(symptoms))
                .totalSymptoms(symptoms.size())
                .generatedAt(LocalDateTime.now())
                .build();
    }

    private VitalsStatsResponse buildVitalsStats(String patientId, List<PatientVitals> vitals) {
        // Implementation for vitals statistics
        return VitalsStatsResponse.builder()
                .bloodPressure(calculateVitalStats(vitals, "bloodPressure"))
                .heartRate(calculateVitalStats(vitals, "heartRate"))
                .temperature(calculateVitalStats(vitals, "temperature"))
                .oxygenSaturation(calculateVitalStats(vitals, "oxygenSaturation"))
                .weight(calculateVitalStats(vitals, "weight"))
                .overallHealthStatus(calculateVitalsHealthStatus(vitals))
                .healthTrend(calculateVitalsTrend(vitals))
                .lastRecorded(vitals.isEmpty() ? null : vitals.getFirst().getRecordedAt())
                .totalRecords(vitals.size())
                .daysAnalyzed(30)
                .build();
    }

    private HealthGoalStatsResponse buildGoalStats(List<HealthGoal> healthGoals) {
        long completed = healthGoals.stream()
                .filter(g -> "COMPLETED".equalsIgnoreCase(g.getStatus()))
                .count();
        long overdue = healthGoals.stream()
                .filter(g -> "ACTIVE".equalsIgnoreCase(g.getStatus()) &&
                        g.getTargetDate() != null &&
                        g.getTargetDate().isBefore(LocalDate.now()))
                .count();

        double completionRate = healthGoals.isEmpty() ? 0 : (completed * 100.0) / healthGoals.size();

        return HealthGoalStatsResponse.builder()
                .totalGoals(healthGoals.size())
                .activeGoals((int) healthGoals.stream()
                        .filter(g -> "ACTIVE".equalsIgnoreCase(g.getStatus()))
                        .count())
                .completedGoals((int) completed)
                .overdueGoals((int) overdue)
                .completionRate(completionRate)
                .build();
    }

    // Helper methods for mapping entities to responses
    private List<DiseaseHistoryResponse> mapToDiseaseHistoryResponse(List<DiseaseHistory> entities) {
        return entities.stream()
                .map(entity -> modelMapper.map(entity, DiseaseHistoryResponse.class))
                .collect(Collectors.toList());
    }

    private List<MedicalHistoryResponse> mapToMedicalHistoryResponse(List<MedicalHistory> entities) {
        return entities.stream()
                .map(entity -> modelMapper.map(entity, MedicalHistoryResponse.class))
                .collect(Collectors.toList());
    }

    private List<PatientAllergyResponse> mapToPatientAllergyResponse(List<PatientAllergy> entities) {
        return entities.stream()
                .map(entity -> modelMapper.map(entity, PatientAllergyResponse.class))
                .collect(Collectors.toList());
    }

    private List<PatientMedicationResponse> mapToPatientMedicationResponse(List<PatientMedication> entities) {
        return entities.stream()
                .map(entity -> modelMapper.map(entity, PatientMedicationResponse.class))
                .collect(Collectors.toList());
    }

    private List<PatientVitalsResponse> mapToPatientVitalsResponse(List<PatientVitals> entities) {
        return entities.stream()
                .map(entity -> modelMapper.map(entity, PatientVitalsResponse.class))
                .collect(Collectors.toList());
    }

    private List<SymptomTrackerResponse> mapToSymptomTrackerResponse(List<SymptomTracker> entities) {
        return entities.stream()
                .map(entity -> modelMapper.map(entity, SymptomTrackerResponse.class))
                .collect(Collectors.toList());
    }

    private List<HealthGoalResponse> mapToHealthGoalResponse(List<HealthGoal> entities) {
        return entities.stream()
                .map(entity -> modelMapper.map(entity, HealthGoalResponse.class))
                .collect(Collectors.toList());
    }

    private List<EmergencyContactResponse> mapToEmergencyContactResponse(List<EmergencyContact> entities) {
        return entities.stream()
                .map(entity -> modelMapper.map(entity, EmergencyContactResponse.class))
                .collect(Collectors.toList());
    }

    private List<DoctorNoteResponse> mapToDoctorNoteResponse(List<DoctorNote> entities) {
        return entities.stream()
                .map(entity -> modelMapper.map(entity, DoctorNoteResponse.class))
                .collect(Collectors.toList());
    }

    // Default values and fallback methods
    private PatientVitalsResponse createDefaultVitalsResponse(String patientId) {
        return PatientVitalsResponse.builder()
                .patientId(patientId)
                .bloodPressureSystolic(120)
                .bloodPressureDiastolic(80)
                .heartRate(72)
                .temperature(36.6)
                .weight(70.0)
                .height(175.0)
                .bmi(22.9)
                .healthStatus("NORMAL")
                .notes("Default vitals data")
                .recordedAt(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    // Validation
    private void validatePatientId(String patientId) {
        if (patientId == null || patientId.trim().isEmpty()) {
            throw new IllegalArgumentException("Patient ID cannot be null or empty");
        }
        if (!patientId.matches("^[a-zA-Z0-9-]+$")) {
            throw new IllegalArgumentException("Invalid patient ID format");
        }
    }

    // Calculation helper methods (simplified implementations)
    private String calculateOverallHealthStatus(List<MedicalHistory> medicalHistory,
                                                List<PatientAllergy> allergies,
                                                List<PatientMedication> medications) {
        // Simplified health status calculation
        boolean hasCritical = allergies.stream()
                .anyMatch(a -> Arrays.asList("SEVERE", "CRITICAL").contains(a.getSeverity().toUpperCase()));

        boolean hasActiveConditions = medicalHistory.stream()
                .anyMatch(mh -> "Active".equalsIgnoreCase(mh.getStatus()));

        if (hasCritical) return "CRITICAL";
        if (hasActiveConditions) return "NEEDS_ATTENTION";
        return "STABLE";
    }

    private Integer calculateHealthScore(List<MedicalHistory> medicalHistory,
                                         List<PatientAllergy> allergies,
                                         List<PatientMedication> medications,
                                         List<PatientVitals> vitals) {
        // Simplified health score calculation (0-100)
        int baseScore = 80;

        // Deduct for critical allergies
        long criticalAllergies = allergies.stream()
                .filter(a -> Arrays.asList("SEVERE", "CRITICAL").contains(a.getSeverity().toUpperCase()))
                .count();
        baseScore -= (int) (criticalAllergies * 10);

        // Deduct for active conditions
        long activeConditions = medicalHistory.stream()
                .filter(mh -> "Active".equalsIgnoreCase(mh.getStatus()))
                .count();
        baseScore -= (int) (activeConditions * 5);

        return Math.max(0, Math.min(100, baseScore));
    }

    private String calculateHealthTrend(String patientId) {
        // Simplified trend calculation
        return "STABLE";
    }

    private String calculateProfileCompleteness(List<DiseaseHistory> diseaseHistory,
                                                List<MedicalHistory> medicalHistory,
                                                List<PatientAllergy> allergies,
                                                List<PatientMedication> medications,
                                                List<PatientVitals> vitals,
                                                List<SymptomTracker> symptoms,
                                                List<HealthGoal> healthGoals,
                                                List<EmergencyContact> emergencyContacts) {
        // Calculate completeness percentage based on available data
        int totalSections = 8;
        int completedSections = 0;

        if (!diseaseHistory.isEmpty()) completedSections++;
        if (!medicalHistory.isEmpty()) completedSections++;
        if (!allergies.isEmpty()) completedSections++;
        if (!medications.isEmpty()) completedSections++;
        if (!vitals.isEmpty()) completedSections++;
        if (!symptoms.isEmpty()) completedSections++;
        if (!healthGoals.isEmpty()) completedSections++;
        if (!emergencyContacts.isEmpty()) completedSections++;

        int percentage = (completedSections * 100) / totalSections;
        return percentage + "% Complete";
    }

    // Additional builder methods for nested analytics (simplified)
    private HealthAnalyticsResponse.VitalsAnalytics buildVitalsAnalytics(List<PatientVitals> vitals) {
        return HealthAnalyticsResponse.VitalsAnalytics.builder()
                .averageVitals(calculateAverageVitals(vitals))
                .vitalsTrends(calculateVitalsTrends(vitals))
                .abnormalVitals(identifyAbnormalVitals(vitals))
                .totalVitalsRecords(vitals.size())
                .lastRecordedDate(vitals.isEmpty() ? "N/A" : vitals.getFirst().getRecordedAt().toString())
                .build();
    }

    private Map<String, Double> calculateAverageVitals(List<PatientVitals> vitals) {
        // Simplified average calculation
        Map<String, Double> averages = new HashMap<>();
        if (!vitals.isEmpty()) {
            PatientVitals latest = vitals.getFirst();
            averages.put("systolic", latest.getBloodPressureSystolic() != null ? latest.getBloodPressureSystolic().doubleValue() : 120.0);
            averages.put("diastolic", latest.getBloodPressureDiastolic() != null ? latest.getBloodPressureDiastolic().doubleValue() : 80.0);
            averages.put("heartRate", latest.getHeartRate() != null ? latest.getHeartRate().doubleValue() : 72.0);
            averages.put("temperature", latest.getTemperature() != null ? latest.getTemperature() : 36.6);
        }
        return averages;
    }

    private HealthAnalyticsResponse.MedicationAnalytics buildMedicationAnalytics(List<PatientMedication> medications) {
        return HealthAnalyticsResponse.MedicationAnalytics.builder()
                .totalMedications(medications.size())
                .activeMedications((int) medications.stream().filter(m -> "ACTIVE".equalsIgnoreCase(m.getStatus())).count())
                .adherenceRate(calculateAdherenceRate(medications))
                .missedDoses(0)
                .upcomingRefills(Collections.emptyList())
                .expiringSoon(Collections.emptyList())
                .build();
    }


    private VitalsStatsResponse.VitalStats calculateVitalStats(List<PatientVitals> vitals, String vitalType) {
        // Simplified vital stats calculation
        return VitalsStatsResponse.VitalStats.builder()
                .current(BigDecimal.valueOf(120.0))
                .average(BigDecimal.valueOf(118.5))
                .minimum(BigDecimal.valueOf(110.0))
                .maximum(BigDecimal.valueOf(130.0))
                .trend("STABLE")
                .status("NORMAL")
                .changeFromPrevious(BigDecimal.valueOf(1.5))
                .changePercentage("+1.25%")
                .build();
    }

    private List<HealthOverviewResponse.HealthAlert> buildHealthAlerts(List<MedicalHistory> medicalHistory,
                                                                       List<PatientAllergy> allergies,
                                                                       List<PatientMedication> medications) {
        List<HealthOverviewResponse.HealthAlert> alerts = new ArrayList<>();

        // Add alerts for critical allergies
        allergies.stream()
                .filter(a -> Arrays.asList("SEVERE", "CRITICAL").contains(a.getSeverity().toUpperCase()))
                .forEach(allergy -> alerts.add(HealthOverviewResponse.HealthAlert.builder()
                        .type("CRITICAL")
                        .title("Critical Allergy: " + allergy.getAllergen())
                        .message("Patient has a " + allergy.getSeverity().toLowerCase() + " allergy to " + allergy.getAllergen())
                        .createdAt(LocalDateTime.now())
                        .actionRequired("Avoid exposure and have emergency medication ready")
                        .build()));

        return alerts;
    }

    private VitalsStatsResponse.VitalStats buildLatestVitalsStats(List<PatientVitals> recentVitals) {
        if (recentVitals.isEmpty()) {
            return VitalsStatsResponse.VitalStats.builder()
                    .current(BigDecimal.ZERO)
                    .average(BigDecimal.ZERO)
                    .minimum(BigDecimal.ZERO)
                    .maximum(BigDecimal.ZERO)
                    .trend("NO_DATA")
                    .status("UNKNOWN")
                    .changeFromPrevious(BigDecimal.ZERO)
                    .changePercentage("0%")
                    .build();
        }

        PatientVitals latest = recentVitals.getFirst();
        return VitalsStatsResponse.VitalStats.builder()
                .current(BigDecimal.valueOf(latest.getBloodPressureSystolic() != null ? latest.getBloodPressureSystolic() : 0))
                .average(calculateAverageBloodPressure(recentVitals))
                .minimum(calculateMinBloodPressure(recentVitals))
                .maximum(calculateMaxBloodPressure(recentVitals))
                .trend(calculateBloodPressureTrend(recentVitals))
                .status(determineBloodPressureStatus(latest))
                .changeFromPrevious(calculateBloodPressureChange(recentVitals))
                .changePercentage(calculateBloodPressureChangePercentage(recentVitals))
                .build();
    }

    private BigDecimal calculateAverageBloodPressure(List<PatientVitals> vitals) {
        if (vitals.isEmpty()) return BigDecimal.ZERO;

        double sum = vitals.stream()
                .filter(v -> v.getBloodPressureSystolic() != null)
                .mapToInt(PatientVitals::getBloodPressureSystolic)
                .average()
                .orElse(0.0);

        return BigDecimal.valueOf(sum);
    }

    private BigDecimal calculateMinBloodPressure(List<PatientVitals> vitals) {
        if (vitals.isEmpty()) return BigDecimal.ZERO;

        int min = vitals.stream()
                .filter(v -> v.getBloodPressureSystolic() != null)
                .mapToInt(PatientVitals::getBloodPressureSystolic)
                .min()
                .orElse(0);

        return BigDecimal.valueOf(min);
    }

    private BigDecimal calculateMaxBloodPressure(List<PatientVitals> vitals) {
        if (vitals.isEmpty()) return BigDecimal.ZERO;

        int max = vitals.stream()
                .filter(v -> v.getBloodPressureSystolic() != null)
                .mapToInt(PatientVitals::getBloodPressureSystolic)
                .max()
                .orElse(0);

        return BigDecimal.valueOf(max);
    }


    private String determineBloodPressureStatus(PatientVitals vital) {
        if (vital.getBloodPressureSystolic() == null || vital.getBloodPressureDiastolic() == null) {
            return "UNKNOWN";
        }

        int systolic = vital.getBloodPressureSystolic();
        int diastolic = vital.getBloodPressureDiastolic();

        if (systolic >= 180 || diastolic >= 120) return "HYPERTENSIVE_CRISIS";
        if (systolic >= 140 || diastolic >= 90) return "HIGH";
        if (systolic >= 120 || diastolic >= 80) return "ELEVATED";
        return "NORMAL";
    }

    private BigDecimal calculateBloodPressureChange(List<PatientVitals> vitals) {
        if (vitals.size() < 2) return BigDecimal.ZERO;

        List<Integer> systolicReadings = vitals.stream()
                .map(PatientVitals::getBloodPressureSystolic)
                .filter(Objects::nonNull)
                .toList();

        if (systolicReadings.size() < 2) return BigDecimal.ZERO;

        double change = systolicReadings.get(0) - systolicReadings.get(1);
        return BigDecimal.valueOf(change);
    }

    private String calculateBloodPressureChangePercentage(List<PatientVitals> vitals) {
        if (vitals.size() < 2) return "0%";

        List<Integer> systolicReadings = vitals.stream()
                .map(PatientVitals::getBloodPressureSystolic)
                .filter(Objects::nonNull)
                .toList();

        if (systolicReadings.size() < 2) return "0%";

        double first = systolicReadings.get(1);
        double last = systolicReadings.get(0);
        double percentage = ((last - first) / first) * 100;

        return String.format("%.1f%%", percentage);
    }

    private HealthOverviewResponse.MedicationSummary buildMedicationSummary(List<PatientMedication> medications) {
        int total = medications.size();
        int active = (int) medications.stream()
                .filter(m -> "ACTIVE".equalsIgnoreCase(m.getStatus()))
                .count();

        return HealthOverviewResponse.MedicationSummary.builder()
                .totalMedications(total)
                .activeMedications(active)
                .missedDoses(calculateMissedDoses(medications))
                .adherenceRate(calculateAdherenceRate(medications))
                .adherenceStatus(determineAdherenceStatus(calculateAdherenceRate(medications)))
                .build();
    }

    private int calculateMissedDoses(List<PatientMedication> medications) {
        // Simplified calculation - in real app, this would come from adherence tracking
        return (int) medications.stream()
                .filter(m -> "ACTIVE".equalsIgnoreCase(m.getStatus()))
                .count() / 4; // Assume 25% missed doses for demo
    }

    private BigDecimal calculateAdherenceRate(List<PatientMedication> medications) {
        if (medications.isEmpty()) return BigDecimal.ZERO;

        int activeMeds = (int) medications.stream()
                .filter(m -> "ACTIVE".equalsIgnoreCase(m.getStatus()))
                .count();

        if (activeMeds == 0) return BigDecimal.ZERO;

        // Simplified calculation
        double adherence = 85.0 - (calculateMissedDoses(medications) * 5.0);
        return BigDecimal.valueOf(Math.max(0, adherence));
    }

    private String determineAdherenceStatus(BigDecimal adherenceRate) {
        if (adherenceRate.compareTo(BigDecimal.valueOf(90)) >= 0) return "EXCELLENT";
        if (adherenceRate.compareTo(BigDecimal.valueOf(80)) >= 0) return "GOOD";
        if (adherenceRate.compareTo(BigDecimal.valueOf(70)) >= 0) return "FAIR";
        return "POOR";
    }

    private List<HealthOverviewResponse.HealthReminder> buildUpcomingReminders(
            List<PatientMedication> medications, List<HealthGoal> healthGoals) {

        List<HealthOverviewResponse.HealthReminder> reminders = new ArrayList<>();

        // Medication reminders
        medications.stream()
                .filter(m -> "ACTIVE".equalsIgnoreCase(m.getStatus()))
                .filter(m -> m.getEndDate() != null && m.getEndDate().isBefore(LocalDate.now().plusDays(7)))
                .forEach(med -> reminders.add(HealthOverviewResponse.HealthReminder.builder()
                        .type("MEDICATION_REFILL")
                        .title("Refill: " + med.getMedicationName())
                        .description("Medication running out soon")
                        .dueAt(med.getEndDate().atStartOfDay())
                        .priority("HIGH")
                        .build()));

        // Goal reminders
        healthGoals.stream()
                .filter(g -> "ACTIVE".equalsIgnoreCase(g.getStatus()))
                .filter(g -> g.getTargetDate() != null && g.getTargetDate().isBefore(LocalDate.now().plusDays(14)))
                .forEach(goal -> reminders.add(HealthOverviewResponse.HealthReminder.builder()
                        .type("GOAL_DEADLINE")
                        .title("Goal Deadline: " + goal.getTitle())
                        .description("Goal deadline approaching")
                        .dueAt(goal.getTargetDate().atStartOfDay())
                        .priority("MEDIUM")
                        .build()));

        return reminders;
    }

    private List<HealthOverviewResponse.GoalProgress> buildGoalProgress(List<HealthGoal> healthGoals) {
        return healthGoals.stream()
                .map(goal -> {
                    BigDecimal current = goal.getCurrentValue() != null ? goal.getCurrentValue() : BigDecimal.ZERO;
                    BigDecimal target = goal.getTargetValue() != null ? goal.getTargetValue() : BigDecimal.ONE;
                    BigDecimal progress = target.compareTo(BigDecimal.ZERO) == 0 ? BigDecimal.ZERO :
                            current.divide(target, 2, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));

                    return HealthOverviewResponse.GoalProgress.builder()
                            .goalName(goal.getTitle() != null ? goal.getTitle() : goal.getGoalType() + " Goal")
                            .goalType(goal.getGoalType())
                            .currentValue(current)
                            .targetValue(target)
                            .progressPercentage(progress)
                            .status(goal.getStatus())
                            .targetDate(goal.getTargetDate().atStartOfDay())
                            .build();
                })
                .collect(Collectors.toList());
    }

    private double calculateOverallHealthScore(List<PatientVitals> vitals, List<SymptomTracker> symptoms) {
        double score = 80.0; // Base score

        // Adjust based on vitals
        if (!vitals.isEmpty()) {
            PatientVitals latest = vitals.getFirst();
            if ("ABNORMAL".equalsIgnoreCase(latest.getHealthStatus())) {
                score -= 15.0;
            }
        }

        // Adjust based on symptoms
        long severeSymptoms = symptoms.stream()
                .filter(s -> s.getSeverity() != null && s.getSeverity() >= 7)
                .count();
        score -= (severeSymptoms * 5.0);

        return Math.max(0, Math.min(100, score));
    }

    private HealthAnalyticsResponse.SymptomAnalytics buildSymptomAnalytics(List<SymptomTracker> symptoms) {
        Map<String, Integer> frequency = symptoms.stream()
                .collect(Collectors.groupingBy(
                        s -> s.getSymptomName() != null ? s.getSymptomName() : "Unknown",
                        Collectors.summingInt(s -> 1)
                ));

        List<String> mostCommon = frequency.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(5)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        return HealthAnalyticsResponse.SymptomAnalytics.builder()
                .totalSymptoms(symptoms.size())
                .symptomFrequency(frequency)
                .mostCommonSymptoms(mostCommon)
                .symptomTrend(calculateSymptomTrend(symptoms))
                .concerningPatterns(identifyConcerningPatterns(symptoms))
                .build();
    }

    private String calculateSymptomTrend(List<SymptomTracker> symptoms) {
        if (symptoms.size() < 2) return "STABLE";

        // Group by week and calculate average severity
        Map<LocalDate, Double> weeklyAverages = symptoms.stream()
                .collect(Collectors.groupingBy(
                        s -> s.getRecordedAt().toLocalDate().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)),
                        Collectors.averagingInt(SymptomTracker::getSeverity)
                ));

        if (weeklyAverages.size() < 2) return "STABLE";

        List<Double> averages = weeklyAverages.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(Map.Entry::getValue)
                .toList();

        double first = averages.getFirst();
        double last = averages.getLast();

        if (last > first + 1.0) return "WORSENING";
        if (last < first - 1.0) return "IMPROVING";
        return "STABLE";
    }

    private List<String> identifyConcerningPatterns(List<SymptomTracker> symptoms) {
        List<String> patterns = new ArrayList<>();

        // Check for frequent severe symptoms
        long severeCount = symptoms.stream()
                .filter(s -> s.getSeverity() != null && s.getSeverity() >= 8)
                .count();

        if (severeCount >= 3) {
            patterns.add("Frequent severe symptoms (" + severeCount + " instances)");
        }

        // Check for symptom clusters
        Map<String, Long> symptomClusters = symptoms.stream()
                .filter(s -> s.getCategory() != null)
                .collect(Collectors.groupingBy(SymptomTracker::getCategory, Collectors.counting()));

        symptomClusters.entrySet().stream()
                .filter(entry -> entry.getValue() >= 5)
                .forEach(entry -> patterns.add("Multiple " + entry.getKey() + " symptoms (" + entry.getValue() + " instances)"));

        return patterns;
    }

    private HealthAnalyticsResponse.GoalAnalytics buildGoalAnalytics(List<HealthGoal> healthGoals) {
        int total = healthGoals.size();
        int active = (int) healthGoals.stream()
                .filter(g -> "ACTIVE".equalsIgnoreCase(g.getStatus()))
                .count();
        int completed = (int) healthGoals.stream()
                .filter(g -> "COMPLETED".equalsIgnoreCase(g.getStatus()))
                .count();

        double avgProgress = healthGoals.stream()
                .filter(g -> g.getCurrentValue() != null && g.getTargetValue() != null &&
                        g.getTargetValue().compareTo(BigDecimal.ZERO) > 0)
                .mapToDouble(g -> g.getCurrentValue().divide(g.getTargetValue(), 2, RoundingMode.HALF_UP).doubleValue() * 100)
                .average()
                .orElse(0.0);

        return HealthAnalyticsResponse.GoalAnalytics.builder()
                .totalGoals(total)
                .activeGoals(active)
                .completedGoals(completed)
                .averageProgress(avgProgress)
                .nearingDeadline(identifyGoalsNearingDeadline(healthGoals))
                .overdue(identifyOverdueGoals(healthGoals))
                .build();
    }

    private List<String> identifyGoalsNearingDeadline(List<HealthGoal> healthGoals) {
        return healthGoals.stream()
                .filter(g -> "ACTIVE".equalsIgnoreCase(g.getStatus()))
                .filter(g -> g.getTargetDate() != null &&
                        g.getTargetDate().isBefore(LocalDate.now().plusDays(7)) &&
                        g.getTargetDate().isAfter(LocalDate.now()))
                .map(g -> g.getTitle() != null ? g.getTitle() : g.getGoalType() + " Goal")
                .collect(Collectors.toList());
    }

    private List<String> identifyOverdueGoals(List<HealthGoal> healthGoals) {
        return healthGoals.stream()
                .filter(g -> "ACTIVE".equalsIgnoreCase(g.getStatus()))
                .filter(g -> g.getTargetDate() != null && g.getTargetDate().isBefore(LocalDate.now()))
                .map(g -> g.getTitle() != null ? g.getTitle() : g.getGoalType() + " Goal")
                .collect(Collectors.toList());
    }

    private List<HealthAnalyticsResponse.HealthAlert> buildAnalyticsHealthAlerts(
            List<PatientMedication> medications, List<PatientVitals> vitals, List<SymptomTracker> symptoms) {

        List<HealthAnalyticsResponse.HealthAlert> alerts = new ArrayList<>();

        // Medication alerts
        medications.stream()
                .filter(m -> m.getEndDate() != null && m.getEndDate().isBefore(LocalDate.now().plusDays(3)))
                .forEach(med -> alerts.add(HealthAnalyticsResponse.HealthAlert.builder()
                        .id("MED_ALERT_" + med.getId())
                        .type("MEDICATION")
                        .severity("HIGH")
                        .title("Medication Running Out: " + med.getMedicationName())
                        .message("Refill needed within 3 days")
                        .actionRequired("Schedule refill appointment")
                        .createdAt(LocalDateTime.now().toString())
                        .isRead(false)
                        .build()));

        // Vital alerts
        if (!vitals.isEmpty()) {
            PatientVitals latest = vitals.getFirst();
            if ("ABNORMAL".equalsIgnoreCase(latest.getHealthStatus())) {
                alerts.add(HealthAnalyticsResponse.HealthAlert.builder()
                        .id("VITAL_ALERT_" + latest.getId())
                        .type("VITALS")
                        .severity("MEDIUM")
                        .title("Abnormal Vital Signs")
                        .message("Recent vitals reading requires attention")
                        .actionRequired("Review with healthcare provider")
                        .createdAt(LocalDateTime.now().toString())
                        .isRead(false)
                        .build());
            }
        }

        // Symptom alerts
        long severeSymptoms = symptoms.stream()
                .filter(s -> s.getSeverity() != null && s.getSeverity() >= 8)
                .count();

        if (severeSymptoms >= 2) {
            alerts.add(HealthAnalyticsResponse.HealthAlert.builder()
                    .id("SYMPTOM_ALERT")
                    .type("SYMPTOMS")
                    .severity("HIGH")
                    .title("Multiple Severe Symptoms")
                    .message(severeSymptoms + " severe symptoms recorded recently")
                    .actionRequired("Consult healthcare provider")
                    .createdAt(LocalDateTime.now().toString())
                    .isRead(false)
                    .build());
        }

        return alerts;
    }

    private List<HealthAnalyticsResponse.HealthRecommendation> buildHealthRecommendations(
            List<PatientMedication> medications, List<PatientVitals> vitals,
            List<SymptomTracker> symptoms, List<HealthGoal> healthGoals) {

        List<HealthAnalyticsResponse.HealthRecommendation> recommendations = new ArrayList<>();

        // Medication recommendations
        if (medications.stream().anyMatch(m -> "ACTIVE".equalsIgnoreCase(m.getStatus()))) {
            recommendations.add(HealthAnalyticsResponse.HealthRecommendation.builder()
                    .id("REC_MED_ADHERENCE")
                    .category("MEDICATION")
                    .title("Improve Medication Adherence")
                    .description("Take medications as prescribed to maintain consistent treatment")
                    .priority("MEDIUM")
                    .actionType("REMINDER_SETUP")
                    .createdAt(LocalDateTime.now().toString())
                    .build());
        }

        // Vital recommendations
        if (!vitals.isEmpty() && "ABNORMAL".equalsIgnoreCase(vitals.getFirst().getHealthStatus())) {
            recommendations.add(HealthAnalyticsResponse.HealthRecommendation.builder()
                    .id("REC_VITAL_MONITORING")
                    .category("VITALS")
                    .title("Regular Vital Monitoring")
                    .description("Monitor vital signs regularly and report any persistent abnormalities")
                    .priority("HIGH")
                    .actionType("MONITORING_SCHEDULE")
                    .createdAt(LocalDateTime.now().toString())
                    .build());
        }

        // Goal recommendations
        if (healthGoals.stream().anyMatch(g -> "ACTIVE".equalsIgnoreCase(g.getStatus()))) {
            recommendations.add(HealthAnalyticsResponse.HealthRecommendation.builder()
                    .id("REC_GOAL_TRACKING")
                    .category("GOALS")
                    .title("Track Goal Progress")
                    .description("Regularly update your goal progress to stay on track")
                    .priority("LOW")
                    .actionType("PROGRESS_UPDATE")
                    .createdAt(LocalDateTime.now().toString())
                    .build());
        }

        return recommendations;
    }

    private String calculateVitalsHealthStatus(List<PatientVitals> vitals) {
        if (vitals.isEmpty()) return "NO_DATA";

        long abnormalCount = vitals.stream()
                .filter(v -> "ABNORMAL".equalsIgnoreCase(v.getHealthStatus()))
                .count();

        if (abnormalCount > vitals.size() / 2) return "POOR";
        if (abnormalCount > 0) return "NEEDS_ATTENTION";
        return "GOOD";
    }

    private String calculateVitalsTrend(List<PatientVitals> vitals) {
        if (vitals.size() < 2) return "INSUFFICIENT_DATA";

        List<PatientVitals> sortedVitals = vitals.stream()
                .sorted(Comparator.comparing(PatientVitals::getRecordedAt))
                .toList();

        int firstSystolic = sortedVitals.getFirst().getBloodPressureSystolic() != null ?
                sortedVitals.getFirst().getBloodPressureSystolic() : 0;
        int lastSystolic = sortedVitals.getLast().getBloodPressureSystolic() != null ?
                sortedVitals.getLast().getBloodPressureSystolic() : 0;

        if (lastSystolic > firstSystolic + 15) return "WORSENING";
        if (lastSystolic < firstSystolic - 15) return "IMPROVING";
        return "STABLE";
    }

    private Map<String, String> calculateVitalsTrends(List<PatientVitals> vitals) {
        Map<String, String> trends = new HashMap<>();

        if (vitals.size() < 2) {
            trends.put("overall", "INSUFFICIENT_DATA");
            trends.put("blood_pressure", "INSUFFICIENT_DATA");
            trends.put("heart_rate", "INSUFFICIENT_DATA");
            trends.put("temperature", "INSUFFICIENT_DATA");
            return trends;
        }

        // Sort vitals by recorded date (oldest first)
        List<PatientVitals> sortedVitals = vitals.stream()
                .sorted(Comparator.comparing(PatientVitals::getRecordedAt))
                .collect(Collectors.toList());

        // Calculate blood pressure trend
        trends.put("blood_pressure", calculateBloodPressureTrend(sortedVitals));

        // Calculate heart rate trend
        trends.put("heart_rate", calculateHeartRateTrend(sortedVitals));

        // Calculate temperature trend
        trends.put("temperature", calculateTemperatureTrend(sortedVitals));

        // Calculate overall trend
        trends.put("overall", calculateOverallVitalsTrend(trends));

        return trends;
    }

    private String calculateBloodPressureTrend(List<PatientVitals> sortedVitals) {
        List<Integer> systolicReadings = sortedVitals.stream()
                .map(PatientVitals::getBloodPressureSystolic)
                .filter(Objects::nonNull)
                .toList();

        if (systolicReadings.size() < 2) return "INSUFFICIENT_DATA";

        double first = systolicReadings.getFirst();
        double last = systolicReadings.getLast();
        double change = last - first;

        if (change > 15) return "INCREASING";
        if (change < -15) return "DECREASING";
        if (Math.abs(change) <= 5) return "STABLE";
        return "FLUCTUATING";
    }

    private String calculateHeartRateTrend(List<PatientVitals> sortedVitals) {
        List<Integer> heartRateReadings = sortedVitals.stream()
                .map(PatientVitals::getHeartRate)
                .filter(Objects::nonNull)
                .toList();

        if (heartRateReadings.size() < 2) return "INSUFFICIENT_DATA";

        double first = heartRateReadings.getFirst();
        double last = heartRateReadings.getLast();
        double change = last - first;

        if (change > 10) return "INCREASING";
        if (change < -10) return "DECREASING";
        if (Math.abs(change) <= 5) return "STABLE";
        return "FLUCTUATING";
    }

    private String calculateTemperatureTrend(List<PatientVitals> sortedVitals) {
        List<Double> temperatureReadings = sortedVitals.stream()
                .map(PatientVitals::getTemperature)
                .filter(Objects::nonNull)
                .toList();

        if (temperatureReadings.size() < 2) return "INSUFFICIENT_DATA";

        double first = temperatureReadings.getFirst();
        double last = temperatureReadings.getLast();
        double change = last - first;

        if (change > 0.5) return "INCREASING";
        if (change < -0.5) return "DECREASING";
        if (Math.abs(change) <= 0.2) return "STABLE";
        return "FLUCTUATING";
    }

    private String calculateOverallVitalsTrend(Map<String, String> individualTrends) {
        long increasingCount = individualTrends.values().stream()
                .filter("INCREASING"::equals)
                .count();

        long decreasingCount = individualTrends.values().stream()
                .filter("DECREASING"::equals)
                .count();

        if (increasingCount >= 2) return "WORSENING";
        if (decreasingCount >= 2) return "IMPROVING";

        long stableCount = individualTrends.values().stream()
                .filter("STABLE"::equals)
                .count();

        if (stableCount >= 2) return "STABLE";
        return "MIXED";
    }

    private List<String> identifyAbnormalVitals(List<PatientVitals> vitals) {
        List<String> abnormalVitals = new ArrayList<>();

        for (PatientVitals vital : vitals) {
            List<String> abnormalities = checkVitalAbnormalities(vital);
            if (!abnormalities.isEmpty()) {
                String recordedTime = vital.getRecordedAt().format(DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm"));
                abnormalities.forEach(abnormality ->
                        abnormalVitals.add(recordedTime + ": " + abnormality)
                );
            }
        }

        return abnormalVitals;
    }

    private List<String> checkVitalAbnormalities(PatientVitals vital) {
        List<String> abnormalities = new ArrayList<>();

        // Check blood pressure
        if (vital.getBloodPressureSystolic() != null && vital.getBloodPressureDiastolic() != null) {
            int systolic = vital.getBloodPressureSystolic();
            int diastolic = vital.getBloodPressureDiastolic();

            if (systolic >= 180 || diastolic >= 120) {
                abnormalities.add("Hypertensive Crisis (" + systolic + "/" + diastolic + " mmHg)");
            } else if (systolic >= 140 || diastolic >= 90) {
                abnormalities.add("High Blood Pressure (" + systolic + "/" + diastolic + " mmHg)");
            } else if (systolic <= 90 || diastolic <= 60) {
                abnormalities.add("Low Blood Pressure (" + systolic + "/" + diastolic + " mmHg)");
            }
        }

        // Check heart rate
        if (vital.getHeartRate() != null) {
            int heartRate = vital.getHeartRate();
            if (heartRate >= 100) {
                abnormalities.add("Tachycardia (HR: " + heartRate + " bpm)");
            } else if (heartRate <= 50) {
                abnormalities.add("Bradycardia (HR: " + heartRate + " bpm)");
            }
        }

        // Check temperature
        if (vital.getTemperature() != null) {
            double temperature = vital.getTemperature();
            if (temperature >= 38.0) {
                abnormalities.add("Fever (Temp: " + String.format("%.1f", temperature) + "°C)");
            } else if (temperature <= 35.0) {
                abnormalities.add("Hypothermia (Temp: " + String.format("%.1f", temperature) + "°C)");
            }
        }

        // Check oxygen saturation
        if (vital.getOxygenSaturation() != null) {
            int oxygenSat = vital.getOxygenSaturation();
            if (oxygenSat < 92) {
                abnormalities.add("Low Oxygen Saturation (SpO2: " + oxygenSat + "%)");
            }
        }

        // Check BMI if weight and height are available
        if (vital.getWeight() != null && vital.getHeight() != null && vital.getHeight() > 0) {
            double heightInMeters = vital.getHeight() / 100.0;
            double bmi = vital.getWeight() / (heightInMeters * heightInMeters);

            if (bmi >= 30.0) {
                abnormalities.add("Obesity (BMI: " + String.format("%.1f", bmi) + ")");
            } else if (bmi >= 25.0) {
                abnormalities.add("Overweight (BMI: " + String.format("%.1f", bmi) + ")");
            } else if (bmi < 18.5) {
                abnormalities.add("Underweight (BMI: " + String.format("%.1f", bmi) + ")");
            }
        }

        return abnormalities;
    }
}
