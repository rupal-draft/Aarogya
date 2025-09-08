package com.aarogya.lab_service.utils;

import com.aarogya.lab_service.enums.OrderStatus;
import com.aarogya.lab_service.enums.PaymentStatus;
import com.aarogya.lab_service.enums.ResultParameterStatus;
import com.aarogya.lab_service.enums.TestStatus;
import com.aarogya.lab_service.models.LabOrder;
import com.aarogya.lab_service.models.LabResult;
import com.aarogya.lab_service.models.LabTest;
import com.aarogya.lab_service.repository.LabTestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
public class LabOrderResultSeeder implements CommandLineRunner {

    private final MongoTemplate mongoTemplate;
    private final LabTestRepository labTestRepository;

    private static final String DOCTOR_ID = "68a810b60474d478779e5c6d";
    private static final List<String> PATIENT_IDS = List.of(
            "68a80e1b0474d478779e5c6c",
            "68be8b448278f71c91f3e685",
            "68be8b448278f71c91f3e686",
            "68be8b448278f71c91f3e687"
    );

    @Override
    public void run(String... args) {
        if (mongoTemplate.count(new Query(), LabOrder.class) == 1) {
            return;
        }

        List<LabTest> allTests = labTestRepository.findAll();
        if (allTests.isEmpty()) {
            throw new IllegalStateException("No LabTests found, seed LabTests first!");
        }

        Random random = new Random();

        for (int i = 0; i < 6; i++) {
            String patientId = PATIENT_IDS.get(random.nextInt(PATIENT_IDS.size()));

            List<LabTest> selectedTests = random.ints(0, allTests.size())
                    .distinct().limit(3).mapToObj(allTests::get).toList();

            List<LabOrder.OrderedTest> orderedTests = selectedTests.stream()
                    .map(test -> LabOrder.OrderedTest.builder()
                            .testId(test.getId())
                            .testCode(test.getTestCode())
                            .testName(test.getTestName())
                            .price(test.getPrice())
                            .status(TestStatus.ORDERED)
                            .sampleCollectedAt(LocalDateTime.now().minusHours(1))
                            .resultExpectedAt(LocalDateTime.now().plusHours(test.getResultTimeHours()))
                            .build())
                    .toList();

            BigDecimal total = orderedTests.stream()
                    .map(LabOrder.OrderedTest::getPrice)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            LabOrder order = LabOrder.builder()
                    .orderNumber("ORD-" + (1000 + i))
                    .patientId(patientId)
                    .doctorId(DOCTOR_ID)
                    .orderedTests(orderedTests)
                    .totalAmount(total)
                    .status(OrderStatus.CONFIRMED)
                    .paymentStatus(PaymentStatus.PAID)
                    .paymentId("PAY-" + (5000 + i))
                    .scheduledDateTime(LocalDateTime.now().plusDays(1))
                    .location("City Lab Center - Room " + (i + 1))
                    .specialInstructions("Handle with care - fasting required")
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            mongoTemplate.save(order);
        }

        List<LabOrder> savedOrders = mongoTemplate.findAll(LabOrder.class);
        int techCounter = 1;

        for (LabOrder order : savedOrders) {
            for (LabOrder.OrderedTest ot : order.getOrderedTests()) {
                LabResult result = LabResult.fromOrderAndTest(order, ot);

                result.setParameters(List.of(
                        LabResult.ResultParameter.builder()
                                .parameterName("Primary Value")
                                .value(String.valueOf(80 + random.nextInt(20)))
                                .unit("mg/dL")
                                .normalRange("70-100 mg/dL")
                                .status(ResultParameterStatus.NORMAL)
                                .notes("Looks within normal range")
                                .build()
                ));

                result.setOverallResult("Normal");
                result.setInterpretation("No abnormalities detected.");
                result.setTechnicalNotes("Automated analyzer used.");
                result.setReportUrl("https://example.com/reports/"
                        + order.getOrderNumber() + "-" + ot.getTestCode() + ".pdf");
                result.setSampleCollectedAt(ot.getSampleCollectedAt());
                result.setResultGeneratedAt(LocalDateTime.now());
                result.setLabTechnicianId("TECH-" + techCounter);
                result.setPathologistId("PATH-" + techCounter);
                result.setVerified(true);
                result.setDoctorNotified(true);
                result.setPatientNotified(true);
                result.setCritical(false);

                mongoTemplate.save(result);
            }
            techCounter++;
        }

        System.out.println("✅ Seeded " + savedOrders.size() + " LabOrders and LabResults dynamically.");
    }
}
