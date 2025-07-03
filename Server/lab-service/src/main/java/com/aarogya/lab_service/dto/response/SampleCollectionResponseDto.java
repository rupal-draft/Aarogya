package com.aarogya.lab_service.dto.response;

import com.aarogya.lab_service.enums.CollectionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SampleCollectionResponseDto {

    private String id;
    private String orderId;
    private String patientId;
    private String technicianId;
    private CollectionStatus status;
    private LocalDateTime scheduledTime;
    private LocalDateTime actualCollectionTime;
    private String collectionLocation;
    private List<SampleInfoResponseDto> samples;
    private String notes;
    private String collectionMethod;
    private Map<String, String> sampleConditions;
    private Boolean isHomeCollection;
    private String transportationDetails;
    private String qualityIssues;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SampleInfoResponseDto {
        private String testId;
        private String sampleType;
        private String containerId;
        private String barcode;
        private String volume;
        private String condition;
        private LocalDateTime collectedAt;
    }
}
