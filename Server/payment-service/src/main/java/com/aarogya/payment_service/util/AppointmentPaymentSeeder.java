package com.aarogya.payment_service.util;

import com.aarogya.payment_service.enums.Currency;
import com.aarogya.payment_service.enums.PaymentStatus;
import com.aarogya.payment_service.models.AppointmentPayment;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Component
@RequiredArgsConstructor
public class AppointmentPaymentSeeder implements CommandLineRunner {

    private final MongoTemplate mongoTemplate;

    private static final String DOCTOR_ID = "68a810b60474d478779e5c6d";
    private static final List<String> PATIENT_IDS = List.of(
            "68a80e1b0474d478779e5c6c",
            "68be8b448278f71c91f3e685",
            "68be8b448278f71c91f3e686",
            "68be8b448278f71c91f3e687"
    );
    private static final List<String> APPOINTMENT_IDS = List.of(
            "68bee64cf03eb7a07ab61741", "68bee64cf03eb7a07ab61742", "68bee64cf03eb7a07ab61743", "68bee64cf03eb7a07ab61744",
            "68bee64cf03eb7a07ab61745", "68bee64cf03eb7a07ab61746", "68bee64cf03eb7a07ab61747", "68bee64cf03eb7a07ab61748"
    );

    @Override
    public void run(String... args) {
        if (mongoTemplate.count(new Query(), AppointmentPayment.class) > 0) {
            return; // skip if already seeded
        }

        Random random = new Random();
        List<AppointmentPayment> payments = new ArrayList<>();

        for (int i = 0; i < APPOINTMENT_IDS.size(); i++) {
            String appointmentId = APPOINTMENT_IDS.get(i);
            String patientId = PATIENT_IDS.get(random.nextInt(PATIENT_IDS.size()));

            double amount = 500 + random.nextInt(2000); // between 500–2500
            String currency = Currency.values()[random.nextInt(Currency.values().length)].name();
            String status = PaymentStatus.values()[random.nextInt(PaymentStatus.values().length)].name();

            AppointmentPayment payment = AppointmentPayment.builder()
                    .appointmentId(appointmentId)
                    .doctorId(DOCTOR_ID)
                    .patientId(patientId)
                    .amount(amount)
                    .currency(currency)
                    .status(status)
                    .razorpayOrderId("RZP_ORDER_" + (10000 + i))
                    .razorpayPaymentId(status.equals("SUCCESS") ? "RZP_PAY_" + (20000 + i) : null)
                    .razorpaySignature(status.equals("SUCCESS") ? "SIG_" + (30000 + i) : null)
                    .failureReason(status.equals("FAILED") ? "Insufficient balance" : null)
                    .refundReason(status.equals("REFUNDED") ? "Patient cancelled appointment" : null)
                    .razorpayResponse(Map.of("mockKey", "mockValue", "attempt", i + 1))
                    .webhookPayload(Map.of("event", "payment." + status.toLowerCase(), "id", UUID.randomUUID().toString()))
                    .createdAt(LocalDateTime.now().minusDays(random.nextInt(10)))
                    .updatedAt(LocalDateTime.now())
                    .paidAt(status.equals("SUCCESS") ? LocalDateTime.now().minusDays(1) : null)
                    .build();

            mongoTemplate.save(payment);
            payments.add(payment);
        }

        log.info("✅ Seeded {} AppointmentPayments", payments.size());
    }
}

