package com.aarogya.payment_service.service;

import com.aarogya.payment_service.dto.request.InitiatePharmacyPaymentRequest;
import com.aarogya.payment_service.dto.request.WebhookRequest;
import com.aarogya.payment_service.dto.response.PharmacyPaymentDetailsResponse;
import com.aarogya.payment_service.dto.response.PharmacyPaymentResponse;

import java.util.Map;

public interface PharmacyPaymentService {
    PharmacyPaymentResponse initiatePharmacyPayment(InitiatePharmacyPaymentRequest request);
    PharmacyPaymentDetailsResponse getPharmacyPaymentDetails(String paymentId);
    PharmacyPaymentDetailsResponse getPharmacyPaymentByOrderId(String razorpayOrderId);
    void processPharmacyWebhook(WebhookRequest webhookRequest);
    void handlePharmacyPaymentSuccess(String razorpayOrderId, String razorpayPaymentId, Map<String, Object> webhookData);
    void handlePharmacyPaymentFailure(String razorpayOrderId, String failureReason, Map<String, Object> webhookData);
}
