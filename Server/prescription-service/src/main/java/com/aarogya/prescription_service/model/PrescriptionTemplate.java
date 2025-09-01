package com.aarogya.prescription_service.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "prescription_templates")
@CompoundIndex(def = "{'doctorId': 1, 'name': 1}", unique = true)
@CompoundIndex(def = "{'doctorId': 1, 'tags': 1}")
@CompoundIndex(def = "{'doctorId': 1, 'isFavorite': 1}")
public class PrescriptionTemplate {
    @Id
    private String id;

    @NotBlank
    @Indexed
    private String doctorId;

    @NotBlank
    @Size(min = 1, max = 100)
    private String name;

    private String description;

    @NotBlank
    @Size(min = 1, max = 500)
    private String diagnosis;

    private String notes;

    @NotEmpty
    private List<PrescribedMedicine> medicines;

    @Builder.Default
    private List<String> tags = new ArrayList<>();

    @Builder.Default
    private List<String> applicableConditions = new ArrayList<>();

    @Builder.Default
    private Integer usageCount = 0;

    @Builder.Default
    private Boolean isFavorite = false;

    @Builder.Default
    private Boolean isActive = true;

    @Builder.Default
    private Boolean isShared = false;

    @Builder.Default
    private Integer shareCount = 0;

    @CreatedDate
    private LocalDateTime createdAt;

    private String categoryId;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Version
    private Long version;
}
