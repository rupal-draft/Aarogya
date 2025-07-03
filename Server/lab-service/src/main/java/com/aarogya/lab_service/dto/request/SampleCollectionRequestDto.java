package com.aarogya.lab_service.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SampleCollectionRequestDto {

    @NotBlank(message = "Order ID is required")
    private String orderId;

    @NotNull(message = "Scheduled time is required")
    @Future(message = "Scheduled time must be in the future")
    private LocalDateTime scheduledTime;

    @Size(max = 200, message = "Collection location cannot exceed 200 characters")
    private String collectionLocation;

    private List<SampleInfoDto> samples;

    @Size(max = 500, message = "Notes cannot exceed 500 characters")
    private String notes;

    private String collectionMethod;

    private Map<String, String> sampleConditions;

    private Boolean isHomeCollection = false;

    private String transportationDetails;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SampleInfoDto {
        @NotBlank(message = "Test ID is required")
        private String testId;

        @NotBlank(message = "Sample type is required")
        private String sampleType;

        private String containerId;
        private String volume;
        private String condition;
    }
}
