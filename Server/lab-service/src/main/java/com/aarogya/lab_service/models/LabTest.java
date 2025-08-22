package com.aarogya.lab_service.models;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "lab_tests")
public class LabTest {
    @Id
    private String id;

    @Indexed(unique = true)
    private String testCode;

    private String testName;
    private String description;
    private String category;
    private BigDecimal price;
    private String sampleType;
    private Integer preparationTimeHours;
    private String preparationInstructions;
    private Integer resultTimeHours;
    private List<String> normalRanges;
    private boolean isActive;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
