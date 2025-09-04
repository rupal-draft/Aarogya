package com.aarogya.payment_service.util;

import com.aarogya.payment_service.dto.request.VerifyPaymentRequest;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class PaymentSignature {

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    public boolean verifyPaymentSignature(VerifyPaymentRequest request) {
        try {
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", request.getRazorpayOrderId());
            attributes.put("razorpay_payment_id", request.getRazorpayPaymentId());
            attributes.put("razorpay_signature", request.getRazorpaySignature());

            return Utils.verifyPaymentSignature(attributes, razorpayKeySecret);
        } catch (RazorpayException e) {
            log.error("Failed to verify payment signature", e);
            return false;
        }
    }
}
