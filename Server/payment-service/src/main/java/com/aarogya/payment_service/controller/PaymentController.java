package com.aarogya.payment_service.controller;

import com.aarogya.payment_service.dto.request.InitiateAppointmentPaymentRequest;
import com.aarogya.payment_service.dto.request.VerifyPaymentRequest;
import com.aarogya.payment_service.dto.request.WebhookRequest;
import com.aarogya.payment_service.dto.response.AppointmentPaymentDetailsResponse;
import com.aarogya.payment_service.dto.response.AppointmentPaymentResponse;
import com.aarogya.payment_service.service.AppointmentPaymentService;
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

    @PostMapping("/webhook")
    public ResponseEntity<Void> handleWebhook(
            @RequestBody WebhookRequest webhookRequest,
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature) {

        log.info("Received Razorpay webhook: {}", webhookRequest.getEvent());
        paymentService.processWebhook(webhookRequest, signature);
        return ResponseEntity.ok().build();
    }


    @PostMapping("/confirm")
    public ResponseEntity<Void> confirmPaymentWithoutWebhook(@Valid @RequestBody VerifyPaymentRequest request) {
        log.debug("Verifying payment status for order: {}", request.getRazorpayOrderId());
        boolean processed = paymentService.confirmPaymentWithoutWebhook(request);
        return processed ? ResponseEntity.ok().build()
                : ResponseEntity.status(HttpStatus.ALREADY_REPORTED).build();
    }


    @PostMapping("/verify")
    public ResponseEntity<Map<String, Boolean>> verifyPayment(@Valid @RequestBody VerifyPaymentRequest request) {
        log.debug("Verifying payment signature for order: {}", request.getRazorpayOrderId());
        boolean isValid = paymentService.verifyPaymentSignature(request);
        return ResponseEntity.ok(Map.of("valid", isValid));
    }

    // Fallback methods
    public ResponseEntity<AppointmentPaymentResponse> initiatePaymentFallback(InitiateAppointmentPaymentRequest request, Throwable t) {
        log.error("Fallback triggered for initiatePayment: {}", t.getMessage());
        return ResponseEntity.badRequest().build();
    }
}
