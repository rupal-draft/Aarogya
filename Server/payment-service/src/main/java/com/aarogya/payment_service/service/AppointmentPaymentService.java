package com.aarogya.payment_service.service;

import com.aarogya.payment_service.dto.request.InitiateAppointmentPaymentRequest;
import com.aarogya.payment_service.dto.request.VerifyPaymentRequest;
import com.aarogya.payment_service.dto.request.WebhookRequest;
import com.aarogya.payment_service.dto.response.AppointmentPaymentDetailsResponse;
import com.aarogya.payment_service.dto.response.AppointmentPaymentResponse;

import java.util.Map;

public interface AppointmentPaymentService {
    AppointmentPaymentResponse initiatePayment(InitiateAppointmentPaymentRequest request);
    AppointmentPaymentDetailsResponse getPaymentDetails(String paymentId);
    AppointmentPaymentDetailsResponse getPaymentByOrderId(String razorpayOrderId);
    void processWebhook(WebhookRequest webhookRequest, String signature);
    boolean verifyPaymentSignature(VerifyPaymentRequest request);
    void handlePaymentSuccess(String razorpayOrderId, String razorpayPaymentId, Map<String, Object> webhookData);
    void handlePaymentFailure(String razorpayOrderId, String failureReason, Map<String, Object> webhookData);
    boolean confirmPaymentWithoutWebhook(VerifyPaymentRequest request);
}
