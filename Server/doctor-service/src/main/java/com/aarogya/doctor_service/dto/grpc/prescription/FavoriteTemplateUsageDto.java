package com.aarogya.doctor_service.dto.grpc.prescription;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteTemplateUsageDto {
    private String templateId;
    private String templateName;
    private Long usageCount;
}
