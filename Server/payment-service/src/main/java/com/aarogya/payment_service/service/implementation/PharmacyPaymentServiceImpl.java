package com.aarogya.payment_service.service.implementation;

import com.aarogya.payment_service.dto.request.InitiatePharmacyPaymentRequest;
import com.aarogya.payment_service.dto.request.VerifyPaymentRequest;
import com.aarogya.payment_service.dto.request.WebhookRequest;
import com.aarogya.payment_service.dto.response.PharmacyPaymentDetailsResponse;
import com.aarogya.payment_service.dto.response.PharmacyPaymentResponse;
import com.aarogya.payment_service.enums.PaymentStatus;
import com.aarogya.payment_service.events.OrderStatusUpdateEvent;
import com.aarogya.payment_service.exceptions.BadRequestException;
import com.aarogya.payment_service.exceptions.PaymentException;
import com.aarogya.payment_service.exceptions.ResourceNotFound;
import com.aarogya.payment_service.models.PharmacyPayment;
import com.aarogya.payment_service.repository.PharmacyPaymentRepository;
import com.aarogya.payment_service.service.PharmacyPaymentService;
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
public class PharmacyPaymentServiceImpl implements PharmacyPaymentService {

    private final PharmacyPaymentRepository pharmacyPaymentRepository;
    private final RazorpayClient razorpayClient;
    private final PaymentSignature paymentSignature;
    private final KafkaTemplate<String, OrderStatusUpdateEvent> orderStatusUpdataKafkaTemplate;

    @Value("${razorpay.webhook.secret}")
    private String webhookSecret;

