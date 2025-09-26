package com.aarogya.payment_service.service.implementation;

import com.aarogya.payment_service.dto.request.InitiateAppointmentPaymentRequest;
import com.aarogya.payment_service.dto.request.VerifyPaymentRequest;
import com.aarogya.payment_service.dto.request.WebhookRequest;
import com.aarogya.payment_service.dto.response.AppointmentPaymentDetailsResponse;
import com.aarogya.payment_service.dto.response.AppointmentPaymentResponse;
import com.aarogya.payment_service.enums.PaymentStatus;
import com.aarogya.payment_service.events.AppointmentApproveEvent;
import com.aarogya.payment_service.events.AppointmentRejectEvent;
import com.aarogya.payment_service.exceptions.BadRequestException;
import com.aarogya.payment_service.exceptions.PaymentException;
import com.aarogya.payment_service.exceptions.ResourceNotFound;
import com.aarogya.payment_service.models.AppointmentPayment;
import com.aarogya.payment_service.repository.AppointmentPaymentRepository;
import com.aarogya.payment_service.service.AppointmentPaymentService;
import com.aarogya.payment_service.util.PaymentSignature;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.kafka.KafkaException;
import org.springframework.kafka.core.KafkaTemplate;
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
    private final PaymentSignature paymentSignature;
    private final KafkaTemplate<String, AppointmentApproveEvent> appointmentApproveEventKafkaTemplate;
    private final KafkaTemplate<String, AppointmentRejectEvent> appointmentRejectEventKafkaTemplate;

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
    public void processWebhook(WebhookRequest webhookRequest, String signature) {
        log.info("Processing Razorpay webhook event: {}", webhookRequest.getEvent());

        try {
            if (!"local".equalsIgnoreCase(activeProfile)) {
                String webhookBody = webhookRequest.getPayload().toString();

                boolean isValid = Utils.verifyWebhookSignature(webhookBody, signature, webhookSecret);

                if (!isValid) {
                    log.error("Invalid webhook signature received");
                    throw new BadRequestException("Invalid webhook signature");
                }
            } else {
                log.warn("Skipping webhook signature validation in local environment");
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

            if (PaymentStatus.SUCCESS.name().equals(payment.getStatus()) ||
                    PaymentStatus.FAILED.name().equals(payment.getStatus())) {
                log.info("Skipping webhook for order {} since payment is already processed with status {}",
                        razorpayOrderId, payment.getStatus());
                return;
            }

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
    @Transactional
    public boolean confirmPaymentWithoutWebhook(VerifyPaymentRequest request) {
        log.info("Confirming payment manually for order: {}", request.getRazorpayOrderId());

        boolean valid = paymentSignature.verifyPaymentSignature(request);
        if (!valid) {
            throw new BadRequestException("Invalid payment signature");
        }

        AppointmentPayment payment = paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new ResourceNotFound("Payment not found for order: " + request.getRazorpayOrderId()));

        if (PaymentStatus.SUCCESS.name().equals(payment.getStatus())) {
            log.info("Payment for order {} is already marked as SUCCESS, skipping duplicate confirmation.",
                    request.getRazorpayOrderId());
            return false;
        } else if (PaymentStatus.FAILED.name().equals(payment.getStatus())) {
            log.warn("Payment for order {} is already marked as FAILED, skipping manual confirmation.",
                    request.getRazorpayOrderId());
            return false;
        }

        payment.setStatus(PaymentStatus.SUCCESS.name());
        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
        payment.setPaidAt(LocalDateTime.now());
        paymentRepository.save(payment);

        AppointmentApproveEvent approveEvent =
                new AppointmentApproveEvent(payment.getAppointmentId(), payment.getId());
        appointmentApproveEventKafkaTemplate.send("appointment-approve", payment.getAppointmentId(), approveEvent);

        log.info("Payment confirmed manually for order {}", request.getRazorpayOrderId());
        return true;
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

        AppointmentApproveEvent appointmentApproveEvent = new AppointmentApproveEvent(payment.getAppointmentId(), payment.getId());
        try {
            appointmentApproveEventKafkaTemplate.send("appointment-approve", payment.getAppointmentId(), appointmentApproveEvent);
            log.info("Appointment {} confirmed via kafka", payment.getAppointmentId());
        } catch (KafkaException e) {
            log.error("Failed to confirm appointment via gRPC: {}", payment.getAppointmentId(), e);
        }
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

        AppointmentRejectEvent appointmentRejectEvent = new AppointmentRejectEvent(payment.getAppointmentId());
        try {
            appointmentRejectEventKafkaTemplate.send("appointment-reject", payment.getAppointmentId(), appointmentRejectEvent);
            log.info("Appointment {} cancelled via gRPC", payment.getAppointmentId());
        } catch (KafkaException e) {
            log.error("Failed to cancel appointment via gRPC: {}", payment.getAppointmentId(), e);
        }
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
        orderRequest.put("amount", request.getAmount());
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
