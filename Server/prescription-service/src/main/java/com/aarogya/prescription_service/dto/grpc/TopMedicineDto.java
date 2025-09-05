package com.aarogya.prescription_service.dto.grpc;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopMedicineDto {
    private String medicineId;
    private String medicineName;
    private Long count;
}
