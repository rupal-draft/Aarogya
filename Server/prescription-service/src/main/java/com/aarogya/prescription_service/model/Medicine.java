package com.aarogya.prescription_service.model;

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
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "medicines")
@CompoundIndex(def = "{'name': 'text', 'chemicalClass': 'text', 'therapeuticClass': 'text'}")
public class Medicine {
    @Id
    private String id;

    @Indexed(unique = true)
    private Long medicineId;

    @Indexed
    private String name;

    private List<String> substitutes;
    private List<String> sideEffects;
    private List<String> uses;
    private String chemicalClass;
    private Boolean habitForming;
    private String therapeuticClass;
    private String actionClass;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Version
    private Long version;
}