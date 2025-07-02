package com.aarogya.lab_service.model;

import com.aarogya.lab_service.enums.CollectionStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Document(collection = "sample_collections")
public class SampleCollection {

    @Id
    private String id;

    @NotNull
    @Indexed
    private String orderId;

    @NotNull
    @Indexed
    private String patientId;

    @Indexed
    private String technicianId;

    private CollectionStatus status = CollectionStatus.SCHEDULED;

    private LocalDateTime scheduledTime;

    private LocalDateTime actualCollectionTime;

    private String collectionLocation;

    private List<SampleInfo> samples;

    private String notes;

    private String collectionMethod;

    private Map<String, String> sampleConditions;

    private Boolean isHomeCollection = false;

    private String transportationDetails;

    private String qualityIssues;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    public static class SampleInfo {
        private String testId;
        private String sampleType;
        private String containerId;
        private String barcode;
        private String volume;
        private String condition;
        private LocalDateTime collectedAt;
    }
}
