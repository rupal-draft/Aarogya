package com.aarogya.doctor_service.dto.grpc.payment;

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
