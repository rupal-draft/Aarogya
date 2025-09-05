package com.aarogya.prescription_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicineSearchRequest {
    private String name;
    private String chemicalClass;
    private String therapeuticClass;
    private String actionClass;
    private Integer page = 0;
    private Integer size = 10;
}
