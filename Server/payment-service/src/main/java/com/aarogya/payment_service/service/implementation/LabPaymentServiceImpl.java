package com.aarogya.payment_service.service.implementation;

import com.aarogya.payment_service.dto.request.InitiateLabPaymentRequest;
import com.aarogya.payment_service.dto.request.VerifyPaymentRequest;
import com.aarogya.payment_service.dto.request.WebhookRequest;
import com.aarogya.payment_service.dto.response.LabPaymentDetailsResponse;
import com.aarogya.payment_service.dto.response.LabPaymentResponse;
import com.aarogya.payment_service.enums.PaymentStatus;
import com.aarogya.payment_service.events.LabOrderStatusUpdateEvent;
import com.aarogya.payment_service.exceptions.BadRequestException;
import com.aarogya.payment_service.exceptions.PaymentException;
import com.aarogya.payment_service.exceptions.ResourceNotFound;
import com.aarogya.payment_service.models.LabPayment;
import com.aarogya.payment_service.repository.LabPaymentRepository;
import com.aarogya.payment_service.service.LabPaymentService;
import com.aarogya.payment_service.util.PaymentSignature;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.common.errors.ResourceNotFoundException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class LabPaymentServiceImpl implements LabPaymentService {

    private final LabPaymentRepository labPaymentRepository;
    private final RazorpayClient razorpayClient;
    private final PaymentSignature paymentSignature;
    private final KafkaTemplate<String, LabOrderStatusUpdateEvent> labOrderStatusUpdateKafkaTemplate;

    @Value("${razorpay.webhook.secret}")
    private String webhookSecret;

    @Value("${deploy.env:local}")
    private String activeProfile;
    private static final String RAZORPAY_CURRENCY = "INR";
    private static final String LAB_PAYMENT_CACHE = "labPayments";

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = LAB_PAYMENT_CACHE, allEntries = true),
            @CacheEvict(value = "paymentStats", allEntries = true)
    })
    public LabPaymentResponse initiateLabPayment(InitiateLabPaymentRequest request) {
        log.info("Initiating lab payment for order: {}", request.getOrderId());

        validateLabPaymentRequest(request);

        labPaymentRepository.findByOrderId(request.getOrderId())
                .ifPresent(existingPayment -> {
                    if (!existingPayment.getStatus().equals(PaymentStatus.FAILED.name())) {
                        throw new BadRequestException("Payment already exists for this lab order");
                    }
                });

        try {
            JSONObject orderRequest = getJsonObject(request);

            Order razorpayOrder = razorpayClient.orders.create(orderRequest);

            LabPayment payment = buildLabPayment(request, razorpayOrder);
            LabPayment savedPayment = labPaymentRepository.save(payment);

            log.info("Lab payment initiated successfully. Payment ID: {}, Razorpay Order ID: {}",
                    savedPayment.getId(), razorpayOrder.get("id"));

            return convertToLabPaymentResponse(savedPayment);

        } catch (RazorpayException e) {
            log.error("Failed to create Razorpay order for lab order: {}", request.getOrderId(), e);
            throw new PaymentException("Failed to create payment order: " + e.getMessage());
        }
    }

    @Override
    @Cacheable(value = LAB_PAYMENT_CACHE, key = "#paymentId")
    public LabPaymentDetailsResponse getLabPaymentDetails(String paymentId) {
        log.debug("Fetching lab payment details for ID: {}", paymentId);

        LabPayment payment = labPaymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFound("Lab payment not found with id: " + paymentId));

        return convertToLabPaymentDetailsResponse(payment);
    }

    @Override
    @Cacheable(value = LAB_PAYMENT_CACHE, key = "#razorpayOrderId")
    public LabPaymentDetailsResponse getLabPaymentByOrderId(String razorpayOrderId) {
        log.debug("Fetching lab payment by Razorpay order ID: {}", razorpayOrderId);

        LabPayment payment = labPaymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new ResourceNotFound("Lab payment not found for order id: " + razorpayOrderId));

        return convertToLabPaymentDetailsResponse(payment);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = LAB_PAYMENT_CACHE, key = "#result?.orderId"),
            @CacheEvict(value = LAB_PAYMENT_CACHE, allEntries = true),
            @CacheEvict(value = "paymentStats", allEntries = true)
    })
    public void processLabWebhook(WebhookRequest webhookRequest, String signature) {
        log.info("Processing Razorpay lab webhook event: {}", webhookRequest.getEvent());

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

            Map<String, Object> notes = (Map<String, Object>) entity.get("notes");
            if (notes != null && "LAB".equals(notes.get("type"))) {
                LabPayment payment = labPaymentRepository.findByRazorpayOrderId(razorpayOrderId)
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Lab payment not found for order: " + razorpayOrderId));

                if (PaymentStatus.SUCCESS.name().equals(payment.getStatus()) ||
                        PaymentStatus.FAILED.name().equals(payment.getStatus())) {
                    log.info("Skipping webhook for order {} since payment already processed with status {}",
                            razorpayOrderId, payment.getStatus());
                    return;
                }

                payment.setRazorpayPaymentId(razorpayPaymentId);
                payment.setWebhookPayload(webhookRequest.getPayload());
                payment.setRazorpayResponse((Map<String, Object>) entity);

                if ("captured".equals(status)) {
                    handleLabPaymentSuccess(razorpayOrderId, razorpayPaymentId, webhookRequest.getPayload());
                } else if ("failed".equals(status)) {
                    String failureReason = (String) entity.get("error_description");
                    handleLabPaymentFailure(razorpayOrderId, failureReason, webhookRequest.getPayload());
                }
            }

        } catch (Exception e) {
            log.error("Error processing lab webhook: {}", webhookRequest.getEvent(), e);
            throw new PaymentException("Failed to process webhook: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public boolean confirmLabPaymentWithoutWebhook(VerifyPaymentRequest request) {
        log.info("Confirming lab payment manually for order: {}", request.getRazorpayOrderId());

        boolean valid = paymentSignature.verifyPaymentSignature(request);
        if (!valid) {
            throw new BadRequestException("Invalid payment signature");
        }

        LabPayment payment = labPaymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Lab payment not found for order: " + request.getRazorpayOrderId()));

        if (PaymentStatus.SUCCESS.name().equals(payment.getStatus())) {
            log.info("Lab payment for order {} is already marked SUCCESS, skipping duplicate confirmation.",
                    request.getRazorpayOrderId());
            return true;
        } else if (PaymentStatus.FAILED.name().equals(payment.getStatus())) {
            log.warn("Lab payment for order {} is already marked FAILED, skipping manual confirmation.",
                    request.getRazorpayOrderId());
            return false;
        }

        payment.setStatus(PaymentStatus.SUCCESS.name());
        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
        payment.setPaidAt(LocalDateTime.now());
        labPaymentRepository.save(payment);

        LabOrderStatusUpdateEvent labOrderStatusUpdateEvent = new LabOrderStatusUpdateEvent(payment.getOrderId(), payment.getId());
        labOrderStatusUpdateKafkaTemplate.send("confirm-lab-order", payment.getOrderId(), labOrderStatusUpdateEvent);

        log.info("Lab payment confirmed manually for order {}", request.getRazorpayOrderId());
        return true;
    }

    @Override
    @Transactional
    public void handleLabPaymentSuccess(String razorpayOrderId, String razorpayPaymentId, Map<String, Object> webhookData) {
        log.info("Handling successful lab payment for order: {}", razorpayOrderId);

        LabPayment payment = labPaymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Lab payment not found for order: " + razorpayOrderId));

        payment.setStatus(PaymentStatus.SUCCESS.name());
        payment.setRazorpayPaymentId(razorpayPaymentId);
        payment.setPaidAt(LocalDateTime.now());
        payment.setWebhookPayload(webhookData);
        labPaymentRepository.save(payment);

        LabOrderStatusUpdateEvent labOrderStatusUpdateEvent = new LabOrderStatusUpdateEvent(payment.getOrderId(), payment.getId());
        labOrderStatusUpdateKafkaTemplate.send("confirm-lab-order", payment.getOrderId(), labOrderStatusUpdateEvent);

        log.info("Lab order {} processed successfully via Kafka", payment.getOrderId());
    }

    @Override
    @Transactional
    public void handleLabPaymentFailure(String razorpayOrderId, String failureReason, Map<String, Object> webhookData) {
        log.info("Handling failed lab payment for order: {}", razorpayOrderId);

        LabPayment payment = labPaymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Lab payment not found for order: " + razorpayOrderId));

        payment.setStatus(PaymentStatus.FAILED.name());
        payment.setFailureReason(failureReason);
        payment.setWebhookPayload(webhookData);
        labPaymentRepository.save(payment);

        log.info("Lab order {} marked as failed due to payment failure", payment.getOrderId());
    }

    private void validateLabPaymentRequest(InitiateLabPaymentRequest request) {
        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Amount must be greater than 0");
        }

        if (!RAZORPAY_CURRENCY.equalsIgnoreCase(request.getCurrency())) {
            throw new BadRequestException("Only INR currency is supported for now");
        }
    }

    private int convertToPaise(Double amount) {
        return (int) (amount * 100);
    }

    private LabPayment buildLabPayment(InitiateLabPaymentRequest request, Order razorpayOrder) {
        return LabPayment.builder()
                .orderId(request.getOrderId())
                .patientId(request.getPatientId())
                .patientName(request.getPatientName())
                .amount(request.getAmount())
                .currency(request.getCurrency())
                .status(PaymentStatus.INITIATED.name())
                .razorpayOrderId(razorpayOrder.get("id"))
                .razorpayResponse(razorpayOrder.toJson().toMap())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    private LabPaymentResponse convertToLabPaymentResponse(LabPayment payment) {
        return LabPaymentResponse.builder()
                .paymentId(payment.getId())
                .orderId(payment.getOrderId())
                .razorpayOrderId(payment.getRazorpayOrderId())
                .razorpayKey(System.getenv("RAZORPAY_KEY_ID"))
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .status(payment.getStatus())
                .createdAt(payment.getCreatedAt())
                .build();
    }

    private LabPaymentDetailsResponse convertToLabPaymentDetailsResponse(LabPayment payment) {
        return LabPaymentDetailsResponse.builder()
                .paymentId(payment.getId())
                .orderId(payment.getOrderId())
                .patientId(payment.getPatientId())
                .patientName(payment.getPatientName())
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

    private JSONObject getJsonObject(InitiateLabPaymentRequest request) {
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", convertToPaise(request.getAmount().doubleValue()));
        orderRequest.put("currency", request.getCurrency());
        orderRequest.put("receipt", "lab_order_" + request.getOrderId());

        JSONObject notes = new JSONObject();
        notes.put("orderId", request.getOrderId());
        notes.put("patientId", request.getPatientId());
        notes.put("patientName", request.getPatientName());
        notes.put("type", "LAB");
        orderRequest.put("notes", notes);
        return orderRequest;
    }
}
