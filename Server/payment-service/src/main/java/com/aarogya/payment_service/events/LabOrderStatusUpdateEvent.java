package com.aarogya.payment_service.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LabOrderStatusUpdateEvent {
    private String orderId;
    private String paymentId;
}
