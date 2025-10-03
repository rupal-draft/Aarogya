package com.aarogya.payment_service.controller;

import com.aarogya.payment_service.advices.ApiResponse;
import com.aarogya.payment_service.dto.request.InitiateAppointmentPaymentRequest;
import com.aarogya.payment_service.dto.request.InitiatePharmacyPaymentRequest;
import com.aarogya.payment_service.dto.request.VerifyPaymentRequest;
import com.aarogya.payment_service.dto.request.WebhookRequest;
import com.aarogya.payment_service.dto.response.AppointmentPaymentDetailsResponse;
import com.aarogya.payment_service.dto.response.AppointmentPaymentResponse;
import com.aarogya.payment_service.dto.response.PharmacyPaymentDetailsResponse;
import com.aarogya.payment_service.dto.response.PharmacyPaymentResponse;
import com.aarogya.payment_service.service.AppointmentPaymentService;
import com.aarogya.payment_service.service.PharmacyPaymentService;
import com.aarogya.payment_service.util.PaymentSignature;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/core")
@Slf4j
@RequiredArgsConstructor
@Validated
public class PaymentController {

    private final AppointmentPaymentService paymentService;
    private final PharmacyPaymentService pharmacyPaymentService;
    private final PaymentSignature paymentSignature;

    @PostMapping("/appointment/initiate")
    @CircuitBreaker(name = "paymentController", fallbackMethod = "initiatePaymentFallback")
    @RateLimiter(name = "paymentController")
    public ResponseEntity<AppointmentPaymentResponse> initiateAppointmentPayment(@Valid @RequestBody InitiateAppointmentPaymentRequest request) {
        log.info("Received payment initiation request for appointment: {}", request.getAppointmentId());
        AppointmentPaymentResponse response = paymentService.initiatePayment(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/appointment/{paymentId}")
    public ResponseEntity<AppointmentPaymentDetailsResponse> getAppointmentPaymentDetails(@PathVariable String paymentId) {
        log.debug("Fetching payment details for ID: {}", paymentId);
        AppointmentPaymentDetailsResponse response = paymentService.getPaymentDetails(paymentId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/appointment/order/{razorpayOrderId}")
    public ResponseEntity<AppointmentPaymentDetailsResponse> getAppointmentPaymentByOrderId(@PathVariable String razorpayOrderId) {
        log.debug("Fetching payment by order ID: {}", razorpayOrderId);
        AppointmentPaymentDetailsResponse response = paymentService.getPaymentByOrderId(razorpayOrderId);
        return ResponseEntity.ok(response);
    }


    @PostMapping("/confirm/appointment")
    public ResponseEntity<ApiResponse<String>> confirmPaymentWithoutWebhook(@Valid @RequestBody VerifyPaymentRequest request) {
        log.debug("Verifying payment status for order: {}", request.getRazorpayOrderId());
        boolean processed = paymentService.confirmPaymentWithoutWebhook(request);
        return processed ? ResponseEntity.ok(ApiResponse.success("Payment confirmed!"))
                : ResponseEntity.status(HttpStatus.ALREADY_REPORTED).build();
    }


    @PostMapping("/verify")
    public ResponseEntity<Map<String, Boolean>> verifyPayment(@Valid @RequestBody VerifyPaymentRequest request) {
        log.debug("Verifying payment signature for order: {}", request.getRazorpayOrderId());
        boolean isValid = paymentSignature.verifyPaymentSignature(request);
        return ResponseEntity.ok(Map.of("valid", isValid));
    }

    // Fallback methods
    public ResponseEntity<AppointmentPaymentResponse> initiatePaymentFallback(InitiateAppointmentPaymentRequest request, Throwable t) {
        log.error("Fallback triggered for initiatePayment: {}", t.getMessage());
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/pharmacy/initiate")
    @CircuitBreaker(name = "paymentController", fallbackMethod = "initiatePharmacyPaymentFallback")
    @RateLimiter(name = "paymentController")
    public ResponseEntity<PharmacyPaymentResponse> initiatePharmacyPayment(@Valid @RequestBody InitiatePharmacyPaymentRequest request) {
        log.info("Received pharmacy payment initiation request for order: {}", request.getOrderId());
        PharmacyPaymentResponse response = pharmacyPaymentService.initiatePharmacyPayment(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/pharmacy/{paymentId}")
    public ResponseEntity<PharmacyPaymentDetailsResponse> getPharmacyPaymentDetails(@PathVariable String paymentId) {
        log.debug("Fetching pharmacy payment details for ID: {}", paymentId);
        PharmacyPaymentDetailsResponse response = pharmacyPaymentService.getPharmacyPaymentDetails(paymentId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/pharmacy/order/{razorpayOrderId}")
    public ResponseEntity<PharmacyPaymentDetailsResponse> getPharmacyPaymentByOrderId(@PathVariable String razorpayOrderId) {
        log.debug("Fetching pharmacy payment by order ID: {}", razorpayOrderId);
        PharmacyPaymentDetailsResponse response = pharmacyPaymentService.getPharmacyPaymentByOrderId(razorpayOrderId);
        return ResponseEntity.ok(response);
    }


    @PostMapping("/webhook")
    public ResponseEntity<Void> handleWebhook(
            @RequestBody WebhookRequest webhookRequest,
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature) {

        log.info("Received Razorpay webhook: {}", webhookRequest.getEvent());

        try {
            Map<String, Object> payload = webhookRequest.getPayload();
            Map<String, Object> paymentEntity = (Map<String, Object>) payload.get("payload");
            Map<String, Object> paymentData = (Map<String, Object>) paymentEntity.get("payment");
            Map<String, Object> entity = (Map<String, Object>) paymentData.get("entity");

            @SuppressWarnings("unchecked")
            Map<String, Object> notes = (Map<String, Object>) entity.get("notes");

            if (notes != null && "PHARMACY".equalsIgnoreCase((String) notes.get("type"))) {
                pharmacyPaymentService.processPharmacyWebhook(webhookRequest, signature);
            } else {
                paymentService.processWebhook(webhookRequest, signature);
            }

            return ResponseEntity.ok().build();

        } catch (Exception e) {
            log.error("Error handling Razorpay webhook", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/confirm/pharmacy")
    public ResponseEntity<ApiResponse<String>> confirmPharmacyPaymentWithoutWebhook(
            @Valid @RequestBody VerifyPaymentRequest request) {

        log.debug("Verifying pharmacy payment status for order: {}", request.getRazorpayOrderId());
        boolean processed = pharmacyPaymentService.confirmPharmacyPaymentWithoutWebhook(request);

        return processed ? ResponseEntity.ok(ApiResponse.success("Payment confirmed!"))
                : ResponseEntity.status(HttpStatus.ALREADY_REPORTED).build();
    }


    // Fallback methods
    public ResponseEntity<PharmacyPaymentResponse> initiatePharmacyPaymentFallback(InitiatePharmacyPaymentRequest request, Throwable t) {
        log.error("Fallback triggered for initiatePharmacyPayment: {}", t.getMessage());
        return ResponseEntity.badRequest().build();
    }
}
