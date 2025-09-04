package com.aarogya.payment_service.service.implementation;

import com.aarogya.payment_service.dto.request.InitiatePharmacyPaymentRequest;
import com.aarogya.payment_service.dto.request.WebhookRequest;
import com.aarogya.payment_service.dto.response.PharmacyPaymentDetailsResponse;
import com.aarogya.payment_service.dto.response.PharmacyPaymentResponse;
import com.aarogya.payment_service.enums.PaymentStatus;
import com.aarogya.payment_service.exceptions.BadRequestException;
import com.aarogya.payment_service.exceptions.PaymentException;
import com.aarogya.payment_service.models.PharmacyPayment;
import com.aarogya.payment_service.repository.PharmacyPaymentRepository;
import com.aarogya.payment_service.service.PharmacyPaymentService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Refund;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
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

    @Value("${razorpay.webhook.secret}")
    private String webhookSecret;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Value("${deploy.env:local}")
    private String activeProfile;
    private static final String RAZORPAY_CURRENCY = "INR";
    private static final String PAYMENT_CACHE = "payments";

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
    public PharmacyPaymentDetailsResponse getPharmacyPaymentDetails(String paymentId) {
        return null;
    }

    @Override
    public PharmacyPaymentDetailsResponse getPharmacyPaymentByOrderId(String razorpayOrderId) {
        return null;
    }

    @Override
    public void processPharmacyWebhook(WebhookRequest webhookRequest) {

    }

    @Override
    public void handlePharmacyPaymentSuccess(String razorpayOrderId, String razorpayPaymentId, Map<String, Object> webhookData) {

    }

    @Override
    public void handlePharmacyPaymentFailure(String razorpayOrderId, String failureReason, Map<String, Object> webhookData) {

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
