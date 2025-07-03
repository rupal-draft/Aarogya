package com.aarogya.lab_service.dto.response;

import com.aarogya.lab_service.enums.OrderPriority;
import com.aarogya.lab_service.enums.OrderStatus;
import com.aarogya.lab_service.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TestOrderResponseDto {

    private String id;
    private String patientId;
    private String doctorId;
    private List<String> testIds;
    private OrderStatus status;
    private OrderPriority priority;
    private LocalDateTime orderDate;
    private LocalDateTime expectedCompletionDate;
    private String clinicalHistory;
    private String provisionalDiagnosis;
    private String specialInstructions;
    private BigDecimal totalAmount;
    private PaymentStatus paymentStatus;
    private String paymentReference;
    private Boolean isHomeCollection;
    private String collectionAddress;
    private LocalDateTime preferredCollectionTime;
    private String assignedTechnician;
    private Map<String, Object> additionalInfo;
    private String cancellationReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<LabTestSummaryDto> testDetails;

    private PatientResponseDTO patientDetails;
    private DoctorResponseDTO doctorDetails;


    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LabTestSummaryDto {
        private String id;
        private String name;
        private String code;
        private String sampleType;
        private BigDecimal price;
        private Integer processingTimeHours;
        private Boolean isFasting;
    }
}
