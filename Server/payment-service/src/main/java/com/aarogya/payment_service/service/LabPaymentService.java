package com.aarogya.payment_service.service;

import com.aarogya.payment_service.dto.request.InitiateLabPaymentRequest;
import com.aarogya.payment_service.dto.request.VerifyPaymentRequest;
import com.aarogya.payment_service.dto.request.WebhookRequest;
import com.aarogya.payment_service.dto.response.LabPaymentDetailsResponse;
import com.aarogya.payment_service.dto.response.LabPaymentResponse;

import java.util.Map;

public interface LabPaymentService {

    LabPaymentResponse initiateLabPayment(InitiateLabPaymentRequest request);

    LabPaymentDetailsResponse getLabPaymentDetails(String paymentId);

    LabPaymentDetailsResponse getLabPaymentByOrderId(String razorpayOrderId);

    void processLabWebhook(WebhookRequest webhookRequest, String signature);

    boolean confirmLabPaymentWithoutWebhook(VerifyPaymentRequest request);

    void handleLabPaymentSuccess(String razorpayOrderId, String razorpayPaymentId, Map<String, Object> webhookData);

    void handleLabPaymentFailure(String razorpayOrderId, String failureReason, Map<String, Object> webhookData);
}
