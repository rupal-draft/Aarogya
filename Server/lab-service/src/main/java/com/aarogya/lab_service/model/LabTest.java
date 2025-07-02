package com.aarogya.lab_service.model;

import com.aarogya.lab_service.enums.SampleType;
import com.aarogya.lab_service.enums.TestType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Document(collection = "lab_tests")
@CompoundIndexes({
        @CompoundIndex(name = "category_name_idx", def = "{'categoryId': 1, 'name': 1}"),
        @CompoundIndex(name = "code_active_idx", def = "{'code': 1, 'isActive': 1}")
})
public class LabTest {

    @Id
    private String id;

    @NotBlank
    @Indexed
    private String name;

    @NotBlank
    @Indexed(unique = true)
    private String code;

    private String description;

    @NotNull
    @Indexed
    private String categoryId;

    private TestType type = TestType.QUANTITATIVE;

    private SampleType sampleType = SampleType.BLOOD;

    private String unit;

    private BigDecimal price;

    private Integer processingTimeHours = 24;

    private Boolean isFasting = false;

    private Boolean isUrgent = false;

    private String instructions;

    private String methodology;

    private List<String> keywords;

    private Map<String, Object> referenceRanges;

    private String reportTemplate;

    private String patientPreparationGuide;

    private List<String> commonReasons;

    private List<String> healthConditionsDetected;

    private String ageRecommendations;

    private List<String> symptomKeywords;

    private Boolean isActive = true;

    private Boolean requiresApproval = true;

    private Integer priority = 1;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}

