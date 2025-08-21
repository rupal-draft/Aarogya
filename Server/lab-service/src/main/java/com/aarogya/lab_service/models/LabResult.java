package com.aarogya.lab_service.models;

import com.aarogya.lab_service.enums.ResultParameterStatus;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "lab_results")
@CompoundIndexes({
        @CompoundIndex(name = "order_test_unique", def = "{'orderId': 1, 'testId': 1}", unique = true)
})
public class LabResult {
    @Id
    private String id;

    @Indexed
    private String orderId;

    @Indexed
    private String patientId;

    @Indexed
    private String doctorId;

    private String testId;
    private String testCode;
    private String testName;

    @Builder.Default
    private List<ResultParameter> parameters = new ArrayList<>();

    private String overallResult;
    private String interpretation;
    private String technicalNotes;
    private String reportUrl;
    private LocalDateTime sampleCollectedAt;
    private LocalDateTime resultGeneratedAt;
    private String labTechnicianId;
    private String pathologistId;
    private boolean isVerified;
    private boolean isCritical;
    private boolean isPatientNotified;
    private boolean isDoctorNotified;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class ResultParameter {
        private String parameterName;
        private String value;
        private String unit;
        private String normalRange;
        private ResultParameterStatus status;
        private String notes;
    }

    public static LabResult fromOrderAndTest(LabOrder order, LabOrder.OrderedTest ot) {
        return LabResult.builder()
                .orderId(order.getId())
                .patientId(order.getPatientId())
                .doctorId(order.getDoctorId())
                .testId(ot.getTestId())
                .testCode(ot.getTestCode())
                .testName(ot.getTestName())
                .build();
    }
}
