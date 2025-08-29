package com.aarogya.prescription_service.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "medicine_interactions")
@CompoundIndex(def = "{'drug1': 1, 'drug2': 1}", unique = true)
public class MedicineInteraction {
    @Id
    private String id;

    @Indexed
    private String drug1;

    @Indexed
    private String drug2;

    private String interactionDescription;

    @CreatedDate
    private LocalDateTime createdAt;
}
