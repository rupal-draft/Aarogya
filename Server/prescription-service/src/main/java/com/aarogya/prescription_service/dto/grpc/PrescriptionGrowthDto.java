package com.aarogya.prescription_service.dto.grpc;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionGrowthDto {
    private Integer year;
    private Integer month;
    private Long totalPrescriptions;
}
