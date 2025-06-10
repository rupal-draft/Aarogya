package com.aarogya.prescription_service.model;

import com.aarogya.prescription_service.model.enums.PerformedByRole;
import com.aarogya.prescription_service.model.enums.PrescriptionAction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "prescription_history")
public class PrescriptionHistory {

    @Id
    private String id;

    @Indexed
    private String prescriptionId;

    @Indexed
    private String patientId;

    @Indexed
    private String doctorId;

    private PrescriptionAction action;
    private String fieldChanged;
    private String oldValue;
    private String newValue;
    private String reason;
    private String performedBy;
    private PerformedByRole performedByRole;

    private String ipAddress;
    private String userAgent;
    private String sessionId;

    @CreatedDate
    private LocalDateTime timestamp;
}
