package com.aarogya.lab_service.utils;

import com.aarogya.lab_service.models.LabTest;
import com.aarogya.lab_service.repository.LabOrderRepository;
import com.aarogya.lab_service.repository.LabResultRepository;
import com.aarogya.lab_service.repository.LabTestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class LabTestDataSeedingService {


    private final LabTestRepository labTestRepository;
    private final LabOrderRepository labOrderRepository;
    private final LabResultRepository labResultRepository;

    @Transactional
    public int seedLabTests() {
        log.info("Seeding initial lab tests");

        if (labTestRepository.count() > 0) {
            log.info("Lab tests already exist, skipping seeding");
            return 0;
        }

        List<LabTest> tests = List.of(
                LabTest.builder()
                        .testCode("CBC")
                        .testName("Complete Blood Count")
                        .description("Comprehensive blood test measuring various blood components")
                        .category("Hematology")
                        .price(new BigDecimal("25.00"))
                        .sampleType("BLOOD")
                        .preparationTimeHours(8)
                        .preparationInstructions("Fast for 8 hours before test")
                        .resultTimeHours(24)
                        .normalRanges(List.of(
                                "WBC: 4.0-11.0 x10³/µL",
                                "RBC: 4.2-5.4 x10⁶/µL",
                                "Hemoglobin: 12.0-16.0 g/dL"))
                        .isActive(true)
                        .build(),

                LabTest.builder()
                        .testCode("BMP")
                        .testName("Basic Metabolic Panel")
                        .description("Tests glucose, electrolytes, and kidney function")
                        .category("Chemistry")
                        .price(new BigDecimal("30.00"))
                        .sampleType("BLOOD")
                        .preparationTimeHours(8)
                        .preparationInstructions("Fast for 8 hours before test")
                        .resultTimeHours(12)
                        .normalRanges(List.of(
                                "Glucose: 70-100 mg/dL",
                                "Sodium: 136-145 mEq/L",
                                "Creatinine: 0.6-1.2 mg/dL"))
                        .isActive(true)
                        .build(),

                LabTest.builder()
                        .testCode("CMP")
                        .testName("Comprehensive Metabolic Panel")
                        .description("Includes BMP plus liver tests")
                        .category("Chemistry")
                        .price(new BigDecimal("40.00"))
                        .sampleType("BLOOD")
                        .preparationTimeHours(8)
                        .preparationInstructions("Fast for 8 hours before test")
                        .resultTimeHours(24)
                        .normalRanges(List.of(
                                "Albumin: 3.5-5.0 g/dL",
                                "Calcium: 8.5-10.5 mg/dL"))
                        .isActive(true)
                        .build(),

                LabTest.builder()
                        .testCode("LIPID")
                        .testName("Lipid Panel")
                        .description("Measures cholesterol and triglycerides")
                        .category("Chemistry")
                        .price(new BigDecimal("35.00"))
                        .sampleType("BLOOD")
                        .preparationTimeHours(8)
                        .preparationInstructions("Fast for 12 hours before test")
                        .resultTimeHours(24)
                        .normalRanges(List.of(
                                "Total Cholesterol: <200 mg/dL",
                                "HDL: >40 mg/dL",
                                "LDL: <100 mg/dL"))
                        .isActive(true)
                        .build(),

                LabTest.builder()
                        .testCode("TSH")
                        .testName("Thyroid Stimulating Hormone")
                        .description("Measures thyroid gland activity")
                        .category("Endocrinology")
                        .price(new BigDecimal("28.00"))
                        .sampleType("BLOOD")
                        .preparationTimeHours(0)
                        .preparationInstructions("No special preparation needed")
                        .resultTimeHours(24)
                        .normalRanges(List.of("TSH: 0.4-4.0 mIU/L"))
                        .isActive(true)
                        .build(),

                LabTest.builder()
                        .testCode("HBA1C")
                        .testName("Hemoglobin A1c")
                        .description("Measures average blood sugar over 3 months")
                        .category("Endocrinology")
                        .price(new BigDecimal("32.00"))
                        .sampleType("BLOOD")
                        .preparationTimeHours(0)
                        .preparationInstructions("No fasting required")
                        .resultTimeHours(48)
                        .normalRanges(List.of("HbA1c: <5.7%"))
                        .isActive(true)
                        .build(),

                LabTest.builder()
                        .testCode("VITD")
                        .testName("Vitamin D Test")
                        .description("Measures Vitamin D levels in the blood")
                        .category("Nutrition")
                        .price(new BigDecimal("38.00"))
                        .sampleType("BLOOD")
                        .preparationTimeHours(0)
                        .preparationInstructions("No fasting required")
                        .resultTimeHours(48)
                        .normalRanges(List.of("Vitamin D: 20-50 ng/mL"))
                        .isActive(true)
                        .build(),

                LabTest.builder()
                        .testCode("B12")
                        .testName("Vitamin B12 Test")
                        .description("Measures Vitamin B12 levels")
                        .category("Nutrition")
                        .price(new BigDecimal("34.00"))
                        .sampleType("BLOOD")
                        .preparationTimeHours(0)
                        .preparationInstructions("No fasting required")
                        .resultTimeHours(48)
                        .normalRanges(List.of("Vitamin B12: 200-900 pg/mL"))
                        .isActive(true)
                        .build(),

                LabTest.builder()
                        .testCode("IRON")
                        .testName("Iron Studies")
                        .description("Evaluates iron levels and storage")
                        .category("Chemistry")
                        .price(new BigDecimal("36.00"))
                        .sampleType("BLOOD")
                        .preparationTimeHours(0)
                        .preparationInstructions("No fasting required")
                        .resultTimeHours(24)
                        .normalRanges(List.of(
                                "Iron: 60-170 µg/dL",
                                "Ferritin: 12-300 ng/mL"))
                        .isActive(true)
                        .build(),

                LabTest.builder()
                        .testCode("PT")
                        .testName("Prothrombin Time")
                        .description("Measures blood clotting function")
                        .category("Coagulation")
                        .price(new BigDecimal("22.00"))
                        .sampleType("BLOOD")
                        .preparationTimeHours(0)
                        .preparationInstructions("No special preparation required")
                        .resultTimeHours(12)
                        .normalRanges(List.of("PT: 11-13.5 seconds"))
                        .isActive(true)
                        .build(),

                LabTest.builder()
                        .testCode("HCG")
                        .testName("Pregnancy Test (hCG)")
                        .description("Detects hCG hormone for pregnancy")
                        .category("Hormones")
                        .price(new BigDecimal("20.00"))
                        .sampleType("URINE")
                        .preparationTimeHours(0)
                        .preparationInstructions("Use first morning urine for accuracy")
                        .resultTimeHours(2)
                        .normalRanges(List.of("Negative: <5 mIU/mL"))
                        .isActive(true)
                        .build(),

                LabTest.builder()
                        .testCode("CRP")
                        .testName("C-Reactive Protein")
                        .description("Checks inflammation in the body")
                        .category("Immunology")
                        .price(new BigDecimal("27.00"))
                        .sampleType("BLOOD")
                        .preparationTimeHours(0)
                        .preparationInstructions("No fasting required")
                        .resultTimeHours(24)
                        .normalRanges(List.of("CRP: <10 mg/L"))
                        .isActive(true)
                        .build(),

                LabTest.builder()
                        .testCode("ESR")
                        .testName("Erythrocyte Sedimentation Rate")
                        .description("Detects inflammation through RBC sedimentation")
                        .category("Hematology")
                        .price(new BigDecimal("18.00"))
                        .sampleType("BLOOD")
                        .preparationTimeHours(0)
                        .preparationInstructions("No fasting required")
                        .resultTimeHours(24)
                        .normalRanges(List.of(
                                "Men: 0-15 mm/hr",
                                "Women: 0-20 mm/hr"))
                        .isActive(true)
                        .build(),

                LabTest.builder()
                        .testCode("UA")
                        .testName("Urinalysis")
                        .description("Examines urine for health indicators")
                        .category("Urine Test")
                        .price(new BigDecimal("15.00"))
                        .sampleType("URINE")
                        .preparationTimeHours(0)
                        .preparationInstructions("Collect midstream urine sample")
                        .resultTimeHours(12)
                        .normalRanges(List.of("Normal urine composition"))
                        .isActive(true)
                        .build(),

                LabTest.builder()
                        .testCode("STOOL")
                        .testName("Stool Test")
                        .description("Analyzes stool for infections and conditions")
                        .category("Microbiology")
                        .price(new BigDecimal("22.00"))
                        .sampleType("STOOL")
                        .preparationTimeHours(0)
                        .preparationInstructions("Collect fresh stool sample")
                        .resultTimeHours(48)
                        .normalRanges(List.of("No abnormal organisms detected"))
                        .isActive(true)
                        .build(),

                LabTest.builder()
                        .testCode("COVID")
                        .testName("COVID-19 PCR Test")
                        .description("Detects active SARS-CoV-2 infection")
                        .category("Virology")
                        .price(new BigDecimal("55.00"))
                        .sampleType("SWAB")
                        .preparationTimeHours(0)
                        .preparationInstructions("No eating/drinking 30 minutes before test")
                        .resultTimeHours(24)
                        .normalRanges(List.of("Negative"))
                        .isActive(true)
                        .build(),

                LabTest.builder()
                        .testCode("HIV")
                        .testName("HIV Antibody Test")
                        .description("Detects HIV antibodies in blood")
                        .category("Immunology")
                        .price(new BigDecimal("45.00"))
                        .sampleType("BLOOD")
                        .preparationTimeHours(0)
                        .preparationInstructions("No special preparation required")
                        .resultTimeHours(24)
                        .normalRanges(List.of("Negative"))
                        .isActive(true)
                        .build(),

                LabTest.builder()
                        .testCode("PSA")
                        .testName("Prostate Specific Antigen")
                        .description("Measures PSA levels for prostate health")
                        .category("Oncology")
                        .price(new BigDecimal("50.00"))
                        .sampleType("BLOOD")
                        .preparationTimeHours(0)
                        .preparationInstructions("Avoid ejaculation 48 hours before test")
                        .resultTimeHours(24)
                        .normalRanges(List.of("PSA: <4.0 ng/mL"))
                        .isActive(true)
                        .build()
        );

        List<LabTest> savedTests = labTestRepository.saveAll(tests);
        log.info("Seeded {} lab tests successfully", savedTests.size());

        return savedTests.size();
    }


    @Transactional
    public void clearAllData() {
        log.info("Clearing all lab data");

        labResultRepository.deleteAll();
        labOrderRepository.deleteAll();
        labTestRepository.deleteAll();

        log.info("All lab data cleared successfully");
    }
}

