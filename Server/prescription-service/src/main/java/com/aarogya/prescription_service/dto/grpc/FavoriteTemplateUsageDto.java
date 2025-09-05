package com.aarogya.prescription_service.dto.grpc;


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
