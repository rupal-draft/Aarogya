package com.aarogya.lab_service.dto.grpc;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopLabTestDto {
    private String testId;
    private String testName;
    private Long count;
}
