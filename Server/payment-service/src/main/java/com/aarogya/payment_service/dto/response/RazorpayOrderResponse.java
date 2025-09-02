package com.aarogya.payment_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RazorpayOrderResponse {
    private String id;
    private String entity;
    private Long amount;
    private Long amountPaid;
    private Long amountDue;
    private String currency;
    private String receipt;
    private String status;
    private Integer attempts;
    private Map<String, Object> notes;
    private Long createdAt;
}
