package com.aarogya.payment_service.service.implementation;

import com.aarogya.payment_service.dto.request.InitiateAppointmentPaymentRequest;
import com.aarogya.payment_service.dto.request.VerifyPaymentRequest;
import com.aarogya.payment_service.dto.request.WebhookRequest;
import com.aarogya.payment_service.dto.response.AppointmentPaymentDetailsResponse;
import com.aarogya.payment_service.dto.response.AppointmentPaymentResponse;
import com.aarogya.payment_service.enums.PaymentStatus;
import com.aarogya.payment_service.exceptions.BadRequestException;
import com.aarogya.payment_service.exceptions.PaymentException;
import com.aarogya.payment_service.exceptions.ResourceNotFound;
import com.aarogya.payment_service.models.AppointmentPayment;
import com.aarogya.payment_service.repository.AppointmentPaymentRepository;
import com.aarogya.payment_service.service.AppointmentPaymentService;
import com.razorpay.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class AppointmentPaymentServiceImpl implements AppointmentPaymentService {

    private final AppointmentPaymentRepository paymentRepository;
    private final RazorpayClient razorpayClient;

    @Value("${razorpay.webhook.secret}")
    private String webhookSecret;

    @Value("${deploy.env:local}")
    private String activeProfile;

    private static final String RAZORPAY_CURRENCY = "INR";
    private static final String PAYMENT_CACHE = "payments";

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = PAYMENT_CACHE, allEntries = true),
            @CacheEvict(value = "paymentStats", allEntries = true)
    })
    public AppointmentPaymentResponse initiatePayment(InitiateAppointmentPaymentRequest request) {
        log.info("Initiating payment for appointment: {}", request.getAppointmentId());

        validatePaymentRequest(request);

        paymentRepository.findByAppointmentId(request.getAppointmentId())
                .ifPresent(existingPayment -> {
                    if (!existingPayment.getStatus().equals(PaymentStatus.FAILED.name())) {
                        throw new BadRequestException("Payment already exists for this appointment");
                    }
                });

        try {
            JSONObject orderRequest = getJsonObject(request);

            Order razorpayOrder = razorpayClient.orders.create(orderRequest);

            AppointmentPayment payment = buildPayment(request, razorpayOrder);
            AppointmentPayment savedPayment = paymentRepository.save(payment);

            log.info("Payment initiated successfully. Payment ID: {}, Razorpay Order ID: {}",
                    savedPayment.getId(), razorpayOrder.get("id"));

            return convertToPaymentResponse(savedPayment);

        } catch (RazorpayException e) {
            log.error("Failed to create Razorpay order for appointment: {}", request.getAppointmentId(), e);
            throw new PaymentException("Failed to create payment order: " + e.getMessage());
        }
    }

    @Override
    @Cacheable(value = PAYMENT_CACHE, key = "#paymentId")
    public AppointmentPaymentDetailsResponse getPaymentDetails(String paymentId) {
        log.debug("Fetching payment details for ID: {}", paymentId);

        AppointmentPayment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFound("Payment not found with id: " + paymentId));

        return convertToPaymentDetailsResponse(payment);
    }

    @Override
    @Cacheable(value = PAYMENT_CACHE, key = "#razorpayOrderId")
    public AppointmentPaymentDetailsResponse getPaymentByOrderId(String razorpayOrderId) {
        log.debug("Fetching payment by Razorpay order ID: {}", razorpayOrderId);

        AppointmentPayment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new ResourceNotFound("Payment not found for order id: " + razorpayOrderId));

        return convertToPaymentDetailsResponse(payment);
    }

    @Override
    @Transactional
    public void processWebhook(WebhookRequest webhookRequest) {
        log.info("Processing Razorpay webhook event: {}", webhookRequest.getEvent());

        try {
            if (!"local".equals(activeProfile)) {
                String actualSignature = webhookRequest.getHeaders().get("x-razorpay-signature");
                String webhookBody = webhookRequest.getPayload().toString();

                boolean isValid = Utils.verifyWebhookSignature(webhookBody, actualSignature, webhookSecret);

                if (!isValid) {
                    log.error("Invalid webhook signature received");
                    throw new BadRequestException("Invalid webhook signature");
                }
            }

            Map<String, Object> payload = webhookRequest.getPayload();
            Map<String, Object> paymentEntity = (Map<String, Object>) payload.get("payload");
            Map<String, Object> paymentData = (Map<String, Object>) paymentEntity.get("payment");
            Map<String, Object> entity = (Map<String, Object>) paymentData.get("entity");

            String razorpayOrderId = (String) entity.get("order_id");
            String razorpayPaymentId = (String) entity.get("id");
            String status = (String) entity.get("status");

            AppointmentPayment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                    .orElseThrow(() -> new ResourceNotFound("Payment not found for order: " + razorpayOrderId));

            payment.setRazorpayPaymentId(razorpayPaymentId);
            payment.setWebhookPayload(webhookRequest.getPayload());
            payment.setRazorpayResponse((Map<String, Object>) entity);

            if ("captured".equals(status)) {
                handlePaymentSuccess(razorpayOrderId, razorpayPaymentId, webhookRequest.getPayload());
            } else if ("failed".equals(status)) {
                String failureReason = (String) entity.get("error_description");
                handlePaymentFailure(razorpayOrderId, failureReason, webhookRequest.getPayload());
            }

        } catch (RazorpayException e) {
            log.error("Error processing webhook: {}", webhookRequest.getEvent(), e);
            throw new PaymentException("Failed to process webhook: " + e.getMessage());
        }
    }

    @Override
    public boolean verifyPaymentSignature(VerifyPaymentRequest request) {
        try {
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", request.getRazorpayOrderId());
            attributes.put("razorpay_payment_id", request.getRazorpayPaymentId());
            attributes.put("razorpay_signature", request.getRazorpaySignature());

            return Utils.verifyPaymentSignature(attributes, System.getenv("RAZORPAY_KEY_SECRET"));
        } catch (RazorpayException e) {
            log.error("Failed to verify payment signature", e);
            return false;
        }
    }

    @Override
    @Transactional
    public void handlePaymentSuccess(String razorpayOrderId, String razorpayPaymentId, Map<String, Object> webhookData) {
        log.info("Handling successful payment for order: {}", razorpayOrderId);

        AppointmentPayment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new ResourceNotFound("Payment not found for order: " + razorpayOrderId));

        payment.setStatus(PaymentStatus.SUCCESS.name());
        payment.setRazorpayPaymentId(razorpayPaymentId);
        payment.setPaidAt(LocalDateTime.now());
        payment.setWebhookPayload(webhookData);
        paymentRepository.save(payment);

        // Placeholder for gRPC call to Appointment Service
