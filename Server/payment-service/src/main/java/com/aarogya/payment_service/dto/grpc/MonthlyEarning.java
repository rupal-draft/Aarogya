package com.aarogya.payment_service.dto.grpc;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyEarning {
    private int year;
    private int month;
    private Double totalAmount;
}
