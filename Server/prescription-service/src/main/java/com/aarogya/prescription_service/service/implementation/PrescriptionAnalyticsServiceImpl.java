package com.aarogya.prescription_service.service.implementation;

import com.aarogya.prescription_service.dto.PrescriptionAnalyticsDTO;
import com.aarogya.prescription_service.model.PrescriptionAnalytics;
import com.aarogya.prescription_service.repository.PrescriptionAnalyticsRepository;
import com.aarogya.prescription_service.repository.PrescriptionRepository;
import com.aarogya.prescription_service.service.PrescriptionAnalyticsService;
import com.aarogya.prescription_service.util.PrescriptionUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Validated
public class PrescriptionAnalyticsServiceImpl implements PrescriptionAnalyticsService {

    private final PrescriptionAnalyticsRepository analyticsRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final ModelMapper modelMapper;
    private final PrescriptionUtil prescriptionUtil;

    @Override
    @Cacheable(value = "prescriptionAnalytics", key = "#doctorId + ':' + #startDate + ':' + #endDate")
    public PrescriptionAnalyticsDTO getDoctorPrescriptionAnalytics(String doctorId, LocalDate startDate, LocalDate endDate) {
        List<PrescriptionAnalytics> analyticsList = analyticsRepository.findByDoctorIdAndDateBetween(doctorId, startDate, endDate);

        if (analyticsList.isEmpty()) {
            return createEmptyAnalytics(doctorId, startDate);
        }

        PrescriptionAnalyticsDTO aggregated = PrescriptionAnalyticsDTO.builder()
                .doctorId(doctorId)
                .date(startDate)
                .totalPrescriptions(analyticsList.stream().mapToInt(PrescriptionAnalytics::getTotalPrescriptions).sum())
                .activePrescriptions(analyticsList.stream().mapToInt(PrescriptionAnalytics::getActivePrescriptions).sum())
                .completedPrescriptions(analyticsList.stream().mapToInt(PrescriptionAnalytics::getCompletedPrescriptions).sum())
                .cancelledPrescriptions(analyticsList.stream().mapToInt(PrescriptionAnalytics::getCancelledPrescriptions).sum())
                .refillPrescriptions(analyticsList.stream().mapToInt(PrescriptionAnalytics::getRefillPrescriptions).sum())
                .totalMedicinesPrescribed(analyticsList.stream().mapToInt(PrescriptionAnalytics::getTotalMedicinesPrescribed).sum())
                .uniqueMedicinesPrescribed(analyticsList.stream().mapToInt(PrescriptionAnalytics::getUniqueMedicinesPrescribed).sum())
                .uniquePatients(analyticsList.stream().mapToInt(PrescriptionAnalytics::getUniquePatients).sum())
                .newPatients(analyticsList.stream().mapToInt(PrescriptionAnalytics::getNewPatients).sum())
                .returningPatients(analyticsList.stream().mapToInt(PrescriptionAnalytics::getReturningPatients).sum())
                .totalPrescriptionValue(analyticsList.stream().mapToDouble(a -> a.getTotalPrescriptionValue() != null ? a.getTotalPrescriptionValue() : 0.0).sum())
                .drugInteractionsDetected(analyticsList.stream().mapToInt(PrescriptionAnalytics::getDrugInteractionsDetected).sum())
                .criticalInteractions(analyticsList.stream().mapToInt(PrescriptionAnalytics::getCriticalInteractions).sum())
                .allergyWarnings(analyticsList.stream().mapToInt(PrescriptionAnalytics::getAllergyWarnings).sum())
                .electronicPrescriptions(analyticsList.stream().mapToInt(PrescriptionAnalytics::getElectronicPrescriptions).sum())
                .paperPrescriptions(analyticsList.stream().mapToInt(PrescriptionAnalytics::getPaperPrescriptions).sum())
                .build();

        if (aggregated.getTotalPrescriptions() > 0) {
            aggregated.setAveragePrescriptionValue(aggregated.getTotalPrescriptionValue() / aggregated.getTotalPrescriptions());
        }

        Map<String, Integer> topMedicines = new HashMap<>();
        Map<String, Integer> topDiagnoses = new HashMap<>();
        Map<String, Integer> pharmacyDistribution = new HashMap<>();
        Map<Integer, Integer> prescriptionsByHour = new HashMap<>();

        for (PrescriptionAnalytics analytics : analyticsList) {
            if (analytics.getTopMedicines() != null) {
                analytics.getTopMedicines().forEach((key, value) ->
                        topMedicines.merge(key, value, Integer::sum));
            }
            if (analytics.getTopDiagnoses() != null) {
                analytics.getTopDiagnoses().forEach((key, value) ->
                        topDiagnoses.merge(key, value, Integer::sum));
            }
            if (analytics.getPharmacyDistribution() != null) {
                analytics.getPharmacyDistribution().forEach((key, value) ->
                        pharmacyDistribution.merge(key, value, Integer::sum));
            }
            if (analytics.getPrescriptionsByHour() != null) {
                analytics.getPrescriptionsByHour().forEach((key, value) ->
                        prescriptionsByHour.merge(key, value, Integer::sum));
            }
        }

        aggregated.setTopMedicines(topMedicines);
        aggregated.setTopDiagnoses(topDiagnoses);
        aggregated.setPharmacyDistribution(pharmacyDistribution);
        aggregated.setPrescriptionsByHour(prescriptionsByHour);

        return aggregated;
    }

