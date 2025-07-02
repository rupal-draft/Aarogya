package com.aarogya.lab_service.model;

import com.aarogya.lab_service.enums.ReportStatus;
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
@Document(collection = "lab_reports")
public class LabReport {

    @Id
    private String id;

    @NotNull
    @Indexed
    private String orderId;

    @NotNull
    @Indexed
    private String patientId;

    @Indexed
    private String doctorId;

    private ReportStatus status = ReportStatus.DRAFT;

    private String reportNumber;

    private LocalDateTime reportDate;

    private List<String> testResultIds;

    private String summary;

    private String interpretation;

    private String recommendations;

    private String clinicalCorrelation;

    private String pathologistComments;

    private String reportTemplate;

    private String filePath;

    private String fileFormat = "PDF";

    private Boolean isDigitallySigned = false;

    private String digitalSignature;

    private Map<String, Object> reportMetadata;

    private List<String> criticalValues;

    private String deliveryMethod;

    private LocalDateTime deliveredAt;

    private String deliveryStatus;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