    @Value("${deploy.env:local}")
    private String activeProfile;
    private static final String RAZORPAY_CURRENCY = "INR";

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "pharmacyPayments", allEntries = true),
            @CacheEvict(value = "paymentStats", allEntries = true)
    })
    public PharmacyPaymentResponse initiatePharmacyPayment(InitiatePharmacyPaymentRequest request) {
        log.info("Initiating pharmacy payment for order: {}", request.getOrderId());

        validatePharmacyPaymentRequest(request);

        pharmacyPaymentRepository.findByOrderId(request.getOrderId())
                .ifPresent(existingPayment -> {
                    if (!existingPayment.getStatus().equals(PaymentStatus.FAILED.name())) {
                        throw new BadRequestException("Payment already exists for this order");
                    }
                });

        try {
            JSONObject orderRequest = getJsonObject(request);

            Order razorpayOrder = razorpayClient.orders.create(orderRequest);

            PharmacyPayment payment = buildPharmacyPayment(request, razorpayOrder);
            PharmacyPayment savedPayment = pharmacyPaymentRepository.save(payment);

            log.info("Pharmacy payment initiated successfully. Payment ID: {}, Razorpay Order ID: {}",
                    savedPayment.getId(), razorpayOrder.get("id"));

            return convertToPharmacyPaymentResponse(savedPayment);

        } catch (RazorpayException e) {
            log.error("Failed to create Razorpay order for pharmacy order: {}", request.getOrderId(), e);
            throw new PaymentException("Failed to create payment order: " + e.getMessage());
        }
    }

    @Override
    @Cacheable(value = "pharmacyPayments", key = "#paymentId")
    public PharmacyPaymentDetailsResponse getPharmacyPaymentDetails(String paymentId) {
        log.debug("Fetching pharmacy payment details for ID: {}", paymentId);

        PharmacyPayment payment = pharmacyPaymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFound("Pharmacy payment not found with id: " + paymentId));

        return convertToPharmacyPaymentDetailsResponse(payment);
    }

    @Override
    @Cacheable(value = "pharmacyPayments", key = "#razorpayOrderId")
    public PharmacyPaymentDetailsResponse getPharmacyPaymentByOrderId(String razorpayOrderId) {
        log.debug("Fetching pharmacy payment by Razorpay order ID: {}", razorpayOrderId);

        PharmacyPayment payment = pharmacyPaymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new ResourceNotFound("Pharmacy payment not found for order id: " + razorpayOrderId));

        return convertToPharmacyPaymentDetailsResponse(payment);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "pharmacyPayments", key = "#result?.orderId"),
            @CacheEvict(value = "pharmacyPayments", allEntries = true),
            @CacheEvict(value = "paymentStats", allEntries = true)
    })
    public void processPharmacyWebhook(WebhookRequest webhookRequest, String signature) {
        log.info("Processing Razorpay pharmacy webhook event: {}", webhookRequest.getEvent());

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
            if (notes != null && "PHARMACY".equals(notes.get("type"))) {
                PharmacyPayment payment = pharmacyPaymentRepository.findByRazorpayOrderId(razorpayOrderId)
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Pharmacy payment not found for order: " + razorpayOrderId));

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
                    handlePharmacyPaymentSuccess(razorpayOrderId, razorpayPaymentId, webhookRequest.getPayload());
                } else if ("failed".equals(status)) {
                    String failureReason = (String) entity.get("error_description");
                    handlePharmacyPaymentFailure(razorpayOrderId, failureReason, webhookRequest.getPayload());
                }
            }

        } catch (Exception e) {
            log.error("Error processing pharmacy webhook: {}", webhookRequest.getEvent(), e);
            throw new PaymentException("Failed to process webhook: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public boolean confirmPharmacyPaymentWithoutWebhook(VerifyPaymentRequest request) {
        log.info("Confirming pharmacy payment manually for order: {}", request.getRazorpayOrderId());

        boolean valid = paymentSignature.verifyPaymentSignature(request);
        if (!valid) {
            throw new BadRequestException("Invalid payment signature");
        }

        PharmacyPayment payment = pharmacyPaymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Pharmacy payment not found for order: " + request.getRazorpayOrderId()));

        if (PaymentStatus.SUCCESS.name().equals(payment.getStatus())) {
            log.info("Pharmacy payment for order {} is already marked SUCCESS, skipping duplicate confirmation.",
                    request.getRazorpayOrderId());
            return true;
        } else if (PaymentStatus.FAILED.name().equals(payment.getStatus())) {
            log.warn("Pharmacy payment for order {} is already marked FAILED, skipping manual confirmation.",
                    request.getRazorpayOrderId());
            return false;
        }

        payment.setStatus(PaymentStatus.SUCCESS.name());
        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
        payment.setPaidAt(LocalDateTime.now());
        pharmacyPaymentRepository.save(payment);

        OrderStatusUpdateEvent orderStatusUpdateEvent = new OrderStatusUpdateEvent(payment.getOrderId(), payment.getId());

        orderStatusUpdataKafkaTemplate.send("process-order", payment.getOrderId(), orderStatusUpdateEvent);

        log.info("Pharmacy payment confirmed manually for order {}", request.getRazorpayOrderId());
        return true;
    }


    @Override
    @Transactional
    public void handlePharmacyPaymentSuccess(String razorpayOrderId, String razorpayPaymentId, Map<String, Object> webhookData) {
        log.info("Handling successful pharmacy payment for order: {}", razorpayOrderId);

        PharmacyPayment payment = pharmacyPaymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Pharmacy payment not found for order: " + razorpayOrderId));

        payment.setStatus(PaymentStatus.SUCCESS.name());
        payment.setRazorpayPaymentId(razorpayPaymentId);
        payment.setPaidAt(LocalDateTime.now());
        payment.setWebhookPayload(webhookData);
        pharmacyPaymentRepository.save(payment);
    }

    @Override
    @Transactional
    public void handlePharmacyPaymentFailure(String razorpayOrderId, String failureReason, Map<String, Object> webhookData) {
        log.info("Handling failed pharmacy payment for order: {}", razorpayOrderId);

        PharmacyPayment payment = pharmacyPaymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Pharmacy payment not found for order: " + razorpayOrderId));

        payment.setStatus(PaymentStatus.FAILED.name());
        payment.setFailureReason(failureReason);
        payment.setWebhookPayload(webhookData);
        pharmacyPaymentRepository.save(payment);
    }


    private void validatePharmacyPaymentRequest(InitiatePharmacyPaymentRequest request) {
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
    
    private PharmacyPayment buildPharmacyPayment(InitiatePharmacyPaymentRequest request, Order razorpayOrder) {
        return PharmacyPayment.builder()
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

    private PharmacyPaymentResponse convertToPharmacyPaymentResponse(PharmacyPayment payment) {
        return PharmacyPaymentResponse.builder()
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

    private PharmacyPaymentDetailsResponse convertToPharmacyPaymentDetailsResponse(PharmacyPayment payment) {
        return PharmacyPaymentDetailsResponse.builder()
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

    private JSONObject getJsonObject(InitiatePharmacyPaymentRequest request) {
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", convertToPaise(request.getAmount().doubleValue()));
        orderRequest.put("currency", request.getCurrency());
        orderRequest.put("receipt", "pharmacy_order_" + request.getOrderId());

        JSONObject notes = new JSONObject();
        notes.put("orderId", request.getOrderId());
        notes.put("patientId", request.getPatientId());
        notes.put("patientName", request.getPatientName());
        notes.put("type", "PHARMACY");
        orderRequest.put("notes", notes);
        return orderRequest;
    }
}