    @Override
    public PrescriptionAnalyticsDTO getPatientPrescriptionAnalytics(String patientId, LocalDate startDate, LocalDate endDate) {
        return null;
    }

    @Override
    @Cacheable(value = "topPrescribedMedicines", key = "#doctorId + '_' + #startDate + '_' + #endDate + '_' + #limit")
    public Map<String, Integer> getTopPrescribedMedicines(String doctorId, LocalDate startDate, LocalDate endDate, int limit) {
        List<PrescriptionAnalytics> analyticsList = analyticsRepository.findByDoctorIdAndDateBetween(doctorId, startDate, endDate);

        Map<String, Integer> medicineCount = new HashMap<>();

        for (PrescriptionAnalytics analytics : analyticsList) {
            if (analytics.getTopMedicines() != null) {
                analytics.getTopMedicines().forEach((medicine, count) ->
                        medicineCount.merge(medicine, count, Integer::sum));
            }
        }

        return medicineCount.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(limit)
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        HashMap::new
                ));
    }

    @Override
    @Cacheable(value = "topDiagnoses", key = "#doctorId + '_' + #startDate + '_' + #endDate + '_' + #limit")
    public Map<String, Integer> getTopDiagnoses(String doctorId, LocalDate startDate, LocalDate endDate, int limit) {
        List<PrescriptionAnalytics> analyticsList = analyticsRepository.findByDoctorIdAndDateBetween(doctorId, startDate, endDate);

        Map<String, Integer> diagnosisCount = new HashMap<>();

        for (PrescriptionAnalytics analytics : analyticsList) {
            if (analytics.getTopDiagnoses() != null) {
                analytics.getTopDiagnoses().forEach((diagnosis, count) ->
                        diagnosisCount.merge(diagnosis, count, Integer::sum));
            }
        }

        return diagnosisCount.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(limit)
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        HashMap::new
                ));
    }

    @Override
    @Cacheable(value = "prescriptionTrends", key = "#doctorId + '_' + #startDate + '_' + #endDate")
    public Map<String, Double> getPrescriptionTrends(String doctorId, LocalDate startDate, LocalDate endDate) {
        List<PrescriptionAnalytics> analyticsList = analyticsRepository.findByDoctorIdAndDateBetween(doctorId, startDate, endDate);

        Map<String, Double> trends = new HashMap<>();

        if (analyticsList.size() >= 2) {
            PrescriptionAnalytics first = analyticsList.get(0);
            PrescriptionAnalytics last = analyticsList.get(analyticsList.size() - 1);

            trends.put("prescriptionGrowth", prescriptionUtil.calculateGrowthRate(first.getTotalPrescriptions(), last.getTotalPrescriptions()));
            trends.put("valueGrowth", prescriptionUtil.calculateGrowthRate(first.getTotalPrescriptionValue(), last.getTotalPrescriptionValue()));
            trends.put("patientGrowth", prescriptionUtil.calculateGrowthRate(first.getUniquePatients(), last.getUniquePatients()));
        }

        return trends;
    }

    @Override
    @Cacheable(value = "drugInteractionAlerts", key = "#doctorId + '_' + #startDate + '_' + #endDate")
    public List<String> getDrugInteractionAlerts(String doctorId, LocalDate startDate, LocalDate endDate) {
        List<PrescriptionAnalytics> analyticsList = analyticsRepository.findByDoctorIdAndDateBetween(doctorId, startDate, endDate);

        return analyticsList.stream()
                .filter(analytics -> analytics.getCriticalInteractions() > 0)
                .map(analytics -> "Critical drug interactions detected on " + analytics.getDate() + ": " + analytics.getCriticalInteractions())
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "prescriptionsByStatus", key = "#doctorId + '_' + #startDate + '_' + #endDate")
    public Map<String, Integer> getPrescriptionsByStatus(String doctorId, LocalDate startDate, LocalDate endDate) {
        List<PrescriptionAnalytics> analyticsList = analyticsRepository.findByDoctorIdAndDateBetween(doctorId, startDate, endDate);

        Map<String, Integer> statusCount = new HashMap<>();
        statusCount.put("ACTIVE", analyticsList.stream().mapToInt(PrescriptionAnalytics::getActivePrescriptions).sum());
        statusCount.put("COMPLETED", analyticsList.stream().mapToInt(PrescriptionAnalytics::getCompletedPrescriptions).sum());
        statusCount.put("CANCELLED", analyticsList.stream().mapToInt(PrescriptionAnalytics::getCancelledPrescriptions).sum());

        return statusCount;
    }

    @Override
    @Cacheable(value = "averagePrescriptionValue", key = "#doctorId + '_' + #startDate + '_' + #endDate")
    public Double getAveragePrescriptionValue(String doctorId, LocalDate startDate, LocalDate endDate) {
        List<PrescriptionAnalytics> analyticsList = analyticsRepository.findByDoctorIdAndDateBetween(doctorId, startDate, endDate);

        double totalValue = analyticsList.stream()
                .mapToDouble(a -> a.getTotalPrescriptionValue() != null ? a.getTotalPrescriptionValue() : 0.0)
                .sum();

        int totalPrescriptions = analyticsList.stream()
                .mapToInt(PrescriptionAnalytics::getTotalPrescriptions)
                .sum();

        return totalPrescriptions > 0 ? totalValue / totalPrescriptions : 0.0;
    }

    private PrescriptionAnalyticsDTO createEmptyAnalytics(String doctorId, LocalDate date) {
        return PrescriptionAnalyticsDTO.builder()
                .doctorId(doctorId)
                .date(date)
                .totalPrescriptions(0)
                .activePrescriptions(0)
                .completedPrescriptions(0)
                .cancelledPrescriptions(0)
                .refillPrescriptions(0)
                .totalMedicinesPrescribed(0)
                .uniqueMedicinesPrescribed(0)
                .uniquePatients(0)
                .newPatients(0)
                .returningPatients(0)
                .totalPrescriptionValue(0.0)
                .averagePrescriptionValue(0.0)
                .drugInteractionsDetected(0)
                .criticalInteractions(0)
                .allergyWarnings(0)
                .electronicPrescriptions(0)
                .paperPrescriptions(0)
                .topMedicines(new HashMap<>())
                .topDiagnoses(new HashMap<>())
                .pharmacyDistribution(new HashMap<>())
                .prescriptionsByHour(new HashMap<>())
                .averageProcessingTime(0.0)
                .build();
    }
}
