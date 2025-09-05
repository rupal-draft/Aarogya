package com.aarogya.lab_service.dto.grpc;

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
