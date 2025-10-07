package com.aarogya.patient_management_service.service.implementations;

import com.aarogya.patient_management_service.annotations.EvictPatientCaches;
import com.aarogya.patient_management_service.dto.request.CreateVitalsRequest;
import com.aarogya.patient_management_service.dto.request.UpdateVitalsRequest;
import com.aarogya.patient_management_service.dto.response.PatientVitalsResponse;
import com.aarogya.patient_management_service.dto.response.VitalsStatsResponse;
import com.aarogya.patient_management_service.exceptions.ResourceNotFoundException;
import com.aarogya.patient_management_service.exceptions.ServiceException;
import com.aarogya.patient_management_service.model.PatientVitals;
import com.aarogya.patient_management_service.repository.PatientVitalsRepository;
import com.aarogya.patient_management_service.service.PatientVitalsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.DoubleSummaryStatistics;
import java.util.IntSummaryStatistics;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class PatientVitalsServiceImpl implements PatientVitalsService {

    private static final String VITALS_NOT_FOUND = "Vitals not found with ID: %s for patient: %s";
    private static final String NO_VITALS_FOUND = "No vitals found for patient: %s";

    private final PatientVitalsRepository vitalsRepository;
    private final ModelMapper modelMapper;

    @Override
    @EvictPatientCaches
    public PatientVitalsResponse recordVitals(String patientId, CreateVitalsRequest request) {
        try {
            log.info("Recording vitals for patient: {}", patientId);
            validatePatientId(patientId);
            validateCreateRequest(request);

            PatientVitals vitals = modelMapper.map(request, PatientVitals.class);
            vitals.setPatientId(patientId);
            vitals.setRecordedAt(LocalDateTime.now());
            vitals.setRecordedByType("SELF");
            vitals.setRecordedBy(patientId);
            vitals.setCreatedAt(LocalDateTime.now());
            vitals.setUpdatedAt(LocalDateTime.now());

            calculateHealthIndicators(vitals);

            PatientVitals savedVitals = vitalsRepository.save(vitals);
            log.info("Vitals recorded successfully with ID: {}", savedVitals.getId());

            return convertToResponse(savedVitals);

        } catch (DataAccessException e) {
            log.error("Database error while recording vitals for patient: {}", patientId, e);
            throw new ServiceException("Failed to record vitals due to database error", e);
        } catch (IllegalArgumentException e) {
            log.error("Validation error while recording vitals for patient: {}", patientId, e);
            throw new ServiceException("Invalid vitals data: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error while recording vitals for patient: {}", patientId, e);
            throw new ServiceException("Failed to record vitals", e);
        }
    }

    @Override
    @Cacheable(value = "patientVitals", key = "#patientId + '_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<PatientVitalsResponse> getPatientVitals(String patientId, Pageable pageable) {
        try {
            log.info("Fetching vitals for patient: {}", patientId);
            validatePatientId(patientId);

            Page<PatientVitals> vitalsPage = vitalsRepository.findByPatientIdOrderByRecordedAtDesc(patientId, pageable);

            if (vitalsPage.isEmpty()) {
                throw new ResourceNotFoundException(String.format(NO_VITALS_FOUND, patientId));
            }

            return vitalsPage.map(this::convertToResponse);

        } catch (DataAccessException e) {
            log.error("Database error while fetching vitals for patient: {}", patientId, e);
            throw new ServiceException("Failed to fetch vitals due to database error", e);
        }
    }

    @Override
    @Cacheable(value = "latestVitals", key = "#patientId")
    public PatientVitalsResponse getLatestVitals(String patientId) {
        try {
            log.info("Fetching latest vitals for patient: {}", patientId);
            validatePatientId(patientId);

            PatientVitals latestVitals = vitalsRepository.findTopByPatientIdOrderByRecordedAtDesc(patientId);
            if (latestVitals == null) {
                throw new ResourceNotFoundException(String.format(NO_VITALS_FOUND, patientId));
            }

            return convertToResponse(latestVitals);

        } catch (DataAccessException e) {
            log.error("Database error while fetching latest vitals for patient: {}", patientId, e);
            throw new ServiceException("Failed to fetch latest vitals due to database error", e);
        }
    }

    @Override
    public VitalsStatsResponse getVitalsStats(String patientId, int days) {
        try {
            log.info("Calculating vitals stats for patient: {} for last {} days", patientId, days);
            validatePatientId(patientId);

            LocalDateTime startDate = LocalDateTime.now().minusDays(days);
            LocalDateTime endDate = LocalDateTime.now();

            List<PatientVitals> vitalsList = vitalsRepository.findByPatientIdAndRecordedAtBetween(patientId, startDate, endDate);

            return calculateVitalsStatistics(vitalsList, days);

        } catch (DataAccessException e) {
            log.error("Database error while calculating vitals stats for patient: {}", patientId, e);
            throw new ServiceException("Failed to calculate vitals stats due to database error", e);
        } catch (Exception e) {
            log.error("Unexpected error while calculating vitals stats for patient: {}", patientId, e);
            throw new ServiceException("Failed to calculate vitals stats", e);
        }
    }

    @Override
    public List<PatientVitalsResponse> getVitalsTrends(String patientId, LocalDate startDate, LocalDate endDate) {
        try {
            log.info("Fetching vitals trends for patient: {} from {} to {}", patientId, startDate, endDate);
            validatePatientId(patientId);

            LocalDateTime startDateTime = startDate.atStartOfDay();
            LocalDateTime endDateTime = endDate.atTime(23, 59, 59);

            List<PatientVitals> vitalsList = vitalsRepository.findByPatientIdAndRecordedAtBetween(patientId, startDateTime, endDateTime);

            return vitalsList.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());

        } catch (DataAccessException e) {
            log.error("Database error while fetching vitals trends for patient: {}", patientId, e);
            throw new ServiceException("Failed to fetch vitals trends due to database error", e);
        }
    }

    @Override
    public PatientVitalsResponse getVitalsById(String patientId, String vitalsId) {
        try {
            log.info("Fetching vitals by ID: {} for patient: {}", vitalsId, patientId);
            validatePatientId(patientId);

            PatientVitals vitals = getVitalsForPatient(vitalsId, patientId);
            return convertToResponse(vitals);

        } catch (DataAccessException e) {
            log.error("Database error while fetching vitals by ID: {} for patient: {}", vitalsId, patientId, e);
            throw new ServiceException("Failed to fetch vitals due to database error", e);
        }
    }

    @Override
    @EvictPatientCaches
    public PatientVitalsResponse updateVitals(String patientId, String vitalsId, UpdateVitalsRequest request) {
        try {
            log.info("Updating vitals: {} for patient: {}", vitalsId, patientId);
            validatePatientId(patientId);
            validateUpdateRequest(request);

            PatientVitals existingVitals = getVitalsForPatient(vitalsId, patientId);

            modelMapper.map(request, existingVitals);
            existingVitals.setUpdatedAt(LocalDateTime.now());
            calculateHealthIndicators(existingVitals);

            PatientVitals updatedVitals = vitalsRepository.save(existingVitals);
            log.info("Vitals {} updated successfully", vitalsId);

            return convertToResponse(updatedVitals);

        } catch (DataAccessException e) {
            log.error("Database error while updating vitals: {} for patient: {}", vitalsId, patientId, e);
            throw new ServiceException("Failed to update vitals due to database error", e);
        } catch (IllegalArgumentException e) {
            log.error("Validation error while updating vitals: {} for patient: {}", vitalsId, patientId, e);
            throw new ServiceException("Invalid vitals data: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error while updating vitals: {} for patient: {}", vitalsId, patientId, e);
            throw new ServiceException("Failed to update vitals", e);
        }
    }

    @Override
    @EvictPatientCaches
    public PatientVitalsResponse partialUpdateVitals(String patientId, String vitalsId, UpdateVitalsRequest request) {
        try {
            log.info("Partially updating vitals: {} for patient: {}", vitalsId, patientId);
            validatePatientId(patientId);

            PatientVitals existingVitals = getVitalsForPatient(vitalsId, patientId);

            updateNonNullFields(request, existingVitals);
            existingVitals.setUpdatedAt(LocalDateTime.now());
            calculateHealthIndicators(existingVitals);

            PatientVitals updatedVitals = vitalsRepository.save(existingVitals);
            log.info("Vitals {} partially updated successfully", vitalsId);

            return convertToResponse(updatedVitals);

        } catch (DataAccessException e) {
            log.error("Database error while partially updating vitals: {} for patient: {}", vitalsId, patientId, e);
            throw new ServiceException("Failed to partially update vitals due to database error", e);
        } catch (Exception e) {
            log.error("Unexpected error while partially updating vitals: {} for patient: {}", vitalsId, patientId, e);
            throw new ServiceException("Failed to partially update vitals", e);
        }
    }

    @Override
    @EvictPatientCaches
    public void deleteVitals(String patientId, String vitalsId) {
        try {
            log.info("Deleting vitals: {} for patient: {}", vitalsId, patientId);
            validatePatientId(patientId);

            if (!vitalsRepository.existsByIdAndPatientId(vitalsId, patientId)) {
                throw new ResourceNotFoundException(String.format(VITALS_NOT_FOUND, vitalsId, patientId));
            }

            vitalsRepository.deleteById(vitalsId);
            log.info("Vitals {} deleted successfully", vitalsId);

        } catch (DataAccessException e) {
            log.error("Database error while deleting vitals: {} for patient: {}", vitalsId, patientId, e);
            throw new ServiceException("Failed to delete vitals due to database error", e);
        }
    }

    private PatientVitals getVitalsForPatient(String vitalsId, String patientId) {
        return vitalsRepository.findByIdAndPatientId(vitalsId, patientId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(VITALS_NOT_FOUND, vitalsId, patientId)));
    }

    private PatientVitalsResponse convertToResponse(PatientVitals vitals) {
        return modelMapper.map(vitals, PatientVitalsResponse.class);
    }

    private void validatePatientId(String patientId) {
        if (patientId == null || patientId.trim().isEmpty()) {
            throw new IllegalArgumentException("Patient ID is required");
        }
    }

    private void validateCreateRequest(CreateVitalsRequest request) {
        if (request.getBloodPressureSystolic() == null) {
            throw new IllegalArgumentException("Systolic pressure is required");
        }
        if (request.getBloodPressureDiastolic() == null) {
            throw new IllegalArgumentException("Diastolic pressure is required");
        }
        if (request.getHeartRate() == null) {
            throw new IllegalArgumentException("Heart rate is required");
        }
        if (request.getTemperature() == null) {
            throw new IllegalArgumentException("Temperature is required");
        }
        if (request.getWeight() == null) {
            throw new IllegalArgumentException("Weight is required");
        }
        if (request.getHeight() == null) {
            throw new IllegalArgumentException("Height is required");
        }
    }

    private void validateUpdateRequest(UpdateVitalsRequest request) {
        if (request.getSystolicPressure() != null) {
            if (request.getSystolicPressure().compareTo(new BigDecimal("50.0")) < 0) {
                throw new IllegalArgumentException("Systolic pressure must be at least 50");
            }
            if (request.getSystolicPressure().compareTo(new BigDecimal("300.0")) > 0) {
                throw new IllegalArgumentException("Systolic pressure must not exceed 300");
            }
        }

        if (request.getDiastolicPressure() != null) {
            if (request.getDiastolicPressure().compareTo(new BigDecimal("30.0")) < 0) {
                throw new IllegalArgumentException("Diastolic pressure must be at least 30");
            }
            if (request.getDiastolicPressure().compareTo(new BigDecimal("200.0")) > 0) {
                throw new IllegalArgumentException("Diastolic pressure must not exceed 200");
            }
        }

        if (request.getHeartRate() != null) {
            if (request.getHeartRate().compareTo(new BigDecimal("30.0")) < 0) {
                throw new IllegalArgumentException("Heart rate must be at least 30");
            }
            if (request.getHeartRate().compareTo(new BigDecimal("250.0")) > 0) {
                throw new IllegalArgumentException("Heart rate must not exceed 250");
            }
        }

        if (request.getTemperature() != null) {
            if (request.getTemperature().compareTo(new BigDecimal("35.0")) < 0) {
                throw new IllegalArgumentException("Temperature must be at least 35°C");
            }
            if (request.getTemperature().compareTo(new BigDecimal("42.0")) > 0) {
                throw new IllegalArgumentException("Temperature must not exceed 42°C");
            }
        }

        if (request.getOxygenSaturation() != null) {
            if (request.getOxygenSaturation().compareTo(new BigDecimal("80.0")) < 0) {
                throw new IllegalArgumentException("Oxygen saturation must be at least 80%");
            }
            if (request.getOxygenSaturation().compareTo(new BigDecimal("100.0")) > 0) {
                throw new IllegalArgumentException("Oxygen saturation must not exceed 100%");
            }
        }

        if (request.getRespiratoryRate() != null) {
            if (request.getRespiratoryRate().compareTo(new BigDecimal("8.0")) < 0) {
                throw new IllegalArgumentException("Respiratory rate must be at least 8");
            }
            if (request.getRespiratoryRate().compareTo(new BigDecimal("60.0")) > 0) {
                throw new IllegalArgumentException("Respiratory rate must not exceed 60");
            }
        }

        if (request.getWeight() != null) {
            if (request.getWeight().compareTo(new BigDecimal("2.0")) < 0) {
                throw new IllegalArgumentException("Weight must be at least 2 kg");
            }
            if (request.getWeight().compareTo(new BigDecimal("500.0")) > 0) {
                throw new IllegalArgumentException("Weight must not exceed 500 kg");
            }
        }

        if (request.getHeight() != null) {
            if (request.getHeight().compareTo(new BigDecimal("30.0")) < 0) {
                throw new IllegalArgumentException("Height must be at least 30 cm");
            }
            if (request.getHeight().compareTo(new BigDecimal("250.0")) > 0) {
                throw new IllegalArgumentException("Height must not exceed 250 cm");
            }
        }
    }

    private void calculateHealthIndicators(PatientVitals vitals) {
        try {
            // Calculate BMI
            if (vitals.getHeight() != null && vitals.getWeight() != null && vitals.getHeight() > 0) {
                double heightInMeters = vitals.getHeight() / 100.0;
                double bmi = vitals.getWeight() / (heightInMeters * heightInMeters);
                vitals.setBmi(Math.round(bmi * 100.0) / 100.0);
            }

            // Determine health status
            vitals.setHealthStatus(determineHealthStatus(vitals));

        } catch (Exception e) {
            log.warn("Error calculating health indicators for vitals: {}", e.getMessage());
            vitals.setHealthStatus("UNKNOWN");
        }
    }

    private String determineHealthStatus(PatientVitals vitals) {
        boolean hasAbnormalVitals = false;

        // Check blood pressure
        if (vitals.getBloodPressureSystolic() != null && vitals.getBloodPressureDiastolic() != null) {
            if (vitals.getBloodPressureSystolic() > 140 || vitals.getBloodPressureDiastolic() > 90) {
                hasAbnormalVitals = true;
            }
        }

        // Check heart rate
        if (vitals.getHeartRate() != null) {
            if (vitals.getHeartRate() < 60 || vitals.getHeartRate() > 100) {
                hasAbnormalVitals = true;
            }
        }

        // Check temperature
        if (vitals.getTemperature() != null) {
            if (vitals.getTemperature() > 37.5 || vitals.getTemperature() < 36.0) {
                hasAbnormalVitals = true;
            }
        }

        return hasAbnormalVitals ? "ABNORMAL" : "NORMAL";
    }

    private VitalsStatsResponse calculateVitalsStatistics(List<PatientVitals> vitalsList, int days) {
        int totalRecords = vitalsList.size();

        VitalsStatsResponse.VitalStats bloodPressureStats = calculateBloodPressureStats(vitalsList);
        VitalsStatsResponse.VitalStats heartRateStats = calculateHeartRateStats(vitalsList);
        VitalsStatsResponse.VitalStats temperatureStats = calculateTemperatureStats(vitalsList);
        VitalsStatsResponse.VitalStats oxygenStats = calculateOxygenStats(vitalsList);
        VitalsStatsResponse.VitalStats weightStats = calculateWeightStats(vitalsList);

        return VitalsStatsResponse.builder()
                .bloodPressure(bloodPressureStats)
                .heartRate(heartRateStats)
                .temperature(temperatureStats)
                .oxygenSaturation(oxygenStats)
                .weight(weightStats)
                .totalRecords(totalRecords)
                .daysAnalyzed(days)
                .lastRecorded(getLastRecordedDate(vitalsList))
                .overallHealthStatus(calculateOverallHealthStatus(vitalsList))
                .healthTrend(calculateHealthTrend(vitalsList))
                .build();
    }

    private VitalsStatsResponse.VitalStats calculateBloodPressureStats(List<PatientVitals> vitalsList) {
        IntSummaryStatistics systolicStats = vitalsList.stream()
                .filter(v -> v.getBloodPressureSystolic() != null)
                .mapToInt(PatientVitals::getBloodPressureSystolic)
                .summaryStatistics();

        IntSummaryStatistics diastolicStats = vitalsList.stream()
                .filter(v -> v.getBloodPressureDiastolic() != null)
                .mapToInt(PatientVitals::getBloodPressureDiastolic)
                .summaryStatistics();

        double avgSystolic = systolicStats.getAverage();
        double avgDiastolic = diastolicStats.getAverage();

        return VitalsStatsResponse.VitalStats.builder()
                .current(BigDecimal.valueOf(avgSystolic))
                .average(BigDecimal.valueOf((avgSystolic + avgDiastolic) / 2))
                .minimum(BigDecimal.valueOf(Math.min(systolicStats.getMin(), diastolicStats.getMin())))
                .maximum(BigDecimal.valueOf(Math.max(systolicStats.getMax(), diastolicStats.getMax())))
                .trend(calculateTrend(vitalsList, "bloodPressure"))
                .status(determineBloodPressureStatus(avgSystolic, avgDiastolic))
                .build();
    }

    private VitalsStatsResponse.VitalStats calculateHeartRateStats(List<PatientVitals> vitalsList) {
        IntSummaryStatistics stats = vitalsList.stream()
                .filter(v -> v.getHeartRate() != null)
                .mapToInt(PatientVitals::getHeartRate)
                .summaryStatistics();

        return VitalsStatsResponse.VitalStats.builder()
                .current(BigDecimal.valueOf(stats.getAverage()))
                .average(BigDecimal.valueOf(stats.getAverage()))
                .minimum(BigDecimal.valueOf(stats.getMin()))
                .maximum(BigDecimal.valueOf(stats.getMax()))
                .trend(calculateTrend(vitalsList, "heartRate"))
                .status(determineHeartRateStatus(stats.getAverage()))
                .build();
    }

    private VitalsStatsResponse.VitalStats calculateTemperatureStats(List<PatientVitals> vitalsList) {
        DoubleSummaryStatistics stats = vitalsList.stream()
                .filter(v -> v.getTemperature() != null)
                .mapToDouble(PatientVitals::getTemperature)
                .summaryStatistics();

        return VitalsStatsResponse.VitalStats.builder()
                .current(BigDecimal.valueOf(stats.getAverage()))
                .average(BigDecimal.valueOf(stats.getAverage()))
                .minimum(BigDecimal.valueOf(stats.getMin()))
                .maximum(BigDecimal.valueOf(stats.getMax()))
                .trend(calculateTrend(vitalsList, "temperature"))
                .status(determineTemperatureStatus(stats.getAverage()))
                .build();
    }

    private VitalsStatsResponse.VitalStats calculateOxygenStats(List<PatientVitals> vitalsList) {
        IntSummaryStatistics stats = vitalsList.stream()
                .filter(v -> v.getOxygenSaturation() != null)
                .mapToInt(PatientVitals::getOxygenSaturation)
                .summaryStatistics();

        return VitalsStatsResponse.VitalStats.builder()
                .current(BigDecimal.valueOf(stats.getAverage()))
                .average(BigDecimal.valueOf(stats.getAverage()))
                .minimum(BigDecimal.valueOf(stats.getMin()))
                .maximum(BigDecimal.valueOf(stats.getMax()))
                .trend(calculateTrend(vitalsList, "oxygen"))
                .status(determineOxygenStatus(stats.getAverage()))
                .build();
    }

    private VitalsStatsResponse.VitalStats calculateWeightStats(List<PatientVitals> vitalsList) {
        DoubleSummaryStatistics stats = vitalsList.stream()
                .filter(v -> v.getWeight() != null)
                .mapToDouble(PatientVitals::getWeight)
                .summaryStatistics();

        return VitalsStatsResponse.VitalStats.builder()
                .current(BigDecimal.valueOf(stats.getAverage()))
                .average(BigDecimal.valueOf(stats.getAverage()))
                .minimum(BigDecimal.valueOf(stats.getMin()))
                .maximum(BigDecimal.valueOf(stats.getMax()))
                .trend(calculateTrend(vitalsList, "weight"))
                .status("NORMAL")
                .build();
    }

    // Helper methods for status determination
    private String determineBloodPressureStatus(double systolic, double diastolic) {
        if (systolic > 140 || diastolic > 90) return "HIGH";
        if (systolic < 90 || diastolic < 60) return "LOW";
        return "NORMAL";
    }

    private String determineHeartRateStatus(double heartRate) {
        if (heartRate > 100) return "HIGH";
        if (heartRate < 60) return "LOW";
        return "NORMAL";
    }

    private String determineTemperatureStatus(double temperature) {
        if (temperature > 37.5) return "FEVER";
        if (temperature < 36.0) return "LOW";
        return "NORMAL";
    }

    private String determineOxygenStatus(double oxygen) {
        if (oxygen < 95) return "LOW";
        return "NORMAL";
    }

    private LocalDateTime getLastRecordedDate(List<PatientVitals> vitalsList) {
        return vitalsList.stream()
                .map(PatientVitals::getRecordedAt)
                .max(LocalDateTime::compareTo)
                .orElse(null);
    }

    private String calculateOverallHealthStatus(List<PatientVitals> vitalsList) {
        long abnormalCount = vitalsList.stream()
                .filter(v -> "ABNORMAL".equals(v.getHealthStatus()))
                .count();

        if (abnormalCount > vitalsList.size() / 2) return "POOR";
        if (abnormalCount > 0) return "FAIR";
        return "GOOD";
    }

    private String calculateTrend(List<PatientVitals> vitalsList, String vitalType) {
        if (vitalsList.size() < 2) return "STABLE";

        return "UNSTABLE";
    }

    private String calculateHealthTrend(List<PatientVitals> vitalsList) {
        if (vitalsList.size() < 2) return "STABLE";

        int improvements = 0;
        int deteriorations = 0;

        for (int i = 1; i < vitalsList.size(); i++) {
            String previous = vitalsList.get(i-1).getHealthStatus();
            String current = vitalsList.get(i).getHealthStatus();

            if ("NORMAL".equals(current) && "ABNORMAL".equals(previous)) {
                improvements++;
            } else if ("ABNORMAL".equals(current) && "NORMAL".equals(previous)) {
                deteriorations++;
            }
        }

        if (improvements > deteriorations) return "IMPROVING";
        if (deteriorations > improvements) return "DETERIORATING";
        return "STABLE";
    }

    private void updateNonNullFields(UpdateVitalsRequest request, PatientVitals existingVitals) {
        if (request.getSystolicPressure() != null) {
            existingVitals.setBloodPressureSystolic(request.getSystolicPressure().intValue());
        }
        if (request.getDiastolicPressure() != null) {
            existingVitals.setBloodPressureDiastolic(request.getDiastolicPressure().intValue());
        }
        if (request.getHeartRate() != null) {
            existingVitals.setHeartRate(request.getHeartRate().intValue());
        }
        if (request.getTemperature() != null) {
            existingVitals.setTemperature(request.getTemperature().doubleValue());
        }
        if (request.getOxygenSaturation() != null) {
            existingVitals.setOxygenSaturation(request.getOxygenSaturation().intValue());
        }
        if (request.getRespiratoryRate() != null) {
            existingVitals.setRespiratoryRate(request.getRespiratoryRate().intValue());
        }
        if (request.getWeight() != null) {
            existingVitals.setWeight(request.getWeight().doubleValue());
        }
        if (request.getHeight() != null) {
            existingVitals.setHeight(request.getHeight().doubleValue());
        }
        if (request.getNotes() != null) {
            existingVitals.setNotes(request.getNotes());
        }
    }
}