//        try {
//            appointmentServiceClient.confirmAppointment(payment.getAppointmentId(), payment.getId());
//            log.info("Appointment {} confirmed via gRPC", payment.getAppointmentId());
//        } catch (Exception e) {
//            log.error("Failed to confirm appointment via gRPC: {}", payment.getAppointmentId(), e);
//            // Implement retry logic or dead letter queue
//        }
    }

    @Override
    @Transactional
    public void handlePaymentFailure(String razorpayOrderId, String failureReason, Map<String, Object> webhookData) {
        log.info("Handling failed payment for order: {}", razorpayOrderId);

        AppointmentPayment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new ResourceNotFound("Payment not found for order: " + razorpayOrderId));

        payment.setStatus(PaymentStatus.FAILED.name());
        payment.setFailureReason(failureReason);
        payment.setWebhookPayload(webhookData);
        paymentRepository.save(payment);

        // Placeholder for gRPC call to Appointment Service
//        try {
//            appointmentServiceClient.cancelAppointment(payment.getAppointmentId(), payment.getId(), failureReason);
//            log.info("Appointment {} cancelled via gRPC", payment.getAppointmentId());
//        } catch (Exception e) {
//            log.error("Failed to cancel appointment via gRPC: {}", payment.getAppointmentId(), e);
//        }
    }


    private void validatePaymentRequest(InitiateAppointmentPaymentRequest request) {
        if (request.getAmount() <= 0) {
            throw new BadRequestException("Amount must be greater than 0");
        }

        if (!RAZORPAY_CURRENCY.equalsIgnoreCase(request.getCurrency())) {
            throw new BadRequestException("Only INR currency is supported for now");
        }
    }

    private AppointmentPayment buildPayment(InitiateAppointmentPaymentRequest request, Order razorpayOrder) {
        return AppointmentPayment.builder()
                .appointmentId(request.getAppointmentId())
                .doctorId(request.getDoctorId())
                .patientId(request.getPatientId())
                .amount(request.getAmount())
                .currency(request.getCurrency())
                .status(PaymentStatus.INITIATED.name())
                .razorpayOrderId(razorpayOrder.get("id"))
                .razorpayResponse(razorpayOrder.toJson().toMap())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    private int convertToPaise(Double amount) {
        return (int) (amount * 100);
    }

    private AppointmentPaymentResponse convertToPaymentResponse(AppointmentPayment payment) {
        return AppointmentPaymentResponse.builder()
                .paymentId(payment.getId())
                .appointmentId(payment.getAppointmentId())
                .razorpayOrderId(payment.getRazorpayOrderId())
                .razorpayKey(System.getenv("RAZORPAY_KEY_ID"))
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .status(payment.getStatus())
                .createdAt(payment.getCreatedAt())
                .build();
    }

    private AppointmentPaymentDetailsResponse convertToPaymentDetailsResponse(AppointmentPayment payment) {
        return AppointmentPaymentDetailsResponse.builder()
                .paymentId(payment.getId())
                .appointmentId(payment.getAppointmentId())
                .doctorId(payment.getDoctorId())
                .patientId(payment.getPatientId())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .status(payment.getStatus())
                .razorpayOrderId(payment.getRazorpayOrderId())
                .razorpayPaymentId(payment.getRazorpayPaymentId())
                .failureReason(payment.getFailureReason())
                .createdAt(payment.getCreatedAt())
                .paidAt(payment.getPaidAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }

    private JSONObject getJsonObject(InitiateAppointmentPaymentRequest request) {
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", convertToPaise(request.getAmount()));
        orderRequest.put("currency", request.getCurrency());
        orderRequest.put("receipt", "receipt_" + request.getAppointmentId());

        JSONObject notes = new JSONObject();
        notes.put("appointmentId", request.getAppointmentId());
        notes.put("doctorId", request.getDoctorId());
        notes.put("patientId", request.getPatientId());
        orderRequest.put("notes", notes);
        return orderRequest;
    }
}
