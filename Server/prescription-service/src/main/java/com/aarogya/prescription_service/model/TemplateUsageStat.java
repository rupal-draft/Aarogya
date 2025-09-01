package com.aarogya.prescription_service.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "template_usage_stats")
@CompoundIndex(def = "{'templateId': 1, 'usageDate': 1}")
public class TemplateUsageStat {
    @Id
    private String id;

    @NotBlank
    private String templateId;

    @NotBlank
    private String doctorId;

    @NotNull
    private LocalDateTime usageDate;

    private String patientId;
    private String appointmentId;

    @Builder.Default
    private Boolean wasModified = false;

    private String modifications;

    @CreatedDate
    private LocalDateTime createdAt;
}
