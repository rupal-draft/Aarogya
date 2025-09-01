package com.aarogya.prescription_service.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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
@Document(collection = "template_categories")
@CompoundIndex(def = "{'doctorId': 1, 'name': 1}", unique = true)
public class TemplateCategory {
    @Id
    private String id;

    @NotBlank
    private String doctorId;

    @NotBlank
    @Size(min = 1, max = 50)
    private String name;

    private String description;

    @Builder.Default
    private Integer templateCount = 0;

    @Builder.Default
    private Boolean isActive = true;

    @CreatedDate
    private LocalDateTime createdAt;
}
