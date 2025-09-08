package com.aarogya.doctor_service.dto.grpc.lab;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LabTestTrendDto {
    private int year;
    private int month;
    private Long testCount;
}
